import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import TenantStartPayment from "@/components/tenant/TenantStartPayment";
import { tenantPaymentRuntime } from "@/lib/tenant-payment-config";
import { tenantPaymentQuote } from "@/lib/tenant-payment-rules";
export const metadata = {
  ...tenantMetadata(
    "Start Your Tenant Representation Package | YOS",
    "Choose your tenant representation package and review the start payment before secure Stripe checkout.",
    "/tenant-rep/start",
  ),
  robots: { index: false, follow: true },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; cancelled?: string }>;
}) {
  const params = await searchParams;
  let selected;
  try {
    selected = tenantPaymentQuote(params.package).tier;
  } catch {
    selected = "gold" as const;
  }
  const config = tenantPaymentRuntime();
  return (
    <TenantShell
      title="Choose your package. Let’s get started."
      intro="A one-off start payment towards your package, with secure payment through Stripe."
    >
      <section className="tenant-section">
        <div className="tenant-wrap">
          <TenantStartPayment
            initialPackage={selected}
            available={config.enabled}
            testMode={config.mode === "test"}
            cancelled={params.cancelled === "1"}
          />
        </div>
      </section>
    </TenantShell>
  );
}
