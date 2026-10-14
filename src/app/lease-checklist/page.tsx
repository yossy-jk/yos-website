import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import TenantLeadForm from "@/components/tenant/TenantLeadForm";
import checks from "@/content/tenant-checklist.json";
export const metadata = tenantMetadata(
  "Newcastle Tenant Lease Checklist | Your Office Space",
  "Twelve practical checks before signing a commercial lease, covering costs, dates, incentives, fitout and exit obligations.",
  "/lease-checklist",
);
export default function Page() {
  return (
    <TenantShell
      title="Twelve things to check before you sign."
      intro="A practical Newcastle tenant checklist for the conversation with your team and solicitor."
    >
      <section className="tenant-section">
        <div className="tenant-wrap tenant-two">
          <div id="checklist-content">
            <h2>Your lease checklist.</h2>
            <ol className="tenant-checklist">
              {checks.map((c) => (
                <li key={c.title} className="tenant-checklist-item">
                  <h3>{c.title}</h3>
                  <p>{c.check}</p>
                  <p className="tenant-checklist-tip"><strong>YOS tip:</strong> {c.tip}</p>
                </li>
              ))}
            </ol>
            <p className="tenant-small">
              General information only. Your lease
              and circumstances need individual legal advice.
            </p>
          </div>
          <TenantLeadForm kind="checklist" />
        </div>
      </section>
    </TenantShell>
  );
}
