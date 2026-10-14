import type { ReactNode } from "react";
import Link from "next/link";
import TenantAttribution from "./TenantAttribution";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { TENANT_OFFER } from "@/lib/tenant-offer";
import { withPageSeo } from "@/lib/page-seo";
export function tenantMetadata(
  title: string,
  description: string,
  path: string,
) {
  return withPageSeo({
    title,
    description,
    alternates: { canonical: `https://www.yourofficespace.au${path}` },
    robots: {
      index: path === "/tenant-rep" || TENANT_OFFER.approvedForPublication,
      follow: true,
    },
    openGraph: {
      images: [
        {
          url: "/og/og-tenant-rep.png",
          width: 1200,
          height: 630,
          alt: "Your Office Space tenant representation",
        },
      ],
    },
  });
}
export function TenantLicence() {
  return <p className="tenant-licence">{TENANT_OFFER.licence}</p>;
}
export function TenantCta({
  children = "Start with a free Lease Health Check",
  href = "/lease-health-check",
}: {
  children?: ReactNode;
  href?: string;
}) {
  return (
    <Link className="tenant-button" href={href}>
      {children}
    </Link>
  );
}
export default function TenantShell({
  children,
  title,
  eyebrow = "Find It / Tenant representation",
  intro,
}: {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  intro?: string;
}) {
  return (
    <>
      <Nav />
      <TenantAttribution />
      <main id="main-content" tabIndex={-1} className="tenant-journey">
        {!TENANT_OFFER.approvedForPublication && (
          <aside className="tenant-preview" role="note">
            Review preview. Prices confirmed. Copy, guarantee and licence
            wording await final approval. Forms do not send enquiries in this
            preview.
          </aside>
        )}
        {title && (
          <header className="tenant-page-header">
            <div className="tenant-wrap">
              <nav aria-label="Breadcrumb">
                <Link href="/tenant-rep">Tenant representation</Link> / {title}
              </nav>
              <p className="tenant-eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
              {intro && <p className="tenant-intro">{intro}</p>}
            </div>
          </header>
        )}
        {children}
        <section className="tenant-section tenant-soft">
          <div className="tenant-wrap">
            <TenantLicence />
            <p>
              <Link href="/privacy">Privacy</Link> ·{" "}
              <Link href="/tenant-rep/packages">Packages</Link> ·{" "}
              <Link href="/tenant-rep/guarantee">Guarantee</Link> ·{" "}
              <Link href="/refer">Refer a business</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <Link className="tenant-mobile-cta" href="/lease-health-check">
        Free Lease Health Check
      </Link>
    </>
  );
}
