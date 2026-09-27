import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogEmailCapture from '@/components/BlogEmailCapture'
import { getAllPublicPostsAsync, DIVISION_LABELS, SAFE_DIVISION } from '@/lib/blog'

export const metadata = {
  title: 'Blog | Your Office Space',
  description: 'Commercial property insights for Australian businesses. Leasing, fitout, furniture, cleaning and market updates.',
  alternates: { canonical: 'https://www.yourofficespace.au/blog' },
  twitter: { card: 'summary_large_image', title: 'Blog | Your Office Space', description: 'Commercial property insights for Australian business owners. Lease guides, fitout costs, cleaning standards and more.' },
  openGraph: {
    title: 'Blog | Your Office Space',
    description: 'Commercial property insights for Australian businesses. Leasing, fitout, furniture, cleaning and market updates.',
    url: 'https://www.yourofficespace.au/blog',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
    images: [{ url: '/og-blog.png', width: 1200, height: 630, alt: 'Blog, Your Office Space' }],
  },
}

export const revalidate = 3600 // re-check Redis every hour

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Your Office Space commercial property guides',
  url: 'https://www.yourofficespace.au/blog',
  publisher: { '@id': 'https://www.yourofficespace.au/#business' },
}

export default async function BlogPage() {
  const raw = await getAllPublicPostsAsync()
  const posts = (raw || []).filter(Boolean).map((x) => {
    const o = x as unknown as Record<string, unknown>
    return { ...o,
      slug: String(o.slug || ''),
      title: String(o.title || 'Untitled'),
      excerpt: String(o.excerpt || String(o.body || '').slice(0, 160)),
      body: String(o.body || o.excerpt || ''),
      date: String(o.date || new Date().toISOString().slice(0, 10)),
      division: String(o.division || 'general'),
      tags: Array.isArray(o.tags) ? o.tags : [],
    }
  }).filter((x) => x.slug) as typeof raw
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* ─── HERO ─────────────────────────────────── */}
      <section style={{ background: '#0A0A0A', paddingTop: 'clamp(7rem,14vw,11rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,6rem)', paddingRight: 'clamp(1.5rem,8vw,6rem)' }}>
          <p style={{ color: '#01A7A3', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Insights</p>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(2.5rem,6vw,5rem)', lineHeight: 1.0, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            The YOS Blog
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300, fontSize: '1rem', lineHeight: 1.8, maxWidth: '36rem' }}>
            Practical insights on commercial leasing, fitout, furniture, cleaning, and the property market. No fluff.
          </p>
        </div>
      </section>

      {/* ─── FEATURED POST ────────────────────────── */}
      {featured && (
        <section style={{ background: '#0A0A0A', paddingBottom: 'clamp(4rem,8vw,6rem)' }}>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,6rem)', paddingRight: 'clamp(1.5rem,8vw,6rem)' }}>
            <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block' }} className="group">
              {/* Two-col on lg+, stacked on mobile */}
              <div className="flex flex-col lg:flex-row" style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.18)' }}>
                <div className="w-full lg:w-1/3 flex items-center justify-center bg-teal" style={{ minHeight: '12rem', padding: '2rem' }}>
                  <span className="text-near-black font-semibold tracking-widest uppercase text-center">
                    {DIVISION_LABELS[SAFE_DIVISION(featured.division)]}
                  </span>
                </div>
                {/* Content */}
                <div className="lg:w-2/3" style={{ background: '#1A1A1A', padding: 'clamp(2rem,5vw,4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', fontWeight: 300, marginBottom: '1.25rem' }}>
                    {new Date(featured.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })} · Featured
                  </p>
                  <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.35rem,2.5vw,2.1rem)', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: '1.25rem' }}
                    className="group-hover:text-teal transition-colors">
                    {featured.title}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.85, marginBottom: '2rem' }}>
                    {featured.excerpt}
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#01A7A3', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Read article</span>
                    <span style={{ color: '#01A7A3' }}>→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ─── ARTICLE GRID ─────────────────────────── */}
      {rest.length > 0 && (
        <section style={{ background: 'white', paddingTop: 'clamp(4rem,8vw,6rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,6rem)', paddingRight: 'clamp(1.5rem,8vw,6rem)' }}>
            <p style={{ color: '#0C7A70', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '2.5rem' }}>All articles</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem' }}>
              {rest.map(post => {
                const readTime = Math.max(2, Math.round(String(post.body || post.excerpt || '').split(' ').length / 200))
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: '4px', overflow: 'hidden', border: '1px solid #E5E5E5', background: 'white' }}
                    className="group hover:border-teal transition-colors duration-200">

                    <div className="bg-light-teal border-b border-line" style={{ padding: '1rem 1.25rem' }}>
                      <span className="text-near-black font-semibold tracking-widest uppercase" style={{ fontSize: '0.58rem' }}>
                        {DIVISION_LABELS[SAFE_DIVISION(post.division)]}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.75rem 1.75rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ color: '#0A0A0A', fontWeight: 800, fontSize: '1rem', lineHeight: 1.4, marginBottom: '0.75rem' }}
                        className="group-hover:text-teal transition-colors">
                        {post.title}
                      </h3>
                      <p style={{ color: '#6B7280', fontWeight: 300, fontSize: '0.875rem', lineHeight: 1.75, flex: 1, marginBottom: '1.5rem' }}>
                        {post.excerpt.length > 115 ? post.excerpt.slice(0, 115) + '…' : post.excerpt}
                      </p>
                      {/* Footer row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid #F3F4F6' }}>
                        <div>
                          <p style={{ color: '#666666', fontSize: '0.72rem', lineHeight: 1.5 }}>
                            {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p style={{ color: '#666666', fontSize: '0.72rem', fontWeight: 300, lineHeight: 1.5 }}>{readTime} min read</p>
                        </div>
                        <span style={{ color: '#0C7A70', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}
                          className="group-hover:text-dark-teal transition-colors">
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── EMAIL CAPTURE ────────────────────────── */}
      <section style={{ background: '#F9FAFB', paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,6rem)', paddingRight: 'clamp(1.5rem,8vw,6rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <p style={{ color: '#0C7A70', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Stay sharp</p>
          <h2 style={{ color: '#0A0A0A', fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.25rem)', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '1rem', maxWidth: '28rem' }}>
            Get new articles when they land.
          </h2>
          <p style={{ color: '#6B7280', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '32rem' }}>
            Commercial property insights for Australian business owners. Practical guidance for better commercial property decisions.
          </p>
          <BlogEmailCapture />
        </div>
      </section>

      </main>

      <Footer />
    </>
  )
}
