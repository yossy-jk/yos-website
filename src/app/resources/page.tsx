import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'
import { getAllPosts, DIVISION_LABELS } from '@/lib/blog'
import { getAllCaseStudies } from '@/lib/case-studies'

export const metadata = {
  title: 'Resources & Insights | Your Office Space',
  description: 'Free commercial property tools, articles and case studies for Australian businesses. Lease checkers, fitout estimators, market insights and real project outcomes.'
}

const tools = [
  { title: 'Lease Risk Checker', description: 'Answer 10 questions and get an instant risk report. We flag the clauses that need attention — and tell you what to negotiate.', href: '/resources/lease-review', features: ['10-question assessment', 'Plain-English risk flags', 'Instant results'] },
  { title: 'Fitout Cost Estimator', description: 'Estimate your fitout cost using real market rates. Full breakdown across Basic, Mid-Range and Premium tiers.', href: '/resources/fitout-estimator', features: ['2026 market rates', 'Three quality tiers', 'Contingency included'] },
  { title: 'Cap Rate Calculator', description: 'Calculate the cap rate on any commercial property. Understand yield, net income and implied value at multiple scenarios.', href: '/resources/cap-rate-calculator', features: ['Net income calculation', 'Multiple cap rate scenarios', 'Vacancy + outgoings'] },
  { title: 'Lease Comparison Tool', description: 'Compare up to three lease options on true occupancy cost — not just face rent. Includes rent-free periods, outgoings and NPV.', href: '/resources/lease-comparison', features: ['3-way comparison', 'Effective rent calculation', 'Net Present Value'] },
  { title: 'Purchase Checklist', description: 'A 25-point due diligence checklist for commercial property buyers in NSW. Tick off as you go.', href: '/resources/purchase-checklist', features: ['25 due diligence checks', 'Zoning, title, building', 'NSW-specific'] },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'tenant-rep', label: 'Tenant Rep' },
  { id: 'furniture', label: 'Furniture & Fitout' },
  { id: 'buyers-agency', label: 'Buyers Agency' },
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'general', label: 'General' },
]

