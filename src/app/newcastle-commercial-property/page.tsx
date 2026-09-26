import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const SEC    = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'
import BookingCTA from '@/components/BookingCTA'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newcastle Commercial Property, Leases, Fitout, Cleaning & Market Guides',
  description: 'Everything Newcastle businesses need to know about commercial property. Tenant representation, lease negotiation, office fitout costs, and commercial cleaning, all local, all practical.',
  alternates: { canonical: 'https://www.yourofficespace.au/newcastle-commercial-property' },
  openGraph: {
    title: 'Newcastle Commercial Property Hub, Your Office Space',
    description: 'Local guides, market updates and practical advice for Newcastle businesses navigating commercial property.',
    url: 'https://www.yourofficespace.au/newcastle-commercial-property',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const ARTICLES = [
  {
    category: 'Tenant Representation',
    slug: 'what-is-tenant-representation-newcastle',
    title: 'What Is Tenant Representation, And Why Every Newcastle Business Needs It',
    desc: 'Your landlord has a professional negotiator. Most tenants don\'t. Here\'s what tenant representation actually means and why it matters in the Newcastle market.',
  },
  {
    category: 'Market Intelligence',
    slug: 'hunter-valley-commercial-property-market-2026',
    title: 'Hunter Valley Commercial Property Market Update, Q2 2026',
    desc: 'Vacancy rates, incentives and what\'s actually happening in the Newcastle and Hunter commercial property market right now.',
  },
  {
    category: 'Office Fitout',
    slug: 'commercial-fitout-cost-newcastle-2026',
    title: 'What Does a Commercial Office Fitout Cost in Newcastle in 2026?',
    desc: 'Real cost ranges for Newcastle office fitouts, from cold shell to fully furnished. What drives costs up and how to manage your budget.',
  },
  {
    category: 'Commercial Cleaning',
    slug: 'commercial-cleaning-newcastle-what-to-expect',
    title: 'Commercial Cleaning in Newcastle: What You Should Expect From Your Cleaner',
    desc: 'What separates a reliable Newcastle commercial cleaning contractor from one that quietly lets standards slip.',
  },
]

const SERVICES = [
  { label: 'Tenant Representation', href: '/tenant-rep', desc: 'Lease negotiation on your side, not the landlord\'s.' },
  { label: 'Commercial Fit Out & Project Management', href: '/office-fitout', desc: 'Workplace brief through delivery and handover.' },
  { label: 'Office & Commercial Furniture', href: '/furniture', desc: 'Furniture selected, supplied and installed.' },
  { label: 'Commercial Cleaning', href: '/cleaning', desc: 'Accountable cleaning aligned to your workplace standard.' },
]

export default function NewcastleCommercialPropertyHub() {
  return (
    <>
      {/* ─── SCHEMA ────────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://www.yourofficespace.au/#organization",
            "name": "Your Office Space",
            "url": "https://www.yourofficespace.au",
            "logo": "https://www.yourofficespace.au/logo.png",
            "telephone": "+61434655511",
            "email": "jk@yourofficespace.au",
            "description": "Newcastle-based tenant-side commercial property advisory across Australia, spanning tenant representation, fit out and project management, furniture and commercial cleaning.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Newcastle",
              "addressRegion": "NSW",
              "postalCode": "2300",
              "addressCountry": "AU"
            },
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Maitland" },
              { "@type": "City", "name": "Lake Macquarie" },
              { "@type": "State", "name": "New South Wales" },
              { "@type": "Country", "name": "Australia" }
            ]
          },
          {
            "@type": "CollectionPage",
            "name": "Newcastle Commercial Property Hub",
            "description": "Local guides, market updates and practical advice for Newcastle businesses navigating commercial property.",
            "url": "https://www.yourofficespace.au/newcastle-commercial-property"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What is tenant representation in Newcastle?", "acceptedAnswer": { "@type": "Answer", "text": "Tenant representation is an agent working exclusively for the tenant in a commercial lease negotiation. In Newcastle, tenant reps negotiate rent, incentives, make-good terms and lease conditions on behalf of the tenant, never the landlord." } },
              { "@type": "Question", "name": "How should a Newcastle business plan a commercial fit out?", "acceptedAnswer": { "@type": "Answer", "text": "Start with the workplace brief, budget, programme and lease constraints, then coordinate design, procurement, approvals, construction, furniture and handover around one accountable plan." } }
            ]
          }
        ]
      }) }} />

      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* HERO */}
      <section className="bg-near-black" style={SEC_SM}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Newcastle Commercial Property</SectionLabel>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight mb-6 max-w-4xl"
              style={{ fontSize: 'clamp(2rem,5.5vw,5.5rem)' }}>
              Newcastle commercial property.<br />
              <span className="text-teal">Local knowledge. Straight advice.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/60 font-light leading-relaxed max-w-2xl"
              style={{ fontSize: 'clamp(1rem,2vw,1.2rem)' }}>
              Guides, market intelligence and practical advice for Newcastle and Hunter Valley businesses
              navigating leases, fit outs, furniture and commercial cleaning. Written by people who do this
              work every day in this market.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* SERVICES STRIP */}
      <section className="bg-teal/10 border-y border-teal/20">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingTop: 'clamp(3rem,6vw,5rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
          <FadeIn>
            <p className="text-action-teal font-bold text-xs tracking-widest uppercase mb-6">YOS Services, Newcastle & Hunter Valley</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES.map(s => (
                <Link key={s.href} href={s.href}
                  className="no-underline group bg-near-black rounded-xl p-8 border border-white/10 hover:border-teal hover:shadow-md transition-all duration-300">
                  <p className="text-white font-bold text-sm mb-2 group-hover:text-teal transition-colors">{s.label}</p>
                  <p className="text-white/40 font-light text-xs leading-relaxed">{s.desc}</p>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="bg-white" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Guides & Market Intelligence</SectionLabel>
            <h2 className="text-near-black font-black leading-tight tracking-tight mt-3 mb-12"
              style={{ fontSize: 'clamp(1.5rem,3.5vw,2.75rem)' }}>
              Everything you need to know about<br />commercial property in Newcastle.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARTICLES.map((article, i) => (
              <FadeIn key={article.slug} delay={i * 60} direction="up">
                <Link href={`/blog/${article.slug}`}
                  className="no-underline group flex flex-col h-full bg-warm-grey rounded-xl p-8 border border-transparent hover:border-teal/30 hover:shadow-md transition-all duration-300">
                  <span className="text-teal font-bold text-xs tracking-widest uppercase mb-3">{article.category}</span>
                  <h3 className="text-near-black font-bold leading-snug mb-3 group-hover:text-teal transition-colors"
                    style={{ fontSize: 'clamp(0.95rem,1.5vw,1.1rem)' }}>
                    {article.title}
                  </h3>
                  <p className="text-charcoal/60 font-light text-sm leading-relaxed flex-1">{article.desc}</p>
                  <span className="text-teal font-bold text-xs mt-4 group-hover:underline">Read more →</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL INTEL */}
      <section className="bg-near-black" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Why local matters</SectionLabel>
            <h2 className="text-white font-black leading-tight tracking-tight mt-3 mb-10"
              style={{ fontSize: 'clamp(1.5rem,3.5vw,2.75rem)' }}>
              We live and work in this market.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { heading: 'Newcastle CBD', body: 'Hunter Street, King Street, the East End precinct and surrounds. We know which buildings are genuinely well-managed and which ones look good on paper.' },
              { heading: 'Maitland & Hunter Valley', body: 'Commercial activity in Maitland, Thornton, Rutherford and the broader Hunter Valley. Growth corridors, industrial and office opportunities.' },
              { heading: 'Lake Macquarie & Surrounds', body: 'Charlestown, Glendale, Morisset and Cardiff. Often overlooked, often better value. We know the difference.' },
            ].map((item, i) => (
              <FadeIn key={item.heading} delay={i * 70} direction="up">
                <div className="border-l-4 border-teal pl-6 py-1">
                  <p className="text-white font-bold text-base mb-2">{item.heading}</p>
                  <p className="text-white/80 font-light leading-relaxed text-sm">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA />
      </main>

      <Footer />
    </>
  )
}
