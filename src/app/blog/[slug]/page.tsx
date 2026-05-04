import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BookingCTA from '@/components/BookingCTA'
import { getAllPosts, getPostBySlug, DIVISION_LABELS, DIVISION_COLORS, DIVISION_HERO_IMAGES } from '@/lib/blog'
import { HUBSPOT } from '@/lib/constants'
import type { Division } from '@/lib/blog'

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlugAsync(slug)
  if (!post) return {}
  return {
    title: post.metaTitle || `${post.title} | Your Office Space`,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `https://yourofficespace.au/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url: `https://yourofficespace.au/blog/${post.slug}`,
      siteName: 'Your Office Space',
      locale: 'en_AU',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
    },
  }
}

// Internal link map — keyword → href
const INTERNAL_LINKS: Record<string, string> = {
  'tenant representation': '/tenant-rep',
  'tenant rep': '/tenant-rep',
  'tenant representative': '/tenant-rep',
  'buyers agency': '/buyers-agency',
  "buyer's agent": '/buyers-agency',
  'buyers agent': '/buyers-agency',
  'commercial cleaning': '/cleaning',
  'office cleaning': '/cleaning',
  'furniture and fitout': '/furniture',
  'furniture & fitout': '/furniture',
  'office fitout': '/furniture',
  'fitout': '/furniture',
  'leaseintel': '/leaseintel',
  'lease review': '/leaseintel',
  'lease risk': '/resources/lease-review',
  'lease comparison': '/resources/lease-comparison',
  'fitout estimator': '/resources/fitout-estimator',
  'fitout cost estimator': '/resources/fitout-estimator',
  'stamp duty': '/resources/stamp-duty-calculator',
  'land tax': '/resources/land-tax-calculator',
  'rental yield': '/resources/rental-yield-calculator',
  'cap rate': '/resources/cap-rate-calculator',
  'make-good': '/blog/what-is-make-good',
  'make good': '/blog/what-is-make-good',
}

function applyInternalLinks(text: string, currentSlug: string): React.ReactNode[] {
  // Sort by length descending so longer phrases match first
  const keywords = Object.keys(INTERNAL_LINKS).sort((a, b) => b.length - a.length)
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    let matched = false
    const lowerRemaining = remaining.toLowerCase()

    for (const keyword of keywords) {
      const idx = lowerRemaining.indexOf(keyword.toLowerCase())
      if (idx === 0) {
        const href = INTERNAL_LINKS[keyword]
        // Skip if this would link to the current post
        if (!href.includes(currentSlug)) {
          parts.push(
            <Link key={key++} href={href} className="text-teal font-medium no-underline hover:text-dark-teal transition-colors border-b border-teal/30 hover:border-teal">
              {remaining.slice(0, keyword.length)}
            </Link>
          )
          remaining = remaining.slice(keyword.length)
          matched = true
          break
        }
      }
    }

    if (!matched) {
      // Check if any keyword starts within next few chars
      let nextMatch = remaining.length
      const lowerR = remaining.toLowerCase()
      for (const keyword of keywords) {
        const idx = lowerR.indexOf(keyword.toLowerCase(), 1)
        if (idx > 0 && idx < nextMatch) nextMatch = idx
      }
      const text = remaining.slice(0, nextMatch)
      if (parts.length > 0 && typeof parts[parts.length - 1] === 'string') {
        parts[parts.length - 1] = (parts[parts.length - 1] as string) + text
      } else {
        parts.push(text)
      }
      remaining = remaining.slice(nextMatch)
    }
  }

  return parts
}

function inlineRender(text: string, slug: string): React.ReactNode[] {
  // Render inline bold (**text**) and internal links within a string
  const parts = text.split(/\*\*(.+?)\*\*/)
  const nodes: React.ReactNode[] = []
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      nodes.push(<strong key={i} style={{ fontWeight: 700, color: '#111827' }}>{part}</strong>)
    } else {
      nodes.push(...applyInternalLinks(part, slug).map((n, j) => <span key={`${i}-${j}`}>{n}</span>))
    }
  })
  return nodes
}

