import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { contactLimiter, getIp } from "@/lib/ratelimit";
import {
  validateTenantLead,
  resultsEmailText,
  TENANT_ROUTING,
} from "@/lib/tenant-leads";
import { TENANT_OFFER } from "@/lib/tenant-offer";
import { responseTaskDue } from "@/lib/tenant-calculations";
import { HUBSPOT } from "@/lib/constants";

type Receipt = {
  fingerprint: string;
  contactId?: string;
  dealId?: string;
  associated?: boolean;
  alert?: boolean;
  task?: boolean;
  clientEmail?: boolean;
  completed?: boolean;
};
export async function POST(req: Request) {
  if (Number(req.headers.get("content-length")) > 20000)
    return NextResponse.json({ ok: false }, { status: 413 });
  let lead, raw: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 20000)
      return NextResponse.json({ ok: false }, { status: 413 });
    raw = JSON.parse(text);
    lead = validateTenantLead(raw);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Check the required details." },
      { status: 400 },
    );
  }
  if (lead.honeypot) return NextResponse.json({ ok: false }, { status: 400 });
  // A preview must never write to the live CRM or send test emails.
  if (
    !TENANT_OFFER.approvedForPublication ||
    process.env.VERCEL_ENV === "preview"
  )
    return NextResponse.json({ ok: true, preview: true });
  if (
    typeof raw.submissionId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      raw.submissionId,
    )
  )
    return NextResponse.json({ ok: false }, { status: 400 });
  const limit = contactLimiter();
  if (limit && !(await limit.limit(getIp(req))).success)
    return NextResponse.json({ ok: false }, { status: 429 });
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.HUBSPOT_TOKEN ||
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  )
    return NextResponse.json({ ok: false, code: "DELIVERY_CONFIG" }, { status: 503 });
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  const key = `yos:tenant-lead:${raw.submissionId}`,
    lock = `${key}:lock`;
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(raw))
    .digest("hex");
  let locked = false;
  try {
    locked = Boolean(
      await redis.set(lock, "processing", {
        nx: true,
        ex: TENANT_OFFER.delivery.lockSeconds,
      }),
    );
    if (!locked) return NextResponse.json({ ok: false }, { status: 409 });
    const previous = await redis.get<Receipt>(key);
    if (previous && previous.fingerprint !== fingerprint)
      return NextResponse.json({ ok: false }, { status: 409 });
    const state: Receipt = previous || { fingerprint };
    if (state.completed) return NextResponse.json({ ok: true, duplicate: true });
    const save = () =>
      redis.set(key, state, {
        ex: TENANT_OFFER.delivery.receiptRetentionSeconds,
      });
    const token = process.env.HUBSPOT_TOKEN;
    const hs = (path: string, method: string, body: unknown) =>
      fetch(`https://api.hubapi.com${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      });
    const identity = await fetch(
      "https://api.hubapi.com/oauth/v2/private-apps/get/access-token-info",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tokenKey: token }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!identity.ok)
      return NextResponse.json({ ok: false, code: "CRM_IDENTITY" }, { status: 503 });
    if (String((await identity.json()).hubId) !== TENANT_ROUTING.portal)
      return NextResponse.json({ ok: false, code: "CRM_ACCOUNT" }, { status: 503 });
    const context = JSON.stringify(lead, null, 2);
    const callNumber = lead.fields.referredPhone || lead.fields.mobile;
    if (!state.contactId) {
      const properties = {
        firstname: lead.fields.name.split(" ")[0],
        ...(lead.fields.name.includes(" ")
          ? { lastname: lead.fields.name.split(" ").slice(1).join(" ") }
          : {}),
        ...(lead.fields.business ? { company: lead.fields.business } : {}),
        ...(lead.fields.mobile ? { phone: lead.fields.mobile } : {}),
      };
      let c = await hs(
        `/crm/v3/objects/contacts/${encodeURIComponent(lead.fields.email)}?idProperty=email`,
        "PATCH",
        { properties },
      );
      if (c.status === 404)
        c = await hs("/crm/v3/objects/contacts", "POST", {
          properties: {
            ...properties,
            email: lead.fields.email,
            hs_lead_status: "NEW",
          },
        });
      if (!c.ok) return NextResponse.json({ ok: false }, { status: 502 });
      state.contactId = (await c.json()).id;
      if (!state.contactId)
        return NextResponse.json({ ok: false }, { status: 502 });
      await save();
    }
    if (!state.dealId) {
      const deal = await hs("/crm/v3/objects/deals", "POST", {
        properties: {
          dealname: `YOS ${lead.service} ${lead.kind}: ${lead.fields.referredBusiness || lead.fields.business || lead.fields.name}`,
          pipeline: TENANT_ROUTING.pipeline,
          dealstage: TENANT_ROUTING.stage,
          description: context,
        },
      });
      if (!deal.ok) return NextResponse.json({ ok: false }, { status: 502 });
      state.dealId = (await deal.json()).id;
      if (!state.dealId)
        return NextResponse.json({ ok: false }, { status: 502 });
      await save();
    }
    if (!state.associated) {
      const a = await hs(
        `/crm/v4/objects/deals/${state.dealId}/associations/contacts/${state.contactId}`,
        "PUT",
        [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }],
      );
      if (!a.ok) return NextResponse.json({ ok: false }, { status: 502 });
      state.associated = true;
      await save();
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    if (!state.alert) {
      const alert = await resend.emails.send(
        {
          from: "YOS Team <notifications@yourofficespace.au>",
          to: [...TENANT_ROUTING.recipients],
          replyTo: lead.fields.email,
          subject: `YOS ${lead.kind}: ${lead.fields.referredBusiness || lead.fields.business || lead.fields.name} (${lead.urgency})`,
          text: `New website request\n\n${context}\n\nCall: ${callNumber ? `tel:${callNumber.replace(/[^+0-9]/g, "")}` : "Email provided"}\nCRM: https://app-ap1.hubspot.com/contacts/${TENANT_ROUTING.portal}`,
        },
        { idempotencyKey: `${raw.submissionId}-team` },
      );
      if (alert.error || !alert.data?.id)
        return NextResponse.json({ ok: false }, { status: 502 });
      state.alert = true;
      await save();
    }
    if (!state.task) {
      const task = await hs("/crm/v3/objects/tasks", "POST", {
        properties: {
          hs_task_subject: `Respond to ${lead.kind}: ${lead.fields.referredBusiness || lead.fields.business || lead.fields.name}`,
          hs_task_body: context,
          hs_task_status: "NOT_STARTED",
          hs_task_priority: "HIGH",
          hs_task_type: "TODO",
          hs_timestamp: responseTaskDue(),
        },
        associations: [
          {
            to: { id: state.contactId },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 204,
              },
            ],
          },
        ],
      });
      if (!task.ok) return NextResponse.json({ ok: false }, { status: 502 });
      state.task = true;
      await save();
    }
    if (!state.clientEmail) {
      const pdf =
        lead.kind === "checklist"
          ? "\nChecklist: https://www.yourofficespace.au/downloads/newcastle-tenants-lease-checklist.pdf\n"
          : "";
      const receipt = await resend.emails.send(
        {
          from: "YOS Team <notifications@yourofficespace.au>",
          to: lead.fields.email,
          subject:
            lead.kind === "results"
              ? "Your YOS tool results"
              : lead.kind === "referral"
                ? "Thank you for referring a business"
                : "Your request to the YOS team",
          text: `Hi ${lead.fields.name},\n\nWe received your ${lead.kind.replaceAll("_", " ")} request. ${lead.calculated ? `Your estimated results:\n${resultsEmailText(lead)}\nEstimates depend on your inputs and do not replace lease or legal advice.` : "Our team will review your details and confirm the next step."}${pdf}\n\nBook a clarity call: ${HUBSPOT.bookingUrl}\n\nThe YOS team`,
        },
        { idempotencyKey: `${raw.submissionId}-client` },
      );
      if (receipt.error || !receipt.data?.id)
        return NextResponse.json({ ok: false }, { status: 502 });
      state.clientEmail = true;
      await save();
    }
    state.completed = true;
    await save();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  } finally {
    if (locked) {
      try {
        await redis.del(lock);
      } catch {
        /* The expiring lock remains safe on a storage outage. */
      }
    }
  }
}
