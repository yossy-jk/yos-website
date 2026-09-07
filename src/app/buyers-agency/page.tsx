import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'
import BookingCTA from '@/components/BookingCTA'

export const metadata: Metadata = {
  title: 'Commercial purchase advisory by referral | Your Office Space',
  description: 'Case-by-case commercial property purchase support for referred clients.',
  alternates: { canonical: 'https://www.yourofficespace.au/buyers-agency' },
  robots: { index: false, follow: false },
}

const SEC = { paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }
const WRAP = 'max-w-screen-xl mx-auto'
const PAD = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

const SCOPE = [
  {
    title: 'Brief and decision criteria',
    body: 'Clarify the commercial objective, property requirements, timing, stakeholders and decision boundaries.',
  },
  {
    title: 'Opportunity assessment',
    body: 'Assess suitable opportunities against the same brief and make the evidence, assumptions and trade-offs visible.',
  },
  {
    title: 'Due diligence coordination',
    body: 'Coordinate the commercial workstream with the client’s legal, finance, tax, building and environmental advisers.',
  },
  {
    title: 'Negotiation and handover',
    body: 'Support the commercial negotiation, action register and transition through the agreed transaction milestones.',
  },
]

export default function ReferralPurchaseAdvisoryPage() {
  return (
    <>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className="bg-near-black" style={SEC}>
          <div className={WRAP} style={{ ...PAD, paddingTop: 'clamp(6rem,10vw,10rem)' }}>
            <FadeIn>
              <SectionLabel>Referral-only capability</SectionLabel>
              <h1 className="text-white leading-tight mt-3 mb-7 max-w-4xl"
                style={{ fontSize: 'clamp(2rem,5vw,4.75rem)' }}>
                Commercial purchase advisory,<br />considered case by case.
              </h1>
              <p className="text-white/80 font-light leading-relaxed max-w-2xl"
                style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', lineHeight: 1.85 }}>
                This capability is not part of the current public service offer. Referred commercial property
                purchase briefs may be considered after a conflict, capability and scope review.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="bg-warm-grey" style={SEC}>
          <div className={WRAP} style={PAD}>
            <FadeIn>
              <SectionLabel>Possible engagement scope</SectionLabel>
              <h2 className="text-near-black leading-tight mt-3 mb-12 max-w-3xl"
                style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                A controlled commercial workstream.
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SCOPE.map((item, index) => (
                <FadeIn key={item.title} delay={index * 60} direction="up">
                  <div className="bg-white border border-teal/20 rounded-xl h-full p-8">
                    <p className="text-action-teal font-semibold text-sm mb-3">{String(index + 1).padStart(2, '0')}</p>
                    <h3 className="text-near-black text-xl mb-3">{item.title}</h3>
                    <p className="text-readable-grey font-light leading-relaxed">{item.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white" style={SEC}>
          <div className={WRAP} style={PAD}>
            <FadeIn>
              <SectionLabel>Engagement controls</SectionLabel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-3">
                <h2 className="text-near-black leading-tight"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                  Clear scope before any work begins.
                </h2>
                <div className="space-y-5 text-readable-grey font-light leading-relaxed">
                  <p>A written proposal confirms scope, responsibilities, exclusions, fees and approval points.</p>
                  <p>Legal, finance, tax, valuation, building and environmental advice remains with appropriately qualified advisers.</p>
                  <p>Your Office Space is Newcastle-based, with the Hunter as its home territory. The viability and geography of each referred brief are assessed individually.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <BookingCTA />
      </main>
      <Footer />
    </>
  )
}
