import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import TenantLeadForm from "@/components/tenant/TenantLeadForm";
export const metadata = tenantMetadata(
  "Refer a Business to Your Office Space",
  "Know a business with a lease decision ahead? Refer them to the YOS team with their permission.",
  "/refer",
);
export default function Page() {
  return (
    <TenantShell
      title="Know a business with a lease decision ahead?"
      intro="Send them our way, with their permission. The YOS team can help them understand the next step."
    >
      <section className="tenant-section">
        <div className="tenant-wrap">
          <TenantLeadForm kind="referral" />
        </div>
      </section>
    </TenantShell>
  );
}
