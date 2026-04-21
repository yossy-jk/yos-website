import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import BlogEmailCapture from '@/components/BlogEmailCapture'
import { getAllPosts, DIVISION_LABELS, DIVISION_COLORS, DIVISION_HERO_IMAGES } from '@/lib/blog'
import type { Division } from '@/lib/blog'

export const metadata = {
  title: 'Blog | Your Office Space',
  description: 'Commercial property insights for Australian businesses. Leasing, fitout, furniture, cleaning and market updates.',
  alternates: { canonical: 'https://yourofficespace.au/blog' },
  twitter: { card: 'summary_large_image', title: 'Blog | Your Office Space', description: 'Commercial property insights for Australian business owners. Lease guides, fitout costs, cleaning standards and more.' },
  openGraph: {
    title: 'Blog | Your Office Space',
    description: 'Commercial property insights for Australian businesses. Leasing, fitout, furniture, cleaning and market updates.',
    url: 'https://yourofficespace.au/blog',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const WRAP = { maxWidth: '1280px', margin: '0 auto', paddingLeft: 'clamp(1.5rem,8vw,6rem)', paddingRight: 'clamp(1.5rem,8vw,6rem)' }

export default function BlogPage() {
  const posts = getAllPosts()
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────────── */}
      <section style={{ background: '#0A0A0A', paddingTop: 'clamp(7rem,14vw,11rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
        <div style={WRAP}>
          <p style={{ color: '#00B5A5', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Insights</p>
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
        <section style={{ background: '#0A0A0A', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
          <div style={WRAP}>
            <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block' }} className="group">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}
                className="grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div style={{ position: 'relative', minHeight: '22rem' }}>
                  <Image
                    src={featured.heroImage || DIVISION_HERO_IMAGES[featured.division as Division]}
                    alt={featured.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase ${DIVISION_COLORS[featured.division as Division]}`}>
                      {DIVISION_LABELS[featured.division as Division]}
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div style={{ background: '#141414', padding: 'clamp(2.5rem,5vw,4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', fontWeight: 300, marginBottom: '1.5rem' }}>
                    {new Date(featured.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })} · Featured
                  </p>
                  <h2 style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(1.5rem,2.5vw,2.25rem)', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: '1.25rem' }}
                    className="group-hover:text-teal transition-colors">
                    {featured.title}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                    {featured.excerpt}
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#00B5A5', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                      Read article
                    </span>
                    <span style={{ color: '#00B5A5', fontSize: '0.85rem' }}>→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ─── ARTICLE GRID ─────────────────────────── */}
      <section style={{ background: 'white', paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(5rem,10vw,9rem)' }}>
        <div style={WRAP}>
          {rest.length > 0 && (
            <>
              <p style={{ color: '#00B5A5', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '3rem' }}>All articles</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {rest.map(post => {
                  const readTime = Math.max(2, Math.round(post.body.split(' ').length / 200))
                  return (
                    <Link key={post.slug} href={`/blog/${post.slug}`}
                      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: '0.875rem', overflow: 'hidden', border: '1px solid #E5E7EB', background: 'white' }}
                      className="group hover:border-teal hover:shadow-lg transition-all duration-200">

                      {/* Hero image */}
                      <div style={{ position: 'relative', height: '13rem', flexShrink: 0, overflow: 'hidden', background: '#F3F4F6' }}>
                        <Image
                          src={post.heroImage || DIVISION_HERO_IMAGES[post.division as Division]}
                          alt={post.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Division badge */}
                        <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full tracking-widest uppercase ${DIVISION_COLORS[post.division as Division]}`}
                            style={{ fontSize: '0.6rem' }}>
                            {DIVISION_LABELS[post.division as Division]}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ color: '#0A0A0A', fontWeight: 800, fontSize: '1rem', lineHeight: 1.35, marginBottom: '0.875rem' }}
                          className="group-hover:text-teal transition-colors">
                          {post.title}
                        </h3>
                        <p style={{ color: '#6B7280', fontWeight: 300, fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.5rem', flex: 1 }}>
                          {post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + '…' : post.excerpt}
                        </p>
                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid #F3F4F6' }}>
                          <div>
                            <p style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 400 }}>
                              {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                            <p style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 300 }}>{readTime} min read</p>
                          </div>
                          <span style={{ color: '#00B5A5', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}
                            className="group-hover:text-dark-teal transition-colors">
                            Read →
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── EMAIL CAPTURE ────────────────────────── */}
      <section style={{ background: '#F9FAFB', paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div style={{ ...WRAP, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <p style={{ color: '#00B5A5', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Stay sharp</p>
          <h2 style={{ color: '#0A0A0A', fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.25rem)', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '1rem', maxWidth: '28rem' }}>
            Get new articles when they land.
          </h2>
          <p style={{ color: '#6B7280', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '32rem' }}>
            Commercial property insights for Australian business owners. No noise, no pitch — just useful.
          </p>
          <BlogEmailCapture />
        </div>
      </section>

      <Footer />
    </>
  )
}
