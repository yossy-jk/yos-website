import Link from "next/link";
import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import TenantPaymentStatus from "@/components/tenant/TenantPaymentStatus";
export const metadata = {
  ...tenantMetadata(
    "Your Tenant Representation Payment | YOS",
    "Secure confirmation of your tenant representation start payment.",
    "/tenant-rep/payment",
  ),
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  return (
    <TenantShell title="Your tenant representation start payment.">
      <section className="tenant-section">
        <div className="tenant-wrap">
          {typeof session_id === "string" &&
          /^cs_(live|test)_[a-zA-Z0-9]+$/.test(session_id) ? (
            <TenantPaymentStatus sessionId={session_id} />
          ) : (
            <div className="tenant-note">
              <p>
                There is no payment reference to check on this page. If you have
                already paid, use the confirmation link from checkout or contact
                YOS before paying again.
              </p>
              <Link href="/contact?service=leasing#contact-enquiry">
                Contact the YOS team
              </Link>
            </div>
          )}
        </div>
      </section>
    </TenantShell>
  );
}
