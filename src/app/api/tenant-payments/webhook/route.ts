import { NextResponse } from "next/server";
import { paymentServices, fulfilTenantPayment } from "@/lib/tenant-payments";
import { TENANT_PAYMENT_FLOW } from "@/lib/tenant-payment-rules";
import type Stripe from "stripe";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(req: Request) {
  let services;
  try {
    services = paymentServices();
  } catch {
    return NextResponse.json(
      { error: "Payment notification temporarily unavailable." },
      { status: 503 },
    );
  }
  let event: Stripe.Event;
  try {
    const body = await req.text();
    if (body.length > 150000) throw Error("Too large");
    event = services.stripe.webhooks.constructEvent(
      body,
      req.headers.get("stripe-signature") || "",
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid payment signature." },
      { status: 400 },
    );
  }
  if (event.livemode !== (services.runtime.mode === "live"))
    return NextResponse.json({ error: "Wrong payment mode." }, { status: 400 });
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  )
    return NextResponse.json({ received: true });
  const session = event.data.object;
  if (session.metadata?.yos_flow !== TENANT_PAYMENT_FLOW)
    return NextResponse.json({ received: true });
  try {
    const result = await fulfilTenantPayment(session.id);
    if ("notificationPending" in result && result.notificationPending)
      return NextResponse.json(
        { error: "Payment notification is being processed. Retry delivery." },
        { status: 503 },
      );
    return NextResponse.json({ received: true });
  } catch {
    // Non-2xx makes Stripe retry; a failed notification must not discard a paid order.
    return NextResponse.json(
      { error: "Payment notification pending. Retry delivery." },
      { status: 503 },
    );
  }
}
