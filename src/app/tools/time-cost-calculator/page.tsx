import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import { TimeCalculator } from "@/components/tenant/TenantCalculators";
export const metadata = tenantMetadata(
  "Office Search Time Cost Calculator Newcastle | YOS",
  "Value the time your leaders spend on finding and comparing premises. Use your own estimate, then compare the package scope.",
  "/tools/time-cost-calculator",
);
export default function Page() {
  return (
    <TenantShell
      title="What is your office search time worth?"
      intro="Value the time your leaders spend on finding and comparing premises. Use your own estimate, then compare the package scope."
    >
      <section className="tenant-section">
        <div className="tenant-wrap">
          <TimeCalculator />
        </div>
      </section>
    </TenantShell>
  );
}
