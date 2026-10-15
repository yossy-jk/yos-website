import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sendOwnerEnquiry } from "@/lib/enquiry-delivery";
import { voucherLimiter, getIp } from "@/lib/ratelimit";
import { CATALOGUES, CATALOGUE_OFFER_TERMS } from "@/lib/catalogues";
export const runtime = "nodejs";
const code = "YOSWELCOME5";
const shopUrl = `https://www.yourofficefurniture.com.au/discount/${code}?redirect=%2Fcollections%2Fall`;
export async function POST(req: Request) {
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return NextResponse.json({ ok: false }, { status: 403 });
  try {
    const text = await req.text();
    if (text.length > 6000)
      return NextResponse.json({ ok: false }, { status: 413 });
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (!data || typeof data !== "object" || Array.isArray(data) || data._honey)
      return NextResponse.json({ ok: false }, { status: 400 });
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const name =
      typeof data.name === "string" ? data.name.trim().slice(0, 100) : "";
    const message =
      typeof data.message === "string"
        ? data.message.trim().slice(0, 2000)
        : "";
    const catalogue = CATALOGUES.find((c) => c.id === data.catalogue);
    const intent = data.intent;
    if (
      !catalogue ||
      !["discount", "discovery"].includes(intent) ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      (intent === "discovery" && !name) ||
      !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
        data.submissionId || "",
      )
    )
      return NextResponse.json(
        { ok: false, error: "Please check your details and try again." },
        { status: 400 },
      );
    if (process.env.VERCEL_ENV === "preview")
      return NextResponse.json({
        ok: true,
        preview: true,
        ...(intent === "discount" ? { shopUrl } : {}),
      });
    const limiter = voucherLimiter();
    if (limiter && !(await limiter.limit(getIp(req))).success)
      return NextResponse.json(
        {
          ok: false,
          error: "Please wait before trying again, or call 02 4092 0733.",
        },
        { status: 429 },
      );
    if (!process.env.RESEND_API_KEY) throw Error("Delivery unavailable");
    await sendOwnerEnquiry({
      name,
      email,
      message,
      source:
        intent === "discount"
          ? "Catalogue first-order discount"
          : "Project Discovery Session request",
      submissionId: data.submissionId,
      submittedAt:
        typeof data.submittedAt === "string" &&
        Number.isFinite(Date.parse(data.submittedAt))
          ? new Date(data.submittedAt).toISOString()
          : undefined,
      marketingConsent: false,
      details: {
        catalogue: catalogue.title,
        request:
          intent === "discount"
            ? "5% first-order code"
            : "Arrange a Project Discovery Session",
        ...(intent === "discount"
          ? { discountCode: code, offerTerms: CATALOGUE_OFFER_TERMS }
          : {}),
      },
    });
    if (intent === "discount") {
      const result = await new Resend(process.env.RESEND_API_KEY).emails.send(
        {
          from: "Your Office Furniture <notifications@yourofficespace.au>",
          to: email,
          replyTo: "hello@yourofficefurniture.com.au",
          subject: "Your 5% first-order furniture code",
          text: `Thanks for exploring our ${catalogue.title}.\n\nYour code: ${code}\n\nShop with your discount: ${shopUrl}\n\n${CATALOGUE_OFFER_TERMS}\n\nNeed help planning? Reply to this email.\n\nYour Office Furniture`,
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#191919;border-top:6px solid #00B5A5;padding:28px"><p style="color:#00796D;font-weight:bold">YOUR OFFICE FURNITURE</p><h1>Here’s 5% towards your first order.</h1><p>Thanks for exploring our ${catalogue.title}.</p><p>Your code: <strong style="font-size:24px">${code}</strong></p><p><a href="${shopUrl}" style="display:inline-block;background:#191919;color:white;padding:16px 24px;border-radius:8px;text-decoration:none">Shop with 5% off</a></p><p>${CATALOGUE_OFFER_TERMS}</p><p>Need help planning? Reply to this email.</p></div>`,
        },
        { idempotencyKey: `${data.submissionId}-catalogue-discount` },
      );
      if (result.error || !result.data?.id)
        throw Error("Customer email not accepted");
    }
    return NextResponse.json({
      ok: true,
      ...(intent === "discount" ? { shopUrl } : {}),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not confirm delivery. Please retry or call 02 4092 0733.",
      },
      { status: 502 },
    );
  }
}
