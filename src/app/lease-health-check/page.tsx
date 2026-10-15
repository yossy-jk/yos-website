import GuaranteeNote from "@/components/tenant/GuaranteeNote";
import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import TenantLeadForm from "@/components/tenant/TenantLeadForm";
export const metadata = tenantMetadata(
  "Free Lease Health Check Newcastle & NSW | YOS",
  "Understand your lease dates, costs and next decision. Request a free Lease Health Check from the Your Office Space team in three simple steps.",
  "/lease-health-check",
);
export default function Page() {
  return (
    <TenantShell
      title="Your lease. Your next decision. Let’s make it clear."
      intro="A free Lease Health Check is a practical first conversation about where you are now and what needs checking next."
    >
      <section className="tenant-section">
        <div className="tenant-wrap tenant-two">
          <div>
            <h2>You can start with what you know.</h2>
            <p>
              Start with your lease and plans, then finish with your contact details. If a
              date or figure is unclear, leave it blank. We will confirm the
              information needed for your written Health Check. Uploading your current lease is optional; you can submit without it.
            </p>
            <GuaranteeNote />
            <ul className="tenant-checklist">
              <li>Understand expiry and option questions.</li>
              <li>Identify commercial cost and make-good points to check.</li>
              <li>Explore staying, moving, expanding or buying.</li>
              <li>Agree a sensible next step.</li>
            </ul>
            <p>
              Submitting the form does not sign you up to a package. Your
              solicitor remains responsible for legal advice.
            </p>
          </div>
          <TenantLeadForm />
        </div>
      </section>
    </TenantShell>
  );
}
