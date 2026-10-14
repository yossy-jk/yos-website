import TenantShell, {
  tenantMetadata,
  TenantCta,
} from "@/components/tenant/TenantShell";
import { GuaranteeCalculator } from "@/components/tenant/TenantCalculators";
import { TENANT_OFFER } from "@/lib/tenant-offer";
export const metadata = tenantMetadata(
  "Tenant Representation Return Guarantee | Your Office Space",
  "Review the savings baseline, eligibility, exclusions and fee-capped refund calculation for YOS tenant representation.",
  "/tenant-rep/guarantee",
);
export default function Page() {
  const g = TENANT_OFFER.guarantee;
  return (
    <TenantShell
      title={`Our ${g.multiple}x Return Guarantee.`}
      intro="A written baseline. A defined savings target. A refund calculation you can check."
    >
      <section className="tenant-section">
        <div className="tenant-wrap tenant-article">
          <p className="tenant-note">
            Understand the savings target, eligibility and refund cap before
            you engage the YOS team. Your engagement terms are agreed privately.
          </p>
          <h2>How the rule works.</h2>
          <p>
            For eligible engagements, the savings target is {g.multiple} times
            the professional fee. If measured savings fall below that target,
            the refund is the shortfall, capped at the professional fee
            paid.
          </p>
          <ul className="tenant-guarantee-conditions">
            <li>Minimum initial term: {g.minYears} years.</li>
            <li>
              Minimum annual gross rent: $
              {g.minAnnualRent.toLocaleString("en-AU")}.
            </li>
            <li>YOS runs the negotiation and no exclusion applies.</li>
            <li>
              Below either threshold, the target is{" "}
              {g.fallbackMultiple} times the fee.
            </li>
            <li>Custom engagements require separate written agreement.</li>
          </ul>
          <p>
            The cap matters: if savings are less than the fee itself, a full fee
            refund may still leave savings plus refund below the {g.multiple}x
            target. We show the cap clearly so you can assess the
            protection.
          </p>
          <h2>Start with the first written offer.</h2>
          <p>
            The baseline is the landlord’s first written proposal for the
            premises you lease. For a renewal, use the first written renewal
            proposal. If you already hold an offer when you engage YOS, that is
            the baseline. Improvements already in that offer are not counted
            again.
          </p>
          <h2>Count genuine changes over the initial term.</h2>
          <ul className="tenant-checklist">
            <li>
              Lower rent, using the same review structure for both offers.
            </li>
            <li>Additional rent-free or rent abatement.</li>
            <li>
              Additional fitout contributions or landlord works supported by
              written quotes.
            </li>
            <li>Outgoings waived or capped below the baseline.</li>
            <li>
              Make-good relief valued in writing at engagement, using an agreed
              contractor estimate method.
            </li>
            <li>
              Lease preparation or legal costs the landlord agrees to cover.
            </li>
          </ul>
          <p>
            Option terms are excluded. Bank guarantees and deposit reductions
            affect cash flow and are not counted as cost savings. A saving is
            counted once.
          </p>
          <h2>Know the exclusions.</h2>
          <p>
            The guarantee does not apply if you negotiate directly with
            the landlord or agent during the engagement, sign a lease YOS
            advised against in writing, or end the engagement before signing.
            The walk-away payment terms address the last situation.
          </p>
          <p>
            The process is a written savings statement within{" "}
            {g.statementBusinessDays} business days of lease execution, and any
            refund within {g.refundDays} days. The savings baseline and make-good valuation are agreed with you
            at engagement.
          </p>
        </div>
      </section>
      <section className="tenant-section tenant-soft">
        <div className="tenant-wrap">
          <h2>Test an example.</h2>
          <GuaranteeCalculator />
        </div>
      </section>
      <section className="tenant-section">
        <div className="tenant-wrap">
          <TenantCta />
        </div>
      </section>
    </TenantShell>
  );
}