export default function ResourcesPage() {
  const posts = getAllPosts()
  const caseStudies = getAllCaseStudies()

  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────── */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(5rem,10vw,11rem)', paddingBottom: 'clamp(3.5rem,8vw,7rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-5" style={{ fontSize: '0.72rem' }}>Resources</p>
            <h1 className="text-white font-black uppercase leading-none tracking-tight mb-8"
              style={{ fontSize: 'clamp(2.25rem,6vw,6.5rem)' }}>
              Tools. Insights.<br />Real outcomes.
            </h1>
            <p className="text-white/60 font-light leading-relaxed"
              style={{ fontSize: '1rem', maxWidth: '38rem', lineHeight: 1.75 }}>
              Free tools for commercial property decisions, practical articles, and real project case studies. No sign-up required.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FREE TOOLS ───────────────────────── */}
      <section className="bg-white" style={{ paddingTop: 'clamp(3rem,8vw,10rem)', paddingBottom: 'clamp(3rem,8vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-5" style={{ fontSize: '0.72rem' }}>Free tools</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-10 md:mb-8 md:mb-16"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
              Built for decisions.<br />Free to use.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <FadeIn key={tool.title} delay={i * 60}>
                <Link href={tool.href} className="group no-underline flex flex-col h-full bg-white border border-gray-100 hover:border-teal transition-colors duration-200"
                  style={{ padding: '2.5rem 2.25rem' }}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-near-black font-black uppercase tracking-tight group-hover:text-teal transition-colors"
                      style={{ fontSize: '1.05rem', maxWidth: '16ch' }}>{tool.title}</h3>
                    <span className="bg-teal text-white font-bold flex-shrink-0 ml-3"
                      style={{ fontSize: '0.58rem', letterSpacing: '0.15em', padding: '0.3rem 0.65rem', textTransform: 'uppercase' }}>Free</span>
                  </div>
                  <p className="text-charcoal font-light leading-relaxed flex-1 mb-6"
                    style={{ fontSize: '0.9rem', lineHeight: 1.75 }}>{tool.description}</p>
                  <ul className="flex flex-col gap-2 mb-6">
                    {tool.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-teal rounded-full flex-shrink-0" />
                        <span className="text-mid-grey" style={{ fontSize: '0.78rem' }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="text-teal font-bold uppercase tracking-widest group-hover:text-dark-teal transition-colors"
                    style={{ fontSize: '0.65rem' }}>Open tool →</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSIGHTS: ARTICLES ───────────────── */}
      <section className="bg-warm-grey" style={{ paddingTop: 'clamp(3rem,8vw,10rem)', paddingBottom: 'clamp(3rem,8vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-16">
              <div>
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-5" style={{ fontSize: '0.72rem' }}>Articles</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
                  Insights &amp; advice.
                </h2>
              </div>
              <Link href="/blog"
                className="text-teal font-bold uppercase tracking-widest no-underline hover:text-dark-teal transition-colors flex-shrink-0"
                style={{ fontSize: '0.72rem' }}>
                View all articles →
              </Link>
            </div>
          </FadeIn>

          {/* Filter tabs */}
          <FadeIn delay={60}>
            <div className="flex flex-wrap gap-2 mb-12">
              {FILTERS.map(f => (
                <Link key={f.id} href={f.id === 'all' ? '/blog' : `/blog?division=${f.id}`}
                  className="no-underline border border-gray-200 bg-white hover:border-teal hover:text-teal transition-colors text-near-black font-medium"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  {f.label}
                </Link>
              ))}
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post, i) => (
              <FadeIn key={post.slug} delay={i * 60}>
                <Link href={`/blog/${post.slug}`} className="group no-underline flex flex-col h-full bg-white hover:border-teal border border-gray-100 transition-colors duration-200"
                  style={{ padding: '2.25rem 2rem' }}>
                  <span className="bg-teal text-white font-bold uppercase tracking-widest inline-block mb-5 self-start"
                    style={{ fontSize: '0.6rem', padding: '0.3rem 0.75rem' }}>
                    {DIVISION_LABELS[post.division as keyof typeof DIVISION_LABELS]}
                  </span>
                  <h3 className="text-near-black font-black leading-tight tracking-tight group-hover:text-teal transition-colors flex-1 mb-4"
                    style={{ fontSize: '1.05rem' }}>
                    {post.title}
                  </h3>
                  <p className="text-charcoal font-light leading-relaxed mb-6"
                    style={{ fontSize: '0.875rem', lineHeight: 1.75 }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-mid-grey font-light" style={{ fontSize: '0.75rem' }}>
                      {new Date(post.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-teal font-bold group-hover:text-dark-teal transition-colors" style={{ fontSize: '0.75rem' }}>Read →</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CASE STUDIES ────────────────────── */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(3rem,8vw,10rem)', paddingBottom: 'clamp(3rem,8vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-16">
              <div>
                <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-5" style={{ fontSize: '0.72rem' }}>Case studies</p>
                <h2 className="text-white font-black uppercase leading-tight tracking-tight"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
                  Real projects.<br />Real outcomes.
                </h2>
              </div>
              <Link href="/case-studies"
                className="text-teal font-bold uppercase tracking-widest no-underline hover:text-dark-teal transition-colors flex-shrink-0"
                style={{ fontSize: '0.72rem' }}>
                View all case studies →
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.slice(0, 3).map((cs, i) => (
              <FadeIn key={cs.slug} delay={i * 60}>
                <Link href={`/case-studies/${cs.slug}`} className="group no-underline flex flex-col h-full bg-near-black border border-white/8 hover:border-teal transition-colors duration-200">
                  {cs.heroImage && (
                    <div className="overflow-hidden" style={{ height: '13rem' }}>
                      <img src={cs.heroImage} alt={cs.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1" style={{ padding: '2rem' }}>
                    <span className="bg-teal text-white font-bold uppercase tracking-widest inline-block mb-4 self-start"
                      style={{ fontSize: '0.6rem', padding: '0.3rem 0.75rem' }}>
                      {DIVISION_LABELS[cs.division as keyof typeof DIVISION_LABELS] || 'Project'}
                    </span>
                    <h3 className="text-white font-black leading-tight tracking-tight group-hover:text-teal transition-colors flex-1 mb-4"
                      style={{ fontSize: '1.05rem' }}>
                      {cs.title}
                    </h3>
                    <p className="text-white/45 font-light leading-relaxed mb-6"
                      style={{ fontSize: '0.875rem', lineHeight: 1.75 }}>
                      {cs.excerpt}
                    </p>
                    <span className="text-teal font-bold group-hover:text-dark-teal transition-colors" style={{ fontSize: '0.75rem' }}>
                      View project →
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────── */}
      <section className="bg-teal" style={{ paddingTop: 'clamp(3rem,7vw,7rem)', paddingBottom: 'clamp(3rem,7vw,7rem)' }}>
        <div className="max-w-screen-xl mx-auto text-center" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
              Tools get you started.<br />A conversation gets you moving.
            </h2>
            <p className="text-white/80 font-light leading-relaxed mb-12 mx-auto"
              style={{ fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.75 }}>
              Use the tools to build your understanding. Then talk to our team when you&apos;re ready to act. First conversation is free.
            </p>
            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-white text-teal font-bold no-underline hover:bg-light-teal transition-colors"
              style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Book a Clarity Call
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  )
}
