import Link from 'next/link'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'

export const metadata = {
  title: 'Tenant Representation Newcastle | Your Office Space',
  description: 'Commercial lease negotiation for tenants only. No split loyalties, no backdoor deals — just hard negotiation to protect your business in Newcastle and the Hunter Valley.'
}

export default function TenantRepPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-[72px] bg-near-black overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-[5%] w-full pt-20 pb-24">
          <FadeIn delay={0}>
            <SectionLabel>Tenant Representation</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-8"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}>
              We negotiate leases for tenants.{' '}
              <span className="text-teal">Never landlords.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/65 font-light leading-relaxed max-w-2xl mb-12"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              Your interests first. No split loyalty. No backdoor deals. Every negotiation is structured to protect you and position your business for growth.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
                Book a Clarity Call
              </Button>
              <Button href="/lease-review" variant="outline" size="lg">
                Free Lease Review →
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* COST REALITY — new section */}
      <section className="bg-teal py-16 lg:py-20">
        <FadeIn>
          <div className="max-w-7xl mx-auto px-[5%]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { stat: '8–15%', label: 'Average rent saving we negotiate' },
                { stat: '$18k+', label: 'Average saving per lease deal' },
                { stat: '100%', label: 'Tenant-only representation' },
                { stat: '24hr', label: 'Initial lease review turnaround' }
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-white font-black text-4xl lg:text-5xl mb-2 leading-none">{item.stat}</p>
                  <p className="text-white/75 font-light text-sm leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <FadeIn>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight mb-20 max-w-2xl"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
              Four clear steps to your next lease.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Briefing',
                body: 'We understand your business. Space requirements, budget, timeline, non-negotiables. Nothing goes unsigned until you are completely clear on what it means.'
              },
              {
                step: '02',
                title: 'Market Search',
                body: 'We canvass the market — on-market, off-market, pre-release. Newcastle commercial inside out. We find options your broker missed.'
              },
              {
                step: '03',
                title: 'Negotiation',
                body: 'We handle every clause, every rate, every timeline. Legal review included. Your seat at the table is secured from day one.'
              },
              {
                step: '04',
                title: 'Handover',
                body: 'Signed. Settled. We coordinate the fitout, furniture, and cleaning. You focus on running your business, not managing contractors.'
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 80} direction="up">
                <div className="flex flex-col">
                  <p className="text-teal font-black text-5xl mb-4 leading-none">{item.step}</p>
                  <h3 className="text-near-black font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-charcoal font-light text-sm leading-relaxed flex-1">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S AT STAKE */}
      <section className="bg-near-black py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <FadeIn>
            <SectionLabel>What's at stake</SectionLabel>
            <h2 className="text-white font-bold leading-tight mb-6 max-w-3xl"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
              The cost of a bad lease is never just rent.
            </h2>
            <p className="text-white/60 font-light text-lg leading-relaxed max-w-2xl mb-16">
              Most tenants don&apos;t realise how much they&apos;ve overpaid until the lease is up. By then, the leverage is gone. Here&apos;s what goes wrong without proper representation:
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                risk: 'Above-market rent',
                detail: 'Most landlords open at 10–20% above fair market rate. Without comparable data, most tenants sign without question.'
              },
              {
                risk: 'Uncapped make-good',
                detail: 'Make-good clauses can cost $200–$400/sqm at lease end. Most standard leases have no cap and no clarity on what that means.'
              },
              {
                risk: 'Missed incentives',
                detail: 'Fit-out contributions of $50–$150/sqm are standard in this market. Most tenants don\'t ask. Landlords don\'t offer what isn\'t asked.'
              },
              {
                risk: 'Bad option structures',
                detail: 'A poorly drafted option clause can lock you into market rent — removing all leverage at renewal time.'
              },
              {
                risk: 'Relocation risk',
                detail: 'Without a proper prohibition on landlord relocation rights, you can be legally moved. We\'ve seen it happen to established businesses.'
              },
              {
                risk: 'Outgoings exposure',
                detail: 'Gross vs. net leases are not the same. Unexpected outgoings charges have blindsided clients by $30–$60k over a five-year term.'
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 60} direction="up">
                <div className="border border-white/10 rounded-sm p-7 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                  <div className="flex gap-3 items-start mb-3">
                    <div className="w-2 h-2 rounded-full bg-teal flex-shrink-0 mt-1.5" />
                    <h3 className="text-white font-bold text-lg leading-snug">{item.risk}</h3>
                  </div>
                  <p className="text-white/55 font-light text-sm leading-relaxed">{item.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-warm-grey py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <FadeIn>
            <SectionLabel>What&apos;s included</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight mb-20 max-w-2xl"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
              Everything you need to make the right call.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Lease Review',
                items: [
                  'Full clause-by-clause analysis',
                  'Risk flagging and explanation',
                  'Negotiation strategy',
                  'Legal review (included)'
                ]
              },
              {
                title: 'Market Comparison',
                items: [
                  'Rate benchmarking across Newcastle',
                  'Comparable properties',
                  'Market trends',
                  'Negotiating leverage data'
                ]
              },
              {
                title: 'Negotiation Support',
                items: [
                  'Direct landlord contact',
                  'Counter-offer strategy',
                  'Timeline management',
                  'Deal closure coordination'
                ]
              },
              {
                title: 'Fitout Coordination',
                items: [
                  'Furniture and design brief',
                  'Contractor quotes',
                  'Timeline management',
                  'Quality assurance'
                ]
              },
              {
                title: 'Cleaning Handover',
                items: [
                  'Cleaning provider setup',
                  'Initial deep clean',
                  'Ongoing maintenance plan',
                  'Team training'
                ]
              },
              {
                title: 'Ongoing Support',
                items: [
                  'Lease milestone reminders',
                  'Renewal negotiation prep',
                  'Dispute resolution',
                  'Direct line to Joe'
                ]
              }
            ].map((category, i) => (
              <FadeIn key={i} delay={i * 60} direction="up">
                <div className="bg-white rounded-sm p-8 shadow-sm h-full">
                  <h3 className="text-near-black font-bold text-lg mb-5 border-b-2 border-teal pb-4">
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.items.map((item, j) => (
                      <li key={j} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0 mt-1.5" />
                        <span className="text-charcoal font-light text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CONFLICT OF INTEREST MATTERS */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-4xl mx-auto px-[5%]">
          <FadeIn>
            <SectionLabel>Why it matters</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight mb-12"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
              The problem with standard practice.
            </h2>
          </FadeIn>

          <div className="space-y-8">
            <FadeIn delay={100}>
              <div>
                <h3 className="text-near-black font-bold text-2xl mb-4">Most brokers work both sides</h3>
                <p className="text-charcoal font-light text-lg leading-relaxed">
                  The majority of commercial property advisors make money from both tenants and landlords. It&apos;s impossible to be fully on your side when someone is also representing the person across the table from you. The incentives are split. The leverage is negotiated away.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="border-l-4 border-teal pl-8 py-4 bg-teal/5 rounded-r-lg">
                <p className="text-near-black font-light text-lg leading-relaxed">
                  We only represent tenants. We will never represent a landlord. That means every word of every lease is read through one lens: does this protect the tenant? Every negotiation has one outcome: the best deal for the business signing the lease.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div>
                <h3 className="text-near-black font-bold text-2xl mb-4">What you get from this</h3>
                <ul className="space-y-3">
                  {[
                    'Harder negotiation on rent, fit-out contributions, lease length',
                    'Protective clauses most tenants never get',
                    'Real market intelligence about which landlords negotiate in good faith',
                    'A second pair of eyes on the fine print',
                    'Someone in the room whose job it is to stop you from signing a bad deal'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0 mt-2" />
                      <span className="text-charcoal font-light text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* LEASEINTEL CALLOUT */}
      <section className="bg-warm-grey py-20 lg:py-24">
        <FadeIn>
          <div className="max-w-5xl mx-auto px-[5%]">
            <div className="bg-near-black rounded-sm p-10 lg:p-16 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
              <div className="flex-1">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">LeaseIntel™</p>
                <h3 className="text-white font-bold text-2xl lg:text-3xl leading-tight mb-4">
                  Already have a lease? Get a free risk review.
                </h3>
                <p className="text-white/60 font-light text-base leading-relaxed">
                  Upload your lease and we&apos;ll run it through our 12-category risk framework. Rent, make good, relocation, options — every clause rated Red / Amber / Green. Free summary within 24 hours.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button href="/lease-review" variant="primary" size="lg">
                  Start Free Review →
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA SECTION */}
      <section className="bg-teal py-28 lg:py-32 text-center">
        <FadeIn>
          <div className="max-w-2xl mx-auto px-[5%]">
            <h2 className="text-white font-bold leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
              Let&apos;s talk about your next lease.
            </h2>
            <p className="text-white/80 font-light text-xl leading-relaxed mb-12">
              20 minutes. No pitch. Just a conversation about your space and what you&apos;re trying to achieve.
            </p>
            <Button href={HUBSPOT.bookingUrl} variant="dark" external size="lg">
              Book a Clarity Call
            </Button>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  )
}
