import Link from 'next/link'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Footer from '@/components/Footer'
import { getAllPosts, DIVISION_LABELS, DIVISION_COLORS } from '@/lib/blog'
import type { Division } from '@/lib/blog'

export const metadata = {
  title: 'Blog | Your Office Space',
  description: 'Commercial property insights for Australian businesses. Leasing, fitout, furniture, cleaning and market updates.'
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
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="no-underline group">
                      <div className="border border-gray-200 p-8 hover:border-teal transition-colors duration-200 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIVISION_COLORS[post.division as Division]}`}>
                            {DIVISION_LABELS[post.division as Division]}
                          </span>
                        </div>
                        <h2 className="text-near-black font-bold text-xl leading-snug mb-3 group-hover:text-teal transition-colors flex-1">
                          {post.title}
                        </h2>
                        <p className="text-charcoal font-light text-sm leading-relaxed mb-4">{post.excerpt}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <p className="text-mid-grey text-xs">
                            {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-teal font-semibold text-sm group-hover:text-dark-teal transition-colors">Read →</p>
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

      <Footer />
    </>
  )
}
