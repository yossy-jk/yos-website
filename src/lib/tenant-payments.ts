import { DISCOVERY_BOOKING_URL } from "./constants";
import Stripe from "stripe";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { tenantPaymentRuntime } from "./tenant-payment-config";
import {
  TENANT_PAYMENT_FLOW,
  TENANT_PAYMENT_TERMS,
  TENANT_PAYMENT_ORIGIN,
  type TenantPaymentQuote,
  aud,
} from "./tenant-payment-rules";
import { renderEnquiryEmail } from "./enquiry-email";
import { tenantPaymentReceipt } from "./tenant-payment-receipt";

type Order = {
  id: string;
  quote: TenantPaymentQuote;
  createdAt: string;
  termsVersion: string;
  sessionId?: string;
  paidAt?: string;
  ownerSent?: boolean;
  customerSent?: boolean;
};
export class TenantPaymentError extends Error {
  constructor(
    message: string,
    public status = 503,
    public code = "PAYMENT_UNAVAILABLE",
  ) {
    super(message);
  }
}
export function paymentServices() {
  const runtime = tenantPaymentRuntime();
  if (!runtime.configured)
    throw new TenantPaymentError(
      "Online payment is not available yet. You can still start with a free Lease Health Check.",
    );
  return {
    runtime,
    stripe: new Stripe(process.env.STRIPE_SECRET_KEY!, {
      maxNetworkRetries: 2,
      timeout: 10000,
    }),
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    }),
  };
}
export function checkoutParameters(
  order: Order,
  taxRate: string,
  origin: string = TENANT_PAYMENT_ORIGIN,
): Stripe.Checkout.SessionCreateParams {
  const q = order.quote;
  const metadata = {
    yos_flow: TENANT_PAYMENT_FLOW,
    order_id: order.id,
    package: q.tier,
    terms_version: order.termsVersion,
  };
  return {
    mode: "payment",
    ui_mode: "hosted_page",
    allowed_payment_method_types: ["card"],
    customer_creation: "if_required",
    billing_address_collection: "auto",
    name_collection: {
      individual: { enabled: true, optional: false },
      business: { enabled: true, optional: false },
    },
    phone_number_collection: { enabled: false },
    branding_settings: {
      display_name: "Your Office Space",
      font_family: "montserrat",
      background_color: "#FFFFFF",
      button_color: "#00796D",
    },
    line_items: [
      {
        quantity: 1,
        tax_rates: [taxRate],
        price_data: {
          currency: "aud",
          unit_amount: q.startExGst,
          tax_behavior: "exclusive",
          product_data: {
            name: `YOS ${q.name} - tenant representation start payment`,
            description: `Part payment towards the ${aud(q.feeExGst)} ex GST package fee. Balance ${aud(q.balanceExGst)} ex GST due on signed Heads of Agreement.`,
          },
        },
      },
    ],
    client_reference_id: order.id,
    metadata,
    payment_intent_data: { metadata },
    success_url: `${origin}/tenant-rep/payment?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/tenant-rep/start?package=${q.tier}&cancelled=1`,
    custom_text: {
      submit: {
        message:
          "One-off start payment credited towards your selected package. YOS will confirm the scope and arrange your private agency agreement before representation begins. The balance is not charged automatically.",
      },
    },
    expires_at: Math.floor(Date.parse(order.createdAt) / 1000) + 86400,
  };
}
export async function createTenantCheckout(
  quote: TenantPaymentQuote,
  requestId: string,
) {
  const { runtime, stripe, redis } = paymentServices();
  if (!runtime.enabled)
    throw new TenantPaymentError(
      "Online payment is not available yet. Start with a free Lease Health Check instead.",
    );
  const key = `${runtime.prefix}:order:${requestId}`,
    lock = `${key}:create-lock`;
  if (!(await redis.set(lock, "processing", { nx: true, ex: 60 })))
    throw new TenantPaymentError(
      "Checkout is already being prepared. Please retry in a moment.",
      409,
    );
  try {
    let order = await redis.get<Order>(key);
    if (order && order.quote.tier !== quote.tier)
      throw new TenantPaymentError(
        "This reference belongs to another package.",
        409,
      );
    if (order?.paidAt)
      return {
        url: `${runtime.origin}/tenant-rep/payment?session_id=${encodeURIComponent(order.sessionId!)}`,
      };
    if (order?.sessionId) {
      const session = await stripe.checkout.sessions.retrieve(order.sessionId);
      if (session.status === "complete")
        return {
          url: `${runtime.origin}/tenant-rep/payment?session_id=${encodeURIComponent(session.id)}`,
        };
      if (session.status === "open" && session.url) return { url: session.url };
      throw new TenantPaymentError(
        "This checkout has expired. Please start a new checkout.",
        409,
        "CHECKOUT_EXPIRED",
      );
    }
    if (!order) {
      order = {
        id: requestId,
        quote,
        createdAt: new Date().toISOString(),
        termsVersion: TENANT_PAYMENT_TERMS,
      };
      // Unpaid references expire; a paid record is later persisted without contact/card data.
      await redis.set(key, order, { ex: 7 * 86400 });
    }
    if (Date.now() - Date.parse(order.createdAt) > 23 * 3600000)
      throw new TenantPaymentError(
        "This checkout has expired. Please start a new checkout.",
        409,
        "CHECKOUT_EXPIRED",
      );
    const rate = await stripe.taxRates.retrieve(
      process.env.STRIPE_TENANT_GST_RATE_ID!,
    );
    if (
      !rate.active ||
      rate.inclusive ||
      rate.percentage !== 10 ||
      rate.country !== "AU"
    )
      throw new TenantPaymentError(
        "Payment tax settings need checking. Please contact YOS.",
      );
    const session = await stripe.checkout.sessions.create(
      checkoutParameters(order, rate.id, runtime.origin),
      { idempotencyKey: `yos-tenant-start-${order.id}` },
    );
    if (
      !session.url ||
      !session.url.startsWith("https://checkout.stripe.com/") ||
      session.livemode !== (runtime.mode === "live")
    )
      throw new TenantPaymentError(
        "Checkout could not be confirmed. Please contact YOS.",
      );
    order.sessionId = session.id;
    await redis.set(key, order, { ex: 7 * 86400 });
    return { url: session.url };
  } finally {
    try {
      await redis.del(lock);
    } catch {
      /* The short lock expires on a store outage. */
    }
  }
}

