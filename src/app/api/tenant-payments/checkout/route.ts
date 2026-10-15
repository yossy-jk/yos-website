import { NextResponse } from "next/server";
import { tenantPaymentLimiter, getIp } from "@/lib/ratelimit";
import {
  paymentRequest,
  TENANT_PAYMENT_ORIGIN,
} from "@/lib/tenant-payment-rules";
import {
  createTenantCheckout,
  TenantPaymentError,
} from "@/lib/tenant-payments";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const allowed =
    process.env.VERCEL_ENV === "production"
      ? TENANT_PAYMENT_ORIGIN
      : new URL(req.url).origin;
  if (!origin || origin !== allowed)
    return NextResponse.json(
      { error: "Please start checkout from the YOS website." },
      { status: 403 },
    );
  let input;
  try {
    const text = await req.text();
    if (text.length > 1500) throw Error("Request too large.");
    input = paymentRequest(JSON.parse(text));
  } catch {
    return NextResponse.json(
      { error: "Choose a package and confirm the payment summary." },
      { status: 400 },
    );
  }
  try {
    const limit = tenantPaymentLimiter("checkout");
    if (!limit)
      throw new TenantPaymentError(
        "Online payment is not available yet. Please contact YOS.",
      );
    if (!(await limit.limit(getIp(req))).success)
      return NextResponse.json(
        { error: "Please wait a few minutes before retrying checkout." },
        { status: 429 },
      );
    return NextResponse.json(
      await createTenantCheckout(input.quote, input.requestId),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const known = error instanceof TenantPaymentError;
    return NextResponse.json(
      {
        error: known
          ? error.message
          : "Checkout could not be prepared. Please retry or contact YOS.",
        code: known ? error.code : "PAYMENT_UNAVAILABLE",
      },
      { status: known ? error.status : 503 },
    );
  }
}
