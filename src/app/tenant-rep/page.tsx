import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'Tenant Representation | Your Office Space',
  description: 'Expert tenant representation for business owners in Newcastle and Sydney. We negotiate leases, fight for better terms, and only ever represent tenants — never landlords.',
  openGraph: {
    title: 'Tenant Representation | Your Office Space',
    description: 'We negotiate leases for tenants. Never landlords. Stronger terms, smarter deals, better outcomes.',
    url: 'https://yourofficespace.au/tenant-rep',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC    = { paddingTop: 'clamp(5rem,10vw,11rem)', paddingBottom: 'clamp(5rem,10vw,11rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export default function TenantRepPage() {
  return (
    <>
      <Nav />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className={`relative z-10 w-full ${WRAP}`} style={{ ...PAD, paddingTop: 'clamp(8rem,15vw,14rem)', paddingBottom: 'clamp(6rem,10vw,10rem)' }}>
          <FadeIn delay={0}>
            <SectionLabel>Tenant Representation</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mt-3 mb-8"
              style={{ fontSize: 'clamp(2rem,6vw,6rem)' }}>
              For business owners{' '}
              <span className="text-teal">who know better.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/65 font-light leading-relaxed max-w-2xl mb-10"
              style={{ fontSize: 'clamp(1rem,2vw,1.375rem)', lineHeight: 1.8 }}>
              We represent business owners in Newcastle and Sydney who want more than just space.
              Our goal is to secure a lease that builds your business — not just houses it.
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

      {/* ─── STATS BAR ────────────────────────────────────── */}
      <section className="bg-teal" style={SEC_SM}>
        <div className={WRAP} style={PAD}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: '8–15%', label: 'Average rent saving we negotiate' },
              { stat: '$18k+', label: 'Average saving per lease deal' },
              { stat: '100%', label: 'Tenant-only representation' },
              { stat: '24hr', label: 'Initial lease review turnaround' }
            ].map((item) => (
              <div key={item.label}>
                <p className="text-white font-black leading-none mb-2" style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)' }}>{item.stat}</p>
                <p className="text-white/80 font-light leading-snug" style={{ fontSize: '0.85rem' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE GUARANTEE ────────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="max-w-3xl">
            <FadeIn>
              <SectionLabel>The Guarantee</SectionLabel>
              <h2 className="text-white font-black leading-tight mt-3 mb-8"
                style={{ fontSize: 'clamp(1.75rem,4vw,3.5rem)' }}>
                We pay for ourselves.<br />
                <span className="text-teal">If we don&apos;t, you don&apos;t pay.</span>
              </h2>
              <p className="text-white/65 font-light leading-relaxed mb-10"
                style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', lineHeight: 1.85 }}>
                Our fee for tenant representation is $12,000 ex GST or 3 months rent equivalent — whichever is higher.
                The savings we negotiate — rent-free periods, fitout contributions, reduced make-good liability,
                below-market rent — routinely exceed this multiple times over.
              </p>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="border border-teal/40 p-8 sm:p-10 lg:p-12 bg-teal/5">
                <p className="text-white font-bold leading-relaxed mb-5" style={{ fontSize: 'clamp(1rem,2vw,1.35rem)' }}>
                  If the documented savings we achieve don&apos;t exceed our professional fee — we waive it.
                </p>
                <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                  No invoice. No fee. This is not a marketing promise. It is a commercial commitment.
                  We are on your side. If we don&apos;t deliver a return, we don&apos;t charge for it.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK ──────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(18rem,35vw,28rem)' }}>
        <Image
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80"
          alt="Professional lease negotiation"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.45)' }} />
        <div className={`absolute inset-0 flex items-center ${WRAP}`} style={PAD}>
          <p className="text-white font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.5rem,3vw,2.75rem)', maxWidth: '22ch' }}>
            Stronger terms. Smarter deals. Better outcomes.
          </p>
        </div>
      </section>

      {/* ─── LEASE NEGOTIATION ASSISTANCE ─────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn direction="left">
              <div>
                <SectionLabel>Lease Negotiation Assistance</SectionLabel>
                <h2 className="text-near-black font-bold leading-tight mt-3 mb-8"
                  style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
                  Your lease terms shape your cashflow. We make sure they work for you.
                </h2>
                <p className="text-charcoal font-light leading-relaxed mb-8"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  Instead of accepting what&apos;s offered, we fight for stronger terms and fairer conditions.
                  Every lease decision impacts your bottom line — so we focus on long-term value, not short-term convenience.
                  We identify risks early, protect your upside, and negotiate outcomes that work in your favour.
                </p>
                <p className="text-charcoal font-light leading-relaxed mb-10"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  We step in early to make sure the deal structure works for you — not the landlord.
                </p>
                <ul className="space-y-4">
                  {[
                    'Strategic advice before you make a move',
                    'Tactical input on rental rates, clauses, and incentives',
                    'Detailed review of leasing agreements to protect your position',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start pl-5 border-l-2 border-teal">
                      <span className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.8 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div className="lg:pt-20">
                <div className="border border-gray-200 p-8 sm:p-10 mb-6">
                  <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">The outcome</p>
                  <p className="text-near-black font-bold leading-snug mb-3" style={{ fontSize: 'clamp(1.1rem,2vw,1.4rem)' }}>
                    Every deal, clause, and dollar negotiated in your favour.
                  </p>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                    That is the standard we hold ourselves to on every engagement — regardless of deal size.
                  </p>
                </div>
                <div className="border border-gray-200 p-8 sm:p-10">
                  <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">Off-market access</p>
                  <p className="text-near-black font-bold leading-snug mb-3" style={{ fontSize: 'clamp(1.1rem,2vw,1.4rem)' }}>
                    Opportunities others don&apos;t see.
                  </p>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                    Through our deep market network, we source off-market leasing options that most businesses never access.
                    More flexibility, better locations, greater leverage — when it matters most.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── LEASE NEGOTIATION REPRESENTATION ────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>Lease Negotiation Representation</SectionLabel>
            <h2 className="text-white font-bold leading-tight mt-3 mb-8 max-w-3xl"
              style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
              Most business owners accept the lease they&apos;re given. Ours don&apos;t.
            </h2>
            <p className="text-white/60 font-light leading-relaxed max-w-2xl mb-14"
              style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
              We represent tenants across Sydney and Newcastle with one clear goal: to secure terms that serve your business — not the landlord&apos;s.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {[
              {
                title: 'Direct negotiation',
                body: 'We negotiate directly with landlords and agents. No middlemen, no softened messages — hard and fair representation on your behalf.'
              },
              {
                title: 'Rent, fitout support, and flexible clauses',
                body: 'We push for fair rent, fitout contributions, rent-free periods, and clause structures that give your business room to grow and adapt.'
              },
              {
                title: 'Clause-by-clause risk review',
                body: 'Every clause reviewed with an eye on risk, cost, and future impact. Nothing is accepted without scrutiny.'
              },
              {
                title: 'Legal team coordination',
                body: 'We work alongside your solicitors to lock in the right deal. Commercial strategy from us, legal precision from them.'
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 60} direction="up">
                <div className="border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors h-full" style={{ padding: 'clamp(1.5rem,2.5vw,2rem)' }}>
                  <h3 className="text-white font-bold text-base leading-snug mb-3">{item.title}</h3>
                  <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={150}>
            <div className="border-l-4 border-teal pl-8 py-6 bg-teal/5">
              <p className="text-white font-light leading-relaxed" style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
                This isn&apos;t about paperwork. It&apos;s about protection. Every dollar, every clause, every timeline negotiated with one goal — your best possible outcome.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FULL SERVICE ─────────────────────────────────── */}
      <section className="bg-warm-grey" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn direction="left">
              <div>
                <SectionLabel>Full-Service Tenant Representation</SectionLabel>
                <h2 className="text-near-black font-bold leading-tight mt-3 mb-8"
                  style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
                  Leasing the right space isn&apos;t just about price.
                </h2>
                <p className="text-charcoal font-light leading-relaxed mb-10"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  It&apos;s about fit, flexibility, and future-proofing. We work with business owners to manage the entire process — from brief to keys.
                  This isn&apos;t box-ticking. It&apos;s full-service representation that protects your business.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    'Set your requirements based on business goals — not just a headcount',
                    'Find and shortlist real options, not just what\'s listed online',
                    'Handle landlord negotiations, contract terms, and final execution',
                    'Coordinate fitout, furniture, and cleaning through to day one',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start pl-5 border-l-2 border-teal">
                      <span className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.8 }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
                  Book a Clarity Call
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div className="lg:pt-20 space-y-5">
                {[
                  { step: '01', title: 'Briefing', body: 'We understand your business. Space requirements, budget, timeline, non-negotiables. Nothing goes to market until the brief is exactly right.' },
                  { step: '02', title: 'Market Search', body: 'On-market, off-market, pre-release. We find options your broker missed — including properties that never reach the listing portals.' },
                  { step: '03', title: 'Negotiation', body: 'We handle every clause, every rate, every timeline. Legal review included. Your seat at the table is secured from day one.' },
                  { step: '04', title: 'Handover', body: 'Signed. Settled. We coordinate fitout, furniture, and cleaning. You focus on running your business, not managing contractors.' },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 70} direction="up">
                    <div className="bg-white p-7 flex gap-6 items-start">
                      <span className="text-teal font-black flex-shrink-0 leading-none" style={{ fontSize: 'clamp(1.5rem,2.5vw,2rem)', minWidth: '2.5rem' }}>{item.step}</span>
                      <div>
                        <h3 className="text-near-black font-bold text-base mb-2">{item.title}</h3>
                        <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>{item.body}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── WHAT'S AT STAKE ──────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>What&apos;s at stake</SectionLabel>
            <h2 className="text-white font-bold leading-tight mt-3 mb-8 max-w-3xl"
              style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
              The cost of a bad lease is never just rent.
            </h2>
            <p className="text-white/60 font-light leading-relaxed max-w-2xl mb-14"
              style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', lineHeight: 1.85 }}>
              Most tenants don&apos;t realise how much they&apos;ve overpaid until the lease is up. By then, the leverage is gone.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { risk: 'Above-market rent', detail: 'Most landlords open at 10–20% above fair market rate. Without comparable data, most tenants sign without question.' },
              { risk: 'Uncapped make-good', detail: 'Make-good clauses can cost $200–$400/sqm at lease end. Most standard leases have no cap and no clarity on what that means.' },
              { risk: 'Missed incentives', detail: 'Fit-out contributions of $50–$150/sqm are standard in this market. Most tenants don\'t ask. Landlords don\'t offer what isn\'t asked.' },
              { risk: 'Bad option structures', detail: 'A poorly drafted option clause can lock you into market rent — removing all leverage at renewal time.' },
              { risk: 'Relocation risk', detail: 'Without a proper prohibition on landlord relocation rights, you can be legally moved. We\'ve seen it happen to established businesses.' },
              { risk: 'Outgoings exposure', detail: 'Gross vs. net leases are not the same. Unexpected outgoings charges have blindsided clients by $30–$60k over a five-year term.' }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 60} direction="up">
                <div className="border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors h-full" style={{ padding: 'clamp(1.5rem,2.5vw,2rem)' }}>
                  <h3 className="text-white font-bold text-base leading-snug mb-3">{item.risk}</h3>
                  <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>{item.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY IT MATTERS ───────────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn direction="left">
              <div>
                <SectionLabel>No conflict of interest</SectionLabel>
                <h2 className="text-near-black font-bold leading-tight mt-3 mb-8"
                  style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
                  We only ever work for you.
                </h2>
                <p className="text-charcoal font-light leading-relaxed mb-6"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  Most commercial advisors work both sides of the table — representing tenants in one deal and landlords in the next.
                  It&apos;s impossible to be fully in your corner when the same person represents the party across from you.
                  The incentives are split. The leverage is quietly negotiated away.
                </p>
                <div className="border-l-4 border-teal pl-7 py-5 bg-teal/5 mb-8">
                  <p className="text-near-black font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                    We will never represent a landlord. Every word of every lease is read through one lens:
                    does this protect the tenant? Every negotiation has one outcome: the best deal for the business signing the lease.
                  </p>
                </div>
                <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
                  Book a Clarity Call
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div className="lg:pt-16">
                <h3 className="text-near-black font-bold text-xl mb-8">What you get from this.</h3>
                <ul className="space-y-5">
                  {[
                    { title: 'Harder negotiation', body: 'Rent, fit-out contributions, lease length — pushed harder than a split-incentive advisor ever will.' },
                    { title: 'Protective clauses', body: 'The clauses that limit your liability, cap your make-good, and preserve your flexibility at renewal.' },
                    { title: 'Real market intelligence', body: 'We know which landlords negotiate in good faith and which ones don\'t. That knowledge is leverage.' },
                    { title: 'Someone watching the fine print', body: 'A second set of eyes whose job is to stop you signing a deal you\'ll regret in year three.' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-5 items-start pb-5 border-b border-gray-100 last:border-0">
                      <span className="text-teal font-black flex-shrink-0 leading-none mt-1" style={{ fontSize: '1.1rem' }}>→</span>
                      <div>
                        <p className="text-near-black font-bold text-sm mb-1">{item.title}</p>
                        <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>{item.body}</p>
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
                  Already have a lease? Get a free risk review.
                </h3>
                <p className="text-white/60 font-light leading-relaxed"
                  style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                  Upload your lease and we&apos;ll run it through our 12-category risk framework. Rent, make good, relocation,
                  options — every clause rated Red / Amber / Green. Free summary within 24 hours.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button href="/lease-review" variant="primary" size="lg">
                  Start Free Review →
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
              <h2 className="text-white font-bold leading-tight mb-5 w-full"
                style={{ fontSize: 'clamp(1.7rem,4.5vw,3.75rem)' }}>
                Let&apos;s talk about your next lease.
              </h2>
              <p className="text-white/80 font-light leading-relaxed mb-10 w-full"
                style={{ fontSize: 'clamp(1rem,1.8vw,1.2rem)', lineHeight: 1.8 }}>
                20 minutes. No pitch. Just a straight conversation about your space, your situation, and what you&apos;re trying to achieve.
              </p>
              <Button href={HUBSPOT.bookingUrl} variant="dark" external size="lg">
                Book a Clarity Call
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  )
}
