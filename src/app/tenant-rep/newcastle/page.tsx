import ServiceArticle from '@/components/ServiceArticle'
import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'
import { withPageSeo } from '@/lib/page-seo'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'

export const metadata: Metadata = withPageSeo({
  title: 'Tenant Representative Newcastle | Your Office Space',
  description: 'Tenant representative for Newcastle and Hunter businesses. Compare premises, plan renewals and negotiate commercial lease terms with tenant-side support.',
  alternates: { canonical: 'https://www.yourofficespace.au/tenant-rep/newcastle' },
  openGraph: {

  images: [{ url: '/og/og-default.png', width: 1200, height: 630, alt: 'Your Office Space' }],
title: 'Tenant Rep Newcastle | Your Office Space',
    description: 'Tenant-side commercial leasing support for Newcastle and Hunter businesses, from premises search and renewal planning to negotiation.',
    url: 'https://www.yourofficespace.au/tenant-rep/newcastle',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
})

const SEC    = { paddingTop: 'clamp(5rem,10vw,11rem)', paddingBottom: 'clamp(5rem,10vw,11rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

const FAQ_SCHEMA = [
  {
    q: 'What does a tenant representative do in Newcastle?',
    a: 'A tenant representative advocates exclusively for businesses looking to lease commercial space. Unlike a landlord\'s agent, we work only for you, negotiating rent, lease terms, incentives, and every clause on your behalf. In Newcastle, that means understanding the local market: Hunter Valley office and industrial dynamics, owner-occupier vs investor landlord incentives, and what comparable tenants are paying across the region.',
  },
  {
    q: 'Who pays the tenant representative fee?',
    a: 'Fee arrangements depend on the engagement and transaction structure. We explain the scope, fees and any relevant third-party payment arrangements before work begins.',
  },
  {
    q: 'How is tenant representation different from using a commercial agent?',
    a: 'Most commercial agents in Newcastle work for landlords, they are appointed by the owner to secure the best deal for the property. A tenant representative works exclusively for you. YOS represents the tenant’s agreed brief and explains the scope, fees and any relevant third-party payment arrangements before work begins. Your solicitor advises on the legal terms.',
  },
  {
    q: 'Can you help with an existing lease, not just a new one?',
    a: 'Yes. Our LeaseIntel review covers existing leases, we run your current agreement through a 12-category risk framework covering rent, make-good, relocation rights, option clauses, and outgoings. Each clause is rated Red / Amber / Green. If you are mid-lease or facing a renewal, we can identify leverage you didn\'t know you had.',
  },
  {
    q: 'Do you cover areas outside Newcastle?',
    a: 'Yes. We are Newcastle-based and provide tenant representation across New South Wales through Joseph Kelley, Class 2 licensed real estate agent No. 20565455. Each brief is assessed against the location and agreed service scope.',
  },
  {
    q: 'What types of commercial property do you cover?',
    a: 'Office, industrial, retail, and specialised use, including childcare centres, medical suites, and hospitality fitouts. Each sector has its own lease dynamics, and we tailor the representation accordingly. If it\'s a commercial lease in NSW, we can help.',
  },
]

export default function TenantRepNewcastlePage() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black overflow-hidden" style={SEC}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className={`relative z-10 w-full ${WRAP}`} style={{ ...PAD, paddingTop: 'clamp(8rem,15vw,14rem)', paddingBottom: 'clamp(6rem,10vw,10rem)' }}>
          <FadeIn delay={0}>
            <SectionLabel>Tenant Representation, Newcastle &amp; Hunter</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mt-3 mb-8"
              style={{ fontSize: 'clamp(2rem,6vw,5.5rem)' }}>
              Tenant representative Newcastle.<br />
              <span className="text-teal">Your business comes first.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/80 font-light leading-relaxed max-w-2xl mb-4"
              style={{ fontSize: 'clamp(1rem,2vw,1.375rem)', lineHeight: 1.8 }}>
              Independent tenant representation for Newcastle and Hunter businesses.
              We negotiate rent, terms, incentives, and every lease clause, exclusively on your side of the table.
            </p>
            <p className="text-white/50 font-light mb-10" style={{ fontSize: '0.8rem' }}>
              Tenant representation is delivered within verified NSW licensing coverage.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact?service=leasing#contact-enquiry" variant="primary" size="lg">Enquire</Button>
              <Button href="/lease-review" variant="outline" size="lg">
                Request a Lease Review
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── LOCAL CONTEXT ────────────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn direction="left">
              <div>
                <SectionLabel>Newcastle &amp; Hunter</SectionLabel>
                <h2 className="text-near-black font-bold leading-tight mt-3 mb-8"
                  style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
                  Newcastle commercial property, understood from the tenant&apos;s side.
                </h2>
                <p className="text-charcoal font-light leading-relaxed mb-7"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  The Newcastle and Hunter commercial market behaves differently to Sydney. Owner-occupiers, institutional investors, and family trust landlords operate under different pressures, and that creates both risk and opportunity for tenants who know how to negotiate.
                </p>
                <p className="text-charcoal font-light leading-relaxed mb-12"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  We work exclusively for tenants across the Hunter. That means knowing which buildings are being managed actively vs passively, which landlords have genuine flexibility on incentives, and where the leverage sits at any given point in the market cycle.
                </p>
                <div className="border-l-4 border-teal pl-7 py-5 bg-teal/5">
                  <p className="text-near-black font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                    We have represented tenants across Newcastle CBD, Hamilton, Broadmeadow, New Lambton, Edgeworth, Maitland, Charlestown, and the Port of Newcastle industrial corridor. Every market has its own dynamics, we know ours.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div className="lg:pt-12 space-y-5">
                <p className="text-near-black font-bold text-base mb-4">Key submarkets we cover in Newcastle &amp; Hunter:</p>
                {[
                  { area: 'Newcastle CBD &amp; Hamilton', note: 'Premium office, adaptive reuse, short-term options' },
                  { area: 'Broadmeadow &amp; Islington', note: 'Growing creative/tech precinct, values from $280/sqm' },
                  { area: 'New Lambton &amp; Waratah', note: 'Established commercial, good parking, strong local amenity' },
                  { area: 'Edgeworth &amp; Glendale', note: 'Industrial and trade-orientated, high demand from logistics' },
                  { area: 'Maitland &amp; Rutherford', note: 'Regional centre growth, Government tenants driving demand' },
                  { area: 'Charlestown &amp; Wallsend', note: 'Retail and service hub, mid-market office requirements' },
                  { area: 'Port &amp; Kooragang Industrial', note: 'Specialised industrial, cold storage, logistics users' },
                  { area: 'Central Coast', note: 'Corridor office and industrial, growing residential demand spill-over' },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 50} direction="up">
                    <div className="border border-gray-200 p-6 flex gap-5">
                      <span className="text-teal font-black flex-shrink-0 leading-none mt-0.5" style={{ fontSize: '0.85rem' }}>→</span>
                      <div>
                        <p className="text-near-black font-bold text-sm mb-1" dangerouslySetInnerHTML={{ __html: item.area }} />
                        <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>{item.note}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>How we work</SectionLabel>
            <h2 className="text-white font-black leading-tight mt-3 mb-4"
              style={{ fontSize: 'clamp(1.75rem,4vw,3.5rem)' }}>
              Scope before action.<br />
              <span className="text-teal">A clear tenant-side position.</span>
            </h2>
            <p className="text-white/60 font-light leading-relaxed max-w-2xl mb-14"
              style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
              We work exclusively for tenants. Every conversation, every negotiation, every recommendation is in your interest.
              Here&apos;s how we approach every engagement.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {[
              {
                step: '01',
                title: 'Brief',
                body: 'We understand your business, space requirements, location, timeline, non-negotiables. Nothing goes to market until the brief is right.',
              },
              {
                step: '02',
                title: 'Search',
                body: 'We assess advertised opportunities and verified introductions against the agreed brief, then show the trade-offs clearly.',
              },
              {
                step: '03',
                title: 'Negotiate',
                body: 'Every clause, every rate, every timeline, pushed hard. We work alongside your solicitors to lock in the right deal.',
              },
              {
                step: '04',
                title: 'Handover',
                body: 'Signed and settled. We coordinate fitout, furniture, and cleaning through to day one. You focus on your business.',
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 60} direction="up">
                <div className="border border-white/10 bg-white/[0.03] p-8 h-full">
                  <p className="text-teal font-black mb-4" style={{ fontSize: 'clamp(1.75rem,2.5vw,2.5rem)' }}>{item.step}</p>
                  <h3 className="text-white font-bold text-base mb-3">{item.step === '01' ? 'Brief' : item.step === '02' ? 'Search' : item.step === '03' ? 'Negotiate' : 'Handover'}</h3>
                  <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={150}>
            <div className="border-l-4 border-teal pl-8 py-6 bg-teal/5">
              <p className="text-white font-light leading-relaxed" style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
                The landlord&apos;s agent has one job, get the best outcome for their client. We believe you deserve the same.
                That is why we exist.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHAT&apos;S AT STAKE ──────────────────────────────── */}
      <section className="bg-warm-grey" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>What&apos;s at stake</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight mt-3 mb-8 max-w-3xl"
              style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
              The cost of a bad lease is never just rent.
            </h2>
            <p className="text-charcoal font-light leading-relaxed max-w-2xl mb-14"
              style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
              Most tenants don&apos;t realise how much they&apos;ve overpaid until the lease is up. By then, the leverage is gone.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { risk: 'Above-market rent', detail: 'Test the proposed rent against comparable properties, available incentives and the full occupancy cost before accepting an offer.' },
              { risk: 'Uncapped make-good', detail: 'Identify what must be reinstated, when the obligation arises and how the cost will be assessed. Review the wording with your solicitor before committing.' },
              { risk: 'Missed incentives', detail: 'Compare rent-free periods, fitout contributions and other incentives on the same basis. Availability depends on the property and the negotiated deal.' },
              { risk: 'Bad option structures', detail: 'A poorly drafted option clause can lock you into market rent at renewal, removing all leverage at the moment you have the most.' },
              { risk: 'Relocation risk', detail: 'Have your solicitor review any relocation clause, the conditions for using it and the protections your business needs.' },
              { risk: 'Outgoings exposure', detail: 'Compare gross and net terms carefully. Identify recoverable outgoings and review budgets, reconciliations and exclusions before comparing options.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 60} direction="up">
                <div className="bg-white border border-gray-200 p-8 h-full">
                  <h3 className="text-near-black font-bold text-base leading-snug mb-3">{item.risk}</h3>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>{item.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="max-w-3xl">
            <FadeIn>
              <SectionLabel>Tenant Rep, Frequently Asked Questions</SectionLabel>
              <h2 className="text-near-black font-bold leading-tight mt-3 mb-12"
                style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
                Common questions about tenant representation in Newcastle.
              </h2>
            </FadeIn>

                          <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [
                      ORGANIZATION_SCHEMA,
                      {
                        "@type": "Service",
                        "@id": "https://www.yourofficespace.au/#service-tenant-rep-newcastle",
                        "name": "Tenant Representation Newcastle",
                        "provider": { "@id": "https://www.yourofficespace.au/#organization" },
                        "description": "Expert commercial tenant representation in Newcastle and the Hunter Valley. We negotiate better lease terms for tenants, never landlords.",
                        "areaServed": ["Newcastle", "New South Wales"],
                        "serviceType": "Tenant Representation",
                        "offers": { "@type": "Offer", "description": "Scope, fees and any third-party arrangements are confirmed before engagement." }
                      }
                    ]
                  })
                }}
              />

<script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": FAQ_SCHEMA.map(faq => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.a,
                    },
                  })),
                })
              }}
            />

            <div className="space-y-5">
              {FAQ_SCHEMA.map((faq, i) => (
                <FadeIn key={i} delay={i * 60} direction="up">
                  <div className="border border-gray-200 p-8">
                    <h3 className="text-near-black font-bold text-base leading-snug mb-4">{faq.q}</h3>
                    <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.85 }}>{faq.a}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY US vs COMPETITORS ───────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn direction="left">
              <div>
                <SectionLabel>Why tenant representation matters</SectionLabel>
                <h2 className="text-white font-bold leading-tight mt-3 mb-8"
                  style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
                  Most commercial advisors work both sides of the table.
                </h2>
                <p className="text-white/60 font-light leading-relaxed mb-6"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  The same firm that represents you as a tenant in one deal will represent the landlord in the next.
                  It&apos;s not unusual in commercial real estate, and it means the advice you receive is always slightly compromised.
                </p>
                <div className="border-l-4 border-teal pl-7 py-5 bg-teal/5 mb-10">
                  <p className="text-white font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                    We will never represent a landlord. Every word of every lease is read through one lens:
                    does this protect the tenant? Every negotiation has one outcome: the best deal for the business signing the lease.
                  </p>
                </div>
                <Button href="/contact?service=leasing#contact-enquiry" variant="primary" size="lg">Enquire</Button>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div className="lg:pt-4">
                <p className="text-white/50 font-light text-sm mb-6 tracking-widest uppercase">What you get working with us</p>
                <ul className="space-y-5">
                  {[
                    { title: 'Harder negotiation', body: 'Rent, fit-out contributions, lease length, pushed harder than a split-incentive advisor ever will.' },
                    { title: 'Protective clauses', body: 'The clauses that limit your liability, cap your make-good, and preserve your leverage at renewal.' },
                    { title: 'Hunter market intelligence', body: 'We know which Newcastle and Hunter landlords negotiate in good faith and which ones don\'t. That knowledge is leverage.' },
                    { title: 'Verified market inputs', body: 'Available listings and verified introductions assessed against the same documented brief.' },
                    { title: 'A second set of eyes on the fine print', body: 'Someone whose job is to stop you signing a deal you\'ll regret in year three of your lease.' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-5 items-start pb-5 border-b border-white/10 last:border-0">
                      <span className="text-teal font-black flex-shrink-0 leading-none mt-1" style={{ fontSize: '1.1rem' }}>→</span>
                      <div>
                        <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                        <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── LEASEINTEL CALLOUT ───────────────────────────── */}
      <section className="bg-warm-grey" style={SEC_SM}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="bg-near-black p-8 sm:p-10 lg:p-14 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              <div className="flex-1">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">LeaseIntel™</p>
                <h3 className="text-white font-bold leading-tight mb-4"
                  style={{ fontSize: 'clamp(1.25rem,2.5vw,2rem)' }}>
                  Already have a lease? Request a scoped risk review.
                </h3>
                <p className="text-white/60 font-light leading-relaxed"
                  style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                  Upload your lease and we&apos;ll run it through our 12-category risk framework. Rent, make good, relocation,
                  options, every clause rated Red / Amber / Green. Free summary returned shortly.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button href="/lease-review" variant="primary" size="lg">
                  Request a Lease Review
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="bg-teal" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
              <h2 className="text-near-black font-bold leading-tight mb-5 w-full"
                style={{ fontSize: 'clamp(1.7rem,4.5vw,3.75rem)' }}>
                Let&apos;s talk about your lease.
              </h2>
              <p className="text-charcoal font-light leading-relaxed mb-14 w-full"
                style={{ fontSize: 'clamp(1rem,1.8vw,1.2rem)', lineHeight: 1.8 }}>
                A focused conversation about your space, your situation and the decision in front of you.
              </p>
              <Button href="/contact?service=leasing#contact-enquiry" variant="dark" size="lg">Enquire</Button>
              <p className="text-charcoal font-light mt-6" style={{ fontSize: '0.8rem' }}>
                Newcastle &amp; Hunter &nbsp;|&nbsp; (02) 4092 0733 &nbsp;|&nbsp; jk@yourofficespace.au
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <ServiceArticle slug="tenant-representation-brief-newcastle" />
</main>

      <Footer />
    </>
  )
}
