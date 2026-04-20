import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Footer from '@/components/Footer'
import { getAllPosts, DIVISION_LABELS, DIVISION_COLORS, DIVISION_HERO_IMAGES } from '@/lib/blog'
import type { Division } from '@/lib/blog'
import BlogEmailCapture from '@/components/BlogEmailCapture'

export const metadata = {
  title: 'Blog | Your Office Space',
  description: 'Commercial property insights for Australian businesses. Leasing, fitout, furniture, cleaning and market updates.',
  openGraph: {
    title: 'Blog | Your Office Space',
    description: 'Commercial property insights for Australian businesses. Leasing, fitout, furniture, cleaning and market updates.',
    url: 'https://yourofficespace.au/blog',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC  = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function BlogPage() {
  const posts = getAllPosts()
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(7rem,14vw,13rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>
        <div className={WRAP} style={PAD}>
          <SectionLabel>Insights</SectionLabel>
          <h1 className="text-white font-bold leading-tight tracking-tight max-w-3xl mb-6"
            style={{ fontSize: 'clamp(2.25rem,6vw,5rem)' }}>
            The YOS Blog
          </h1>
          <p className="text-white/60 font-light leading-relaxed max-w-2xl"
            style={{ fontSize: 'clamp(1rem,2vw,1.25rem)' }}>
            Practical insights on commercial leasing, fitout, furniture, cleaning, and the property market. No fluff.
          </p>
        </div>
      </section>

      {/* ─── POSTS ────────────────────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          {posts.length === 0 ? (
            <p className="text-mid-grey font-light text-lg">Posts coming soon.</p>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="no-underline group block mb-10 md:mb-16">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-200 overflow-hidden hover:border-teal transition-colors duration-200">
                    <div className="bg-warm-grey h-64 lg:h-auto" />
                    <div className="p-10 lg:p-14 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIVISION_COLORS[featured.division as Division]}`}>
                          {DIVISION_LABELS[featured.division as Division]}
                        </span>
                        <span className="text-mid-grey text-xs">
                          {new Date(featured.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <h2 className="text-near-black font-bold leading-tight mb-4 group-hover:text-teal transition-colors"
                        style={{ fontSize: 'clamp(1.5rem,2.5vw,2.25rem)' }}>
                        {featured.title}
                      </h2>
                      <p className="text-charcoal font-light text-base leading-relaxed mb-6">{featured.excerpt}</p>
                      <p className="text-teal font-semibold text-sm group-hover:text-dark-teal transition-colors">Read article →</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* Post grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map(post => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="no-underline group flex flex-col border border-gray-200 hover:border-teal transition-colors duration-200 overflow-hidden">
                      {/* Feature image */}
                      <div className="relative overflow-hidden" style={{ height: '12rem' }}>
                        <Image
                          src={post.heroImage || DIVISION_HERO_IMAGES[post.division as Division]}
                          alt={post.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIVISION_COLORS[post.division as Division]}`}>
                            {DIVISION_LABELS[post.division as Division]}
                          </span>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-7 flex flex-col flex-1">
                        <h2 className="text-near-black font-bold text-lg leading-snug mb-3 group-hover:text-teal transition-colors flex-1">
                          {post.title}
                        </h2>
                        <p className="text-charcoal font-light text-sm leading-relaxed mb-4">{post.excerpt}</p>
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                          <p className="text-mid-grey text-xs">
                            {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-teal font-semibold text-xs tracking-widest uppercase group-hover:text-dark-teal transition-colors">Read →</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>


      {/* Email capture */}
      <section style={{ paddingTop: 'clamp(3rem,6vw,6rem)', paddingBottom: 'clamp(3rem,6vw,6rem)', background: '#FAFAFA' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div className="flex flex-col items-center text-center" style={{ maxWidth: '36rem', margin: '0 auto' }}>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.72rem' }}>Stay sharp</p>
            <h2 className="text-near-black font-bold mb-4" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}>
              Get new articles when they land.
            </h2>
            <p className="text-mid-grey font-light mb-8" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
              Commercial property insights for Australian business owners. No noise, no pitch — just useful.
            </p>
            <BlogEmailCapture />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
