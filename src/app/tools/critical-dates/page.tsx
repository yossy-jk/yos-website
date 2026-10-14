import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import { DatesCalculator } from "@/components/tenant/TenantCalculators";
export const metadata = tenantMetadata(
  "Commercial Lease Dates Checker & Calendar | YOS",
  "Build an estimated dates calendar, then check it against the wording of your lease.",
  "/tools/critical-dates",
);
export default function Page() {
  return (
    <TenantShell
      title="Know your next lease deadline."
      intro="Build an estimated dates calendar, then check it against the wording of your lease."
    >
      <section className="tenant-section">
        <div className="tenant-wrap">
          <DatesCalculator />
        </div>
      </section>
    </TenantShell>
  );
}
