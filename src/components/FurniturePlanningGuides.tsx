import Link from 'next/link'
import { getPostBySlug } from '@/lib/blog'

const GUIDE_SLUGS = [
  'office-furniture-newcastle',
  'boardroom-office-furniture-newcastle',
  'office-desks-newcastle',
  'office-chairs-newcastle',
  'office-furniture-budget-newcastle',
  'compare-office-furniture-quotes-installed-cost',
  'office-furniture-reuse-audit-newcastle',
  'standard-modified-custom-office-furniture-newcastle',
  'office-furniture-installation-checklist-newcastle',
  'buy-office-furniture-before-lease-expiry',
  'adaptable-office-furniture-growth-relocation',
]

export default function FurniturePlanningGuides() {
  const guides = GUIDE_SLUGS.flatMap(slug => {
    const post = getPostBySlug(slug)
    return post ? [post] : []
  })
  return (
    <section className="bg-warm-grey" aria-labelledby="furniture-guides-heading" style={{ padding: 'clamp(3rem,6vw,5rem) 6%' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <p className="text-action-teal text-xs font-bold uppercase tracking-widest" style={{ marginBottom: '1rem' }}>Practical buying guides</p>
        <h2 id="furniture-guides-heading" className="text-near-black text-2xl md:text-3xl font-bold" style={{ marginBottom: '1rem' }}>Plan your Newcastle and NSW workplace.</h2>
        <p className="text-readable-grey leading-relaxed" style={{ maxWidth: '48rem', marginBottom: '2rem' }}>Compare budgets, specifications, reuse and installation before ordering furniture. These guides connect the furniture brief with the way your business will use the office.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map(post => (
            <article key={post.slug} className="bg-white rounded-2xl" style={{ padding: '1.5rem' }}>
              <h3 className="text-near-black text-xl font-bold" style={{ lineHeight: 1.35, marginBottom: '0.75rem' }}>
                <Link href={`/blog/${post.slug}`} className="no-min-height hover:text-dark-teal" style={{ display: 'block' }}>{post.title}</Link>
              </h3>
              <p className="text-readable-grey leading-relaxed">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