function renderBody(body: string, slug: string) {
  const lines = body.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0
  let listBuffer: string[] = []
  let numberedBuffer: string[] = []
  let tableBuffer: string[] = []

  const flushList = () => {
    if (listBuffer.length === 0) return
    elements.push(
      <ul key={key++} style={{ margin: '1.5rem 0 2rem', padding: 0, listStyle: 'none' }}>
        {listBuffer.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.875rem' }}>
            <span style={{ flexShrink: 0, width: '3px', height: '1.4em', background: '#00B5A5', borderRadius: '2px', marginTop: '0.2em', display: 'block' }} />
            <span style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.8, fontWeight: 300 }}>
              {inlineRender(item, slug)}
            </span>
          </li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  const flushNumbered = () => {
    if (numberedBuffer.length === 0) return
    elements.push(
      <ol key={key++} style={{ margin: '1.5rem 0 2rem', padding: 0, listStyle: 'none', counterReset: 'yos-counter' }}>
        {numberedBuffer.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1rem', counterIncrement: 'yos-counter' }}>
            <span style={{ flexShrink: 0, minWidth: '1.75rem', height: '1.75rem', background: '#00B5A5', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, marginTop: '0.15em' }}>
              {i + 1}
            </span>
            <span style={{ color: '#4B5563', fontSize: '1.0625rem', lineHeight: 1.8, fontWeight: 300, flex: 1 }}>
              {inlineRender(item, slug)}
            </span>
          </li>
        ))}
      </ol>
    )
    numberedBuffer = []
  }

  const flushTable = () => {
    if (tableBuffer.length === 0) return
    // Parse markdown table — first row = headers, second row = separator, rest = data
    const rows = tableBuffer.map(r =>
      r.split('|').map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1)
    )
    const headers = rows[0] || []
    const dataRows = rows.slice(2) // skip separator row
    elements.push(
      <div key={key++} style={{ overflowX: 'auto', margin: '2rem 0 2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '400px' }}>
          <thead>
            <tr style={{ background: '#0A0A0A' }}>
              {headers.map((h, i) => (
                <th key={i} style={{ padding: '0.875rem 1.1rem', textAlign: 'left', color: 'white', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? 'white' : '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: '0.875rem 1.1rem', color: ci === 0 ? '#111827' : '#4B5563', fontWeight: ci === 0 ? 600 : 300, lineHeight: 1.6, verticalAlign: 'top' }}>
                    {inlineRender(cell, slug)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableBuffer = []
  }

  const flushAll = () => { flushList(); flushNumbered(); flushTable() }

  for (const line of lines) {
    // Table row
    if (line.trim().startsWith('|')) {
      flushList(); flushNumbered()
      tableBuffer.push(line)
      continue
    }

    // Separator row for table (---|---) — already buffered above
    // Headings
    if (line.startsWith('## ')) {
      flushAll()
      elements.push(
        <h2 key={key++} style={{ fontSize: 'clamp(1.35rem,2.5vw,1.75rem)', fontWeight: 900, color: '#0A0A0A', textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.15, marginTop: '3.5rem', marginBottom: '1.25rem', paddingTop: '0.5rem', borderTop: '2px solid #F3F4F6' }}>
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      flushAll()
      elements.push(
        <h3 key={key++} style={{ fontSize: 'clamp(1.1rem,2vw,1.35rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.005em', lineHeight: 1.25, marginTop: '2.5rem', marginBottom: '0.875rem' }}>
          {line.replace('### ', '')}
        </h3>
      )
    // Bullet list
    } else if (line.startsWith('- ')) {
      flushTable(); flushNumbered()
      listBuffer.push(line.slice(2))
    // Numbered list (1. or 1) format)
    } else if (/^\d+[.)\s]/.test(line)) {
      flushTable(); flushList()
      numberedBuffer.push(line.replace(/^\d+[.)\s]+/, ''))
    // Standalone link
    } else if (line.startsWith('[') && line.includes('](')) {
      flushAll()
      const match = line.match(/\[(.+?)\]\((.+?)\)/)
      if (match) {
        elements.push(
          <Link key={key++} href={match[2]}
            className="inline-block text-teal font-semibold no-underline hover:text-dark-teal transition-colors"
            style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
            {match[1]} →
          </Link>
        )
      }
    // Empty line
    } else if (line.trim() === '') {
      flushAll()
      elements.push(<div key={key++} style={{ height: '0.875rem' }} />)
    // Paragraph
    } else {
      flushAll()
      elements.push(
        <p key={key++} style={{ fontSize: '1.0625rem', color: '#4B5563', lineHeight: 1.85, fontWeight: 300, marginBottom: '0.5rem' }}>
          {inlineRender(line, slug)}
        </p>
      )
    }
  }
  flushAll()
  return elements
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlugAsync(slug)
  if (!post) notFound()

  // Related posts — same division, exclude current
  const allPosts = await getAllPostsAsync()
  const related = allPosts
    .filter(p => p.slug !== slug && p.division === post.division)
    .slice(0, 3)
  const otherPosts = allPosts
    .filter(p => p.slug !== slug && p.division !== post.division)
    .slice(0, Math.max(0, 3 - related.length))
  const relatedPosts = [...related, ...otherPosts].slice(0, 3)

  const readTime = Math.max(2, Math.round(post.body.split(' ').length / 200))


  const heroImage = post.heroImage || DIVISION_HERO_IMAGES[post.division as Division]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: post.author, url: 'https://yourofficespace.au/about' },
    publisher: { '@type': 'Organization', name: 'Your Office Space', url: 'https://yourofficespace.au' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://yourofficespace.au/blog/${post.slug}` },
    image: `https://yourofficespace.au${heroImage}`,
    keywords: post.tags?.join(', '),
    articleSection: DIVISION_LABELS[post.division as Division],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative bg-near-black overflow-hidden" style={{ minHeight: 'clamp(24rem,48vw,38rem)' }}>
        <Image
          src={post.heroImage || DIVISION_HERO_IMAGES[post.division as Division]}
          alt={post.title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark gradient overlay — heavier at bottom */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.96) 30%, rgba(10,10,10,0.6) 70%, rgba(10,10,10,0.3) 100%)' }} />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full" style={{ maxWidth: '52rem', paddingLeft: 'clamp(1.5rem,8vw,6rem)', paddingBottom: 'clamp(2.5rem,5vw,4rem)', paddingTop: '8rem' }}>
            {/* Division + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase ${DIVISION_COLORS[post.division as Division]}`}>
                {DIVISION_LABELS[post.division as Division]}
              </span>
              <span className="text-white/40 text-xs">
                {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-white/40 text-xs">·</span>
              <span className="text-white/40 text-xs">{readTime} min read</span>
              <span className="text-white/40 text-xs">·</span>
              <span className="text-white/40 text-xs">by {post.author}</span>
            </div>

            {/* Title */}
            <h1 className="text-white font-black leading-tight tracking-tight"
              style={{ fontSize: 'clamp(1.75rem,4.5vw,3.5rem)', maxWidth: '44rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY ─────────────────────────── */}
      <section className="bg-white" style={{ paddingTop: 'clamp(3.5rem,7vw,6rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,6rem)', paddingRight: 'clamp(1.5rem,8vw,6rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]" style={{ gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>

            {/* ── MAIN CONTENT ── */}
            <article>
              {/* Excerpt / lead */}
              <p style={{ fontSize: 'clamp(1.1rem,2vw,1.3rem)', color: '#374151', lineHeight: 1.8, fontWeight: 300, marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #F3F4F6' }}>
                {post.excerpt}
              </p>

              {/* Body */}
              <div style={{ maxWidth: '68ch' }}>
                {renderBody(post.body, slug)}
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid #F3F4F6', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ background: '#F9FAFB', color: '#6B7280', fontSize: '0.75rem', padding: '0.35rem 0.875rem', borderRadius: '2rem', fontWeight: 500, border: '1px solid #E5E7EB' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA block */}
              <div style={{ marginTop: '4rem', background: '#0A0A0A', borderRadius: '1rem', padding: 'clamp(2rem,4vw,3rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <p style={{ color: '#00B5A5', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
                    Free — No obligation
                  </p>
                  <p style={{ color: 'white', fontSize: 'clamp(1.1rem,2vw,1.4rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '0.875rem' }}>
                    Want to talk about your situation?
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.75, fontWeight: 300, maxWidth: '36rem' }}>
                    First conversation is always free. No pitch — just an honest assessment of what you&apos;re dealing with and whether we can help.
                  </p>
                </div>
                <div>
                  <BookingCTA label="Book a Clarity Call" variant="primary" />
                </div>
              </div>

              {/* Back link */}
              <div style={{ marginTop: '2.5rem' }}>
                <Link href="/blog" style={{ color: '#00B5A5', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em' }}
                  className="hover:text-dark-teal transition-colors">
                  ← All articles
                </Link>
              </div>
            </article>

            {/* ── SIDEBAR ── */}
            <aside style={{ position: 'sticky', top: '6rem' }}>
              {/* About the author */}
              <div style={{ background: '#F9FAFB', borderRadius: '0.875rem', padding: '1.75rem', marginBottom: '1.5rem', border: '1px solid #E5E7EB' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '1rem' }}>About the author</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#00B5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontSize: '1rem', fontWeight: 900 }}>JK</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, color: '#0A0A0A', fontSize: '0.9rem' }}>Joe Kelley</p>
                    <p style={{ color: '#6B7280', fontSize: '0.78rem', fontWeight: 300 }}>Managing Director</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.825rem', color: '#6B7280', lineHeight: 1.75, fontWeight: 300 }}>
                  Licensed commercial property advisor. A decade in commercial real estate on the tenant side. Founder of Your Office Space.
                </p>
              </div>

              {/* Service links relevant to division */}
              <div style={{ background: '#0A0A0A', borderRadius: '0.875rem', padding: '1.75rem', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00B5A5', marginBottom: '1.25rem' }}>Our services</p>
                {[
                  { label: 'Tenant Representation', href: '/tenant-rep', desc: 'Lease negotiation on your side' },
                  { label: 'Buyers Agency', href: '/buyers-agency', desc: 'Buy without getting burned' },
                  { label: 'Furniture & Fitout', href: '/furniture', desc: 'Brief to delivered workspace' },
                  { label: 'Commercial Cleaning', href: '/cleaning', desc: 'Reliable. Every time.' },
                  { label: 'LeaseIntel™', href: '/leaseintel', desc: '$97 professional lease review' },
                ].map(s => (
                  <Link key={s.href} href={s.href} style={{ display: 'block', marginBottom: '0.875rem', textDecoration: 'none' }}
                    className="group">
                    <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }} className="group-hover:text-teal transition-colors">{s.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 300 }}>{s.desc}</p>
                  </Link>
                ))}
              </div>

              {/* Related articles */}
              {relatedPosts.length > 0 && (
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '0.875rem', padding: '1.75rem' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '1.25rem' }}>Related articles</p>
                  {relatedPosts.map((rp, i) => (
                    <Link key={rp.slug} href={`/blog/${rp.slug}`} style={{ display: 'block', textDecoration: 'none', paddingBottom: i < relatedPosts.length - 1 ? '1rem' : 0, marginBottom: i < relatedPosts.length - 1 ? '1rem' : 0, borderBottom: i < relatedPosts.length - 1 ? '1px solid #F3F4F6' : 'none' }}
                      className="group">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full tracking-widest uppercase ${DIVISION_COLORS[rp.division as Division]}`} style={{ fontSize: '0.6rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                        {DIVISION_LABELS[rp.division as Division]}
                      </span>
                      <p style={{ color: '#111827', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.4, marginTop: '0.375rem' }} className="group-hover:text-teal transition-colors">
                        {rp.title}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {/* Tools CTA */}
              <div style={{ marginTop: '1.5rem', background: '#F0FDFB', border: '1px solid #00B5A520', borderRadius: '0.875rem', padding: '1.75rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00B5A5', marginBottom: '0.875rem' }}>Free tools</p>
                {[
                  { label: 'Lease Risk Checker', href: '/resources/lease-review' },
                  { label: 'Lease Comparison Tool', href: '/resources/lease-comparison' },
                  { label: 'Fitout Cost Estimator', href: '/resources/fitout-estimator' },
                  { label: 'Rental Yield Calculator', href: '/resources/rental-yield-calculator' },
                ].map(t => (
                  <Link key={t.href} href={t.href} style={{ display: 'block', color: '#374151', fontSize: '0.825rem', fontWeight: 500, textDecoration: 'none', marginBottom: '0.625rem' }}
                    className="hover:text-teal transition-colors">
                    → {t.label}
                  </Link>
                ))}
              </div>
            </aside>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
