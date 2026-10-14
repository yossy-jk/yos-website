import TenantShell, {
  tenantMetadata,
  TenantLicence,
} from "@/components/tenant/TenantShell";
import PackageCards from "@/components/tenant/PackageCards";
import { TENANT_OFFER } from "@/lib/tenant-offer";
export const metadata = tenantMetadata(
  "Tenant Representation Packages & Fees | Your Office Space",
  "Compare Gold, Platinum and Diamond tenant representation packages, fees, payment timing and inclusions for Newcastle and NSW businesses.",
  "/tenant-rep/packages",
);
export default function Page() {
  return (
    <TenantShell
      title="Clear packages. A clear next step."
      intro="Compare the scope before you commit. Start with a free Lease Health Check and agree the right package with our team."
    >
      <section className="tenant-section">
        <div className="tenant-wrap">
          <PackageCards />
          <h2>The core service in every package.</h2>
          <ul className="tenant-list">
            {TENANT_OFFER.core.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
          <div className="tenant-note">
            <h3>If you do not sign</h3>
            <p>
              If we cannot find a space that fits the agreed brief and you do
              not sign, the start payment is all you pay under the proposed
              engagement terms. No balance is due before signed Heads of
              Agreement. GST is added to each payment.
            </p>
          </div>
          <TenantLicence />
        </div>
      </section>
    </TenantShell>
  );
}
