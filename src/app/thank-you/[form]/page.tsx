import { notFound } from "next/navigation";
import Link from "next/link";
import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
import { HUBSPOT } from "@/lib/constants";
const kinds = ["health-check", "results", "referral", "checklist"];
export function generateStaticParams() {
  return kinds.map((form) => ({ form }));
}
export async function generateMetadata() {
  return {
    ...tenantMetadata(
      "Your next step | Your Office Space",
      "Choose your next step with the Your Office Space team.",
      "/thank-you/health-check",
    ),
    robots: { index: false, follow: false },
    alternates: undefined,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ form: string }>;
}) {
  const { form } = await params;
  if (!kinds.includes(form)) notFound();
  return (
    <TenantShell
      title="Choose a time to talk."
      intro="Use the existing YOS booking service to choose a call time that suits your business."
    >
      <section className="tenant-section">
        <div className="tenant-wrap">
          <p>
            This page does not confirm that a request has been submitted or that
            a booking exists. Your form confirmation and booking confirmation
            are shown separately.
          </p>
          <a
            className="tenant-button"
            href={HUBSPOT.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a clarity call
          </a>
          <p style={{ marginTop: 24 }}>
            <Link href="/tenant-rep">Back to tenant representation</Link>
          </p>
        </div>
      </section>
    </TenantShell>
  );
}
