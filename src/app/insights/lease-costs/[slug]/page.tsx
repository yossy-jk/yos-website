import { getAllPublicPostsAsync } from "@/lib/blog";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import TenantShell, {
  tenantMetadata,
  TenantCta,
} from "@/components/tenant/TenantShell";
import {
  TimeCalculator,
  LeaseCalculator,
  DatesCalculator,
} from "@/components/tenant/TenantCalculators";
import articles from "@/content/tenant-insights.json";
import { TENANT_OFFER } from "@/lib/tenant-offer";
import { tenantPublicPosts } from "@/lib/tenant-content";
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.filter((a) => !TENANT_OFFER.approvedForPublication || a.status === "published").map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    a = articles.find((a) => a.slug === slug);
  return a
    ? tenantMetadata(
        `${a.title} | YOS`,
        `Draft Newcastle lease guidance: ${a.title}`,
        `/insights/lease-costs/${slug}`,
      )
    : { title: "Article not found" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    a = articles.find((a) => a.slug === slug);
  if (a) {
    const publicPosts = tenantPublicPosts(await getAllPublicPostsAsync().catch(() => []));
    const published = publicPosts.find(
      (p) =>
        p.slug === a.slug || p.title.toLowerCase() === a.title.toLowerCase(),
    );
    if (published) redirect(`/blog/${published.slug}`);
  }
  if (!a || (TENANT_OFFER.approvedForPublication && a.status !== "published"))
    notFound();
  const related = articles.filter((x) => x.slug !== slug).slice(0, 2);
  return (
    <TenantShell title={a.title} eyebrow="Lease costs / draft article">
      <section className="tenant-section">
        <div className="tenant-wrap">
          <article className="tenant-article">
            <p className="tenant-note">
              {a.body} This is an article template, not a published guide.
            </p>
            <h2>Start with the business decision.</h2>
            <p>
              [DRAFT] Open with the client’s question and a clear answer.
              Explain what changes the decision for a Newcastle or Hunter
              workplace.
            </p>
            <h2>Compare the costs and trade-offs.</h2>
            <p>
              [DRAFT] Use supported examples, practical checks and source links.
              No invented statistics or client outcomes.
            </p>
          </article>
          <div style={{ margin: "40px 0" }}>
            {a.tool === "time_cost" ? (
              <TimeCalculator compact />
            ) : a.tool === "lease_cost" ? (
              <LeaseCalculator />
            ) : a.tool === "critical_dates" ? (
              <DatesCalculator />
            ) : (
              <Link className="tenant-button" href={a.href}>
                Explore the next step
              </Link>
            )}
          </div>
          <article className="tenant-article">
            <h2>What to do next.</h2>
            <p>
              [DRAFT] Summarise the practical next step, with legal questions
              referred to the client’s solicitor.
            </p>
            <div className="tenant-actions">
              <Link href={a.href}>Use the matching tool</Link>
              <TenantCta />
            </div>
            <p>
              Prepared by <Link href="/tenant-rep#team">the YOS team</Link>.
              Draft for review on 14 October 2026.
            </p>
            <h3>Related drafts</h3>
            {related.map((x) => (
              <p key={x.slug}>
                <Link href={`/insights/lease-costs/${x.slug}`}>{x.title}</Link>
              </p>
            ))}
          </article>
        </div>
      </section>
    </TenantShell>
  );
}
