import Link from "next/link";
import { TENANT_OFFER } from "@/lib/tenant-offer";
export default function GuaranteeNote() {
  const g = TENANT_OFFER.guarantee;
  return (
    <div className="tenant-note">
      <Link href="/tenant-rep/guarantee">
        <strong>Proposed {g.multiple}x Return Guarantee</strong>
      </Link>
      <p className="tenant-small">
        For initial terms of {g.minYears} years or more and proposed annual
        gross rent of ${g.minAnnualRent.toLocaleString("en-AU")} or more. YOS
        runs the negotiation. Refunds are capped at the professional fee paid.
        Below either threshold, the proposed {g.fallbackMultiple}x rule applies.
      </p>
    </div>
  );
}
