import { getAllPublicPostsAsync } from "@/lib/blog";
import { TENANT_OFFER } from "@/lib/tenant-offer";
import Link from "next/link";
import TenantShell, {
  tenantMetadata,
  TenantCta,
} from "@/components/tenant/TenantShell";
import articles from "@/content/tenant-insights.json";
export const metadata = tenantMetadata(
  "Understand Your Commercial Lease Costs | YOS Newcastle",
  "Practical lease guidance and tools for Newcastle and Hunter businesses, covering occupancy costs, leadership time and lease dates.",
  "/insights/lease-costs",
);
export default async function Page() {
  const published = await getAllPublicPostsAsync();
  const cards = articles
    .map((article) => ({
      article,
      post: published.find(
        (p) =>
          p.slug === article.slug ||
          p.title.toLowerCase() === article.title.toLowerCase(),
      ),
    }))
    .filter((item) => item.post || !TENANT_OFFER.approvedForPublication);
  return (
    <TenantShell
      title="What is your lease really costing you?"
      intro="Understand the money, time and obligations behind your next workplace decision."
    >
      <section className="tenant-section">
        <div className="tenant-wrap">
          <h2>Start with a practical tool.</h2>
          <div className="tenant-grid tenant-links-card">
            <article className="tenant-card">
              <h3>Your lease cost</h3>
              <p>Rent, incentives and exit costs in one estimate.</p>
              <Link href="/tools/lease-cost-calculator">
                Lease Cost Calculator
              </Link>
            </article>
            <article className="tenant-card">
              <h3>Your team’s time</h3>
              <p>Put a value on the hours spent searching and comparing.</p>
              <Link href="/tools/time-cost-calculator">
                Time Cost Calculator
              </Link>
            </article>
            <article className="tenant-card">
              <h3>Your next deadline</h3>
              <p>Estimate expiry, review and option window dates.</p>
              <Link href="/tools/critical-dates">Critical Dates Checker</Link>
            </article>
          </div>
          <h2 style={{ marginTop: 56 }}>The lease cost series.</h2>
          {!TENANT_OFFER.approvedForPublication && (
            <p>
              Eight planned guides. Draft articles are available for review in
              this preview. Publish approved copy through the existing YOS
              content dashboard using the matching title or slug.
            </p>
          )}
          <div className="tenant-grid">
            {cards.map(({ article: a, post }) => (
              <article key={a.slug} className="tenant-card">
                <p className="tenant-eyebrow">
                  {post ? "Guide" : "Draft / awaiting copy approval"}
                </p>
                <h3>{a.title}</h3>
                <Link
                  href={
                    post
                      ? `/blog/${post.slug}`
                      : `/insights/lease-costs/${a.slug}`
                  }
                >
                  {post ? "Read the guide" : "Review article structure"}
                </Link>
              </article>
            ))}
          </div>
          <div className="tenant-actions">
            <Link href="/lease-checklist">Twelve checks before signing</Link>
            <TenantCta />
          </div>
          <h3>Useful guides already available.</h3>
          <div className="tenant-inline-links">
            <Link href="/blog/tenant-representation-brief-newcastle">
              Prepare your Newcastle premises brief
            </Link>
            <Link href="/blog/what-is-tenant-representation-newcastle">
              Tenant representation explained
            </Link>
            <Link href="/blog/what-is-make-good">Understand make-good</Link>
          </div>
        </div>
      </section>
    </TenantShell>
  );
}