export async function fulfilTenantPayment(sessionId: string) {
  if (!/^cs_(live|test)_[a-zA-Z0-9]+$/.test(sessionId))
    throw new TenantPaymentError("Invalid payment reference.", 400);
  const { runtime, stripe, redis } = paymentServices();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent.latest_charge"],
  });
  if (
    session.metadata?.yos_flow !== TENANT_PAYMENT_FLOW ||
    session.livemode !== (runtime.mode === "live")
  )
    throw new TenantPaymentError("Payment reference not recognised.", 400);
  const orderId = session.metadata.order_id;
  if (!orderId || !/^[a-f0-9-]{36}$/i.test(orderId))
    throw new TenantPaymentError("Payment reference not recognised.", 400);
  const key = `${runtime.prefix}:order:${orderId}`,
    lock = `${key}:fulfil-lock`;
  const order = await redis.get<Order>(key);
  if (
    !order ||
    order.sessionId !== session.id ||
    order.quote.tier !== session.metadata.package ||
    session.mode !== "payment"
  )
    throw new TenantPaymentError("Payment reference not recognised.", 400);
  if (session.payment_status !== "paid")
    return {
      status: "pending" as const,
      tier: order.quote.tier,
      amount: order.quote.total,
    };
  if (
    session.amount_total !== order.quote.total ||
    session.amount_subtotal !== order.quote.startExGst ||
    session.total_details?.amount_tax !== order.quote.gst ||
    session.currency !== "aud"
  )
    throw new TenantPaymentError(
      "Payment amount needs checking. Please contact YOS.",
      409,
    );
  const intent =
    typeof session.payment_intent === "object" ? session.payment_intent : null;
  const charge =
    intent && typeof intent.latest_charge === "object"
      ? intent.latest_charge
      : null;
  if (charge && charge.amount_refunded > 0)
    return {
      status: "refunded" as const,
      tier: order.quote.tier,
      amount: order.quote.total,
    };
  const result = {
    status: "paid" as const,
    tier: order.quote.tier,
    packageName: order.quote.name,
    amount: order.quote.total,
    balanceExGst: order.quote.balanceExGst,
    testMode: runtime.mode === "test",
  };
  if (order.ownerSent && order.customerSent) return result;
  if (!(await redis.set(lock, "processing", { nx: true, ex: 60 })))
    return { ...result, notificationPending: true };
  try {
    const state = await redis.get<Order>(key);
    if (!state || state.sessionId !== session.id)
      throw new TenantPaymentError("Payment record unavailable.");
    if (state.ownerSent && state.customerSent) return result;
    const name =
      session.collected_information?.individual_name ||
      session.customer_details?.individual_name ||
      session.customer_details?.name ||
      "";
    const company =
      session.collected_information?.business_name ||
      session.customer_details?.business_name ||
      "";
    const email = session.customer_details?.email || "";
    if (!name || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new TenantPaymentError("Payment contact details need checking.");
    if (!state.paidAt) {
      state.paidAt = new Date().toISOString();
      await redis.set(key, state);
    }
    // Preview/sandbox transactions never send email to real inboxes.
    if (runtime.mode === "test") {
      state.ownerSent = true;
      state.customerSent = true;
      await redis.set(key, state);
      return result;
    }
    const resend = new Resend(process.env.RESEND_API_KEY!);
    if (!state.ownerSent) {
      const content = renderEnquiryEmail({
        source: `Paid tenant representation start - ${state.quote.name}`,
        name,
        company,
        email,
        submissionId: state.id,
        submittedAt: state.paidAt,
        message:
          "Start payment verified by Stripe. The client confirmation includes a link to book their Project Discovery Session and an optional prompt to email their existing lease to jk@yourofficespace.au. Confirm the client brief and scope, and arrange the private agency agreement before tenant representation begins.",
        details: {
          selectedPackage: state.quote.name,
          discoverySessionBookingLink: DISCOVERY_BOOKING_URL,
          paidIncludingGst: `${aud(state.quote.total)} AUD`,
          gst: aud(state.quote.gst),
          creditedExGst: aud(state.quote.startExGst),
          packageFeeExGst: aud(state.quote.feeExGst),
          remainingFeeExGst: aud(state.quote.balanceExGst),
          paymentReference:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : intent?.id,
          checkoutReference: session.id,
          agreementStatus:
            "To be arranged privately; not signed through checkout",
        },
      });
      const sent = await resend.emails.send(
        {
          from: "YOS Team <notifications@yourofficespace.au>",
          to: "jk@yourofficespace.au",
          replyTo: email,
          subject: `Start payment received - YOS ${state.quote.name} - ${company.replace(/[\r\n]/g, " ")}`,
          ...content,
        },
        { idempotencyKey: `${state.id}-payment-owner` },
      );
      if (sent.error || !sent.data?.id)
        throw new TenantPaymentError(
          "Payment recorded; team notification is pending.",
          503,
          "NOTIFICATION_PENDING",
        );
      state.ownerSent = true;
      await redis.set(key, state);
    }
    if (!state.customerSent) {
      const content = tenantPaymentReceipt(name, state.quote, state.id);
      const sent = await resend.emails.send(
        {
          from: "YOS Team <notifications@yourofficespace.au>",
          to: email,
          replyTo: "jk@yourofficespace.au",
          subject: `Your YOS ${state.quote.name} start payment confirmation`,
          ...content,
        },
        { idempotencyKey: `${state.id}-payment-customer` },
      );
      if (sent.error || !sent.data?.id)
        throw new TenantPaymentError(
          "Payment recorded; confirmation email is pending.",
          503,
          "NOTIFICATION_PENDING",
        );
      state.customerSent = true;
      await redis.set(key, state);
    }
    return result;
  } finally {
    try {
      await redis.del(lock);
    } catch {
      /* The short lock expires on a store outage. */
    }
  }
}
