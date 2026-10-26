import Link from 'next/link'
import { getPostBySlug } from '@/lib/blog'

const COLLECTIONS = {
  "tenant": [
    "Plan your next lease",
    "From the first brief to the renewal decision, build a clear Newcastle and NSW leasing plan.",
    [
      "commercial-lease-renewal-newcastle-timeline",
      "tenant-representation-brief-newcastle",
      "how-to-compare-commercial-leases",
      "renew-or-relocate-commercial-lease"
    ]
  ],
  "buyer": [
    "Buy with a clear brief",
    "Work through the premises, investigation and long-term business fit before committing.",
    [
      "commercial-buyers-agent-brief-newcastle",
      "commercial-property-due-diligence-newcastle",
      "buying-business-premises-five-year-fit"
    ]
  ],
  "project": [
    "Plan the workplace delivery",
    "Connect your Newcastle project budget, delivery responsibilities and handover checks.",
    [
      "office-fitout-newcastle-planning-checklist",
      "commercial-fitout-cost-newcastle-2026",
      "commercial-construction-project-manager-vs-builder-newcastle",
      "office-fitout-handover-checklist"
    ]
  ]
} as const

export default function WorkplaceGuides({ kind }: { kind: keyof typeof COLLECTIONS }) {
  const [title, description, slugs] = COLLECTIONS[kind]
  return (
    <section className="workplace-guides" aria-label={title}>
      <div className="workplace-guides-inner">
        <p className="workplace-guides-label">Practical planning library</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="workplace-guides-grid">
          {slugs.map(slug => {
            const post = getPostBySlug(slug)
            if (!post) return null
            return (
              <Link key={slug} href={`/blog/${slug}`}>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span>Read the guide →</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
