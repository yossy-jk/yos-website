import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import TenantLeadForm from "@/components/tenant/TenantLeadForm";
export const metadata = tenantMetadata(
  "Newcastle Tenant Lease Checklist | Your Office Space",
  "Twelve practical checks before signing a commercial lease, covering costs, dates, incentives, fitout and exit obligations.",
  "/lease-checklist",
);
const checks = [
  "Confirm the premises, permitted use and practical access.",
  "Record commencement, expiry and any conditions before occupation.",
  "Read the option notice window and how notice must be served.",
  "Check whether rent is gross or net and what outgoings add.",
  "Understand fixed, CPI and market rent review wording.",
  "Document rent-free, landlord works and contributions in writing.",
  "Check who pays for approvals, fitout and building works.",
  "Understand maintenance, repair and insurance responsibilities.",
  "Assess make-good obligations and document the ingoing condition.",
  "Read assignment, subletting, relocation and demolition provisions.",
  "Check bank guarantee, security, guarantees and signing authority.",
  "Have your solicitor review the final lease against agreed terms.",
];
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
                <li key={c}>{c}</li>
              ))}
            </ol>
            <p className="tenant-small">
              Draft checklist for approval. General information only. Your lease
              and circumstances need individual legal advice.
            </p>
          </div>
          <TenantLeadForm kind="checklist" />
        </div>
      </section>
    </TenantShell>
  );
}
