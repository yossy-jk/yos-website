import { TENANT_OFFER } from "./tenant-offer";
export const TENANT_PAYMENT_FLOW = "yos_tenant_start_v1";
export const TENANT_PAYMENT_TERMS = "tenant-start-v1";
export const TENANT_PAYMENT_ORIGIN = "https://www.yourofficespace.au";
export type TenantPackageId = "gold" | "platinum" | "diamond";
export function tenantPaymentQuote(tier: unknown) {
  const selected = TENANT_OFFER.packages.find((p) => p.id === tier);
  if (!selected) throw Error("Choose Gold, Platinum or Diamond.");
  const startExGst = Math.round(TENANT_OFFER.startPayment * 100);
  const gst = Math.round(startExGst * TENANT_OFFER.gstRate);
  return {
    tier: selected.id as TenantPackageId,
    name: selected.name,
    startExGst,
    gst,
    total: startExGst + gst,
    feeExGst: Math.round(selected.fee * 100),
    balanceExGst: Math.round(selected.fee * 100) - startExGst,
  };
}
export type TenantPaymentQuote = ReturnType<typeof tenantPaymentQuote>;
export function aud(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
export function paymentRequest(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw Error("Invalid checkout request.");
  const data = raw as Record<string, unknown>;
  if (
    Object.keys(data).some(
      (k) => !["tier", "requestId", "acknowledged", "termsVersion"].includes(k),
    )
  )
    throw Error("Invalid checkout request.");
  if (
    typeof data.requestId !== "string" ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      data.requestId,
    )
  )
    throw Error("Invalid checkout reference.");
  if (data.acknowledged !== true || data.termsVersion !== TENANT_PAYMENT_TERMS)
    throw Error("Confirm the payment summary before continuing.");
  return { quote: tenantPaymentQuote(data.tier), requestId: data.requestId };
}
