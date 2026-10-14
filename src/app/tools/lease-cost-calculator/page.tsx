import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import { LeaseCalculator } from "@/components/tenant/TenantCalculators";
export const metadata = tenantMetadata(
  "Commercial Lease Cost Calculator Newcastle | YOS",
  "Compare rent, entered outgoings, incentives and make-good over the initial term. See your results without an email gate.",
  "/tools/lease-cost-calculator",
);
export default function Page() {
  return (
    <TenantShell
      title="What will your lease really cost?"
      intro="Compare rent, entered outgoings, incentives and make-good over the initial term. See your results without an email gate."
    >
      <section className="tenant-section">
        <div className="tenant-wrap">
          <LeaseCalculator />
        </div>
      </section>
    </TenantShell>
  );
}
