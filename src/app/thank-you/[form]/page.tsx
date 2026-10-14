import { notFound } from "next/navigation";
import Link from "next/link";
import TenantShell, { tenantMetadata } from "@/components/tenant/TenantShell";
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
      title="Talk to the YOS team."
      intro="Call us on 02 4092 0733 to discuss your next step."
    >
      <section className="tenant-section">
        <div className="tenant-wrap">
          <p>
            This page does not confirm that a request has been submitted or that
            a call has been scheduled. Check the confirmation shown after submitting your form.
          </p>
          <a
            className="tenant-button"
            href="tel:0240920733"
          >
            Call the YOS team
          </a>
          <p style={{ marginTop: 24 }}>
            <Link href="/tenant-rep">Back to tenant representation</Link>
          </p>
        </div>
      </section>
    </TenantShell>
  );
}
