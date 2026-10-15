import { readLeaseRequest, LeaseRequestError, type LeaseAttachment } from "@/lib/lease-request";
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

type Receipt = {
  fingerprint: string;
  createdAt?: string;
  alert?: boolean;
  clientEmail?: boolean;
  completed?: boolean;
};
export async function POST(req: Request) {
  let lead, raw: Record<string, unknown>, attachment: LeaseAttachment | undefined;
  try {
    ({ raw, attachment } = await readLeaseRequest(req));
    lead = validateTenantLead(raw);
    if (attachment && lead.kind !== "health_check") throw new LeaseRequestError("Lease uploads are available with a Health Check.");
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof LeaseRequestError ? error.message : "Check the required details." }, { status: error instanceof LeaseRequestError ? error.status : 400 });
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
    .update(attachment?.digest || "")
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
    if (!state.createdAt) {
      state.createdAt = new Date().toISOString();
      await save();
    }
    // Keep the provider payload identical when retrying the same submission.
    lead = { ...lead, submittedAt: state.createdAt,
      submittedSydney: new Date(state.createdAt).toLocaleString("en-AU", { timeZone: "Australia/Sydney" }),
      consent: { ...lead.consent, at: state.createdAt } };
    // Email is the active intake channel. YOS OS integration will be added
    // once its live endpoint and authentication contract are confirmed.
    const context = JSON.stringify({ ...lead, ...(attachment ? { lease: { filename: attachment.filename, bytes: attachment.size } } : {}) }, null, 2);
    const callNumber = lead.fields.referredPhone || lead.fields.mobile;
    const resend = new Resend(process.env.RESEND_API_KEY);
    if (!state.alert) {
      const alert = await resend.emails.send(
        {
          from: "YOS Team <notifications@yourofficespace.au>",
          to: [...TENANT_ROUTING.recipients],
          replyTo: lead.fields.email,
          ...(attachment ? { attachments: [{ filename: attachment.filename, content: attachment.content }] } : {}),
          subject: `YOS ${lead.kind}: ${lead.fields.referredBusiness || lead.fields.business || lead.fields.name} (${lead.urgency})`,
          text: `New website request\n\n${context}\n\nCall: ${callNumber ? `tel:${callNumber.replace(/[^+0-9]/g, "")}` : "Email provided"}\nFollow up by: ${responseTaskDue(new Date(state.createdAt))} (UTC)`,
        },
        { idempotencyKey: `${raw.submissionId}-team` },
      );
      if (alert.error || !alert.data?.id)
        return NextResponse.json({ ok: false }, { status: 502 });
      state.alert = true;
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
          text: `Hi ${lead.fields.name},\n\nWe received your ${lead.kind.replaceAll("_", " ")} request. ${lead.calculated ? `Your estimated results:\n${resultsEmailText(lead)}\nEstimates depend on your inputs and do not replace lease or legal advice.` : "Our team will review your details and confirm the next step."}${pdf}\n\nCall the YOS team: 02 4092 0733\nhttps://www.yourofficespace.au/contact\n\nThe YOS team`,
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
    return NextResponse.json({ ok: true, leaseReceived: Boolean(attachment) });
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
