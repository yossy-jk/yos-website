import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import CapabilityDownload from '@/components/CapabilityDownload'
import TenantProcess from '@/components/TenantProcess'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'Tenant Representation NSW | Your Office Space',
  description: 'Newcastle-based tenant representation for commercial lease decisions across Australia. Clear advice, option assessment and negotiation from the tenant side.',
  twitter: { card: 'summary_large_image', title: 'Tenant Representation | Your Office Space', description: 'Tenant-side commercial lease advice, option assessment and negotiation support.' },
  alternates: { canonical: 'https://www.yourofficespace.au/tenant-rep' },
  openGraph: {
    title: 'Tenant Representation | Your Office Space',
    description: 'Tenant-side commercial lease advice, option assessment and negotiation support.',
    url: 'https://www.yourofficespace.au/tenant-rep',
    images: [{ url: '/og/og-tenant-rep.png', width: 1200, height: 630, alt: 'Commercial Tenant Representation Newcastle | Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const SEC    = { paddingTop: 'clamp(4rem,8vw,10rem)', paddingBottom: 'clamp(4rem,8vw,10rem)' }
const SEC_SM = { paddingTop: 'clamp(2.5rem,5vw,4rem)',   paddingBottom: 'clamp(2.5rem,5vw,4rem)' }
const WRAP   = 'max-w-screen-xl mx-auto'
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

const COMMERCIAL_AGENCIES = [
  { name: 'Colliers', src: '/agency-logos/colliers.png', width: 300, height: 300 },
  { name: 'Knight Frank', src: '/agency-logos/knight-frank.jpeg', width: 516, height: 387 },
  { name: 'CBRE', src: '/agency-logos/cbre.jpeg', width: 616, height: 324 },
  { name: 'Raine & Horne Commercial', src: '/agency-logos/raine-and-horne-commercial.png', width: 1400, height: 355 },
  { name: 'Commercial Collective', src: '/agency-logos/commercial-collective.png', width: 597, height: 250 },
  { name: 'RWC', src: '/agency-logos/rwc.jpeg', width: 447, height: 447 },
  { name: 'LJ Hooker Commercial', src: '/agency-logos/lj-hooker-commercial.jpeg', width: 300, height: 145 },
  { name: 'Movable', src: '/agency-logos/movable.webp', width: 1080, height: 1080 },
  { name: 'Elders Commercial', src: '/agency-logos/elders-commercial.jpeg', width: 446, height: 448 },
]

export default function TenantRepPage() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        {
                "@context": "https://schema.org",
                "@graph": [
                        {
                                "@type": "Organization",
                                "@id": "https://www.yourofficespace.au/#organization",
                                "name": "Your Office Space",
                                "url": "https://www.yourofficespace.au",
                                "logo": "https://www.yourofficespace.au/favicon-32x32.png",
                                "telephone": "0434 655 511",
                                "email": "jk@yourofficespace.au",
                                "address": {
                                        "@type": "PostalAddress",
                                        "streetAddress": "16A Chelmsford St",
                                        "addressLocality": "Maryville",
                                        "addressRegion": "NSW",
                                        "postalCode": "2293",
                                        "addressCountry": "AU"
                                },
                                "areaServed": [
                                        "NSW",
                                        "Australia"
                                ],
                                "sameAs": [
                                        "https://www.linkedin.com/company/your-office-space"
                                ]
                        },
                        {
                                "@type": "Service",
                                "@id": "https://www.yourofficespace.au/tenant-rep",
                                "name": "Commercial Tenant Representation",
                                "provider": {
                                        "@id": "https://www.yourofficespace.au/#organization"
                                },
                                "description": "Independent commercial tenant representation across Australia. We negotiate leases, rent-free periods, incentives and make-good terms \u2014 exclusively on behalf of tenants.",
                                "areaServed": [
                                        "New South Wales",
                                        "Australia"
                                ],
                                "serviceType": "Commercial Tenant Representation"
                        }
                ]
        }
      ) }} />




      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black overflow-hidden" style={SEC}>
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
              The landlord has a professional.<br />
              <span className="text-teal">Now you do too.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/80 font-light leading-relaxed max-w-2xl mb-6"
              style={{ fontSize: 'clamp(1rem,2vw,1.375rem)', lineHeight: 1.8 }}>
              Every lease negotiation has two sides. The landlord&apos;s agent is an expert at protecting their client.
              We exist to make sure you have the same. Independent representation across Australia,               negotiating rent, terms, incentives, and every clause that matters.
            </p>
            <p className="text-white/30 font-light mb-10" style={{ fontSize: '0.8rem' }}>
              NSW Real Estate Licence 20565455
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
              Book a Clarity Call
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ─── OUR COMMITMENT ───────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="max-w-3xl">
            <FadeIn>
              <SectionLabel>Our commitment</SectionLabel>
              <h2 className="text-white font-black leading-tight mt-3 mb-8"
                style={{ fontSize: 'clamp(1.75rem,4vw,3.5rem)' }}>
                We work for you.<br />
                <span className="text-teal">Not the landlord.</span>
              </h2>
              <p className="text-white/80 font-light leading-relaxed mb-8"
                style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', lineHeight: 1.85 }}>
                Every commercial lease has two sides. The landlord has representation. We exist to make sure you do too,                 with advice focused on your brief, risks and commercial priorities. Every negotiation, clause and
                recommendation is considered from the tenant side.
              </p>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="border border-teal/40 p-8 sm:p-10 lg:p-12 bg-teal/5">
                <p className="text-white font-bold leading-relaxed mb-5" style={{ fontSize: 'clamp(1rem,2vw,1.35rem)' }}>
                  Your brief sets the decision standard.
                </p>
                <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                  We do not represent the landlord in the transaction. Scope, fees, evidence and decision responsibilities
                  are made clear before an engagement begins.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── SCOPE AND FEES ──────────────────────────────── */}
      <section className="bg-wash" style={SEC_SM}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
              <div>
                <p className="text-action-teal font-bold text-xs tracking-[0.25em] uppercase mb-5">Scope and fees</p>
                <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3"
                  style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
                  Know the work and the fee before you engage us.
                </h2>
              </div>
              <div className="text-charcoal font-light leading-relaxed space-y-5" style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                <p>We start by understanding the property decision, timing and level of support you need.</p>
                <p>You then receive a written scope that explains what YOS will do, what information we need from you, the fee and the decision points.</p>
                <p className="text-near-black font-semibold">You decide whether to proceed after the scope and fee are clear.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── COMMERCIAL AGENCY NETWORK ───────────────────── */}
      <section className="bg-white" style={SEC_SM}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="max-w-3xl mb-10">
              <SectionLabel>Property search network</SectionLabel>
              <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-5"
                style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
                We engage the commercial agency market for your brief.
              </h2>
              <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                We work with commercial agents to identify and assess available properties while remaining accountable to you as the tenant. The agencies approached depend on your location, timing and requirements.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {COMMERCIAL_AGENCIES.map((agency, index) => (
              <FadeIn key={agency.name} delay={index * 40}>
                <div
                  className="relative flex items-center justify-center rounded-xl border border-black/10 bg-white"
                  style={{ height: '8.5rem', padding: '1.25rem' }}
                  title={agency.name}
                >
                  <Image
                    src={agency.src}
                    alt={`${agency.name} logo`}
                    width={agency.width}
                    height={agency.height}
                    className="max-h-full w-auto object-contain"
                    sizes="(max-width: 639px) 42vw, (max-width: 1023px) 28vw, 18vw"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-readable-grey font-light mt-7" style={{ fontSize: '0.78rem', lineHeight: 1.7 }}>
            Agency logos identify organisations in the commercial property market that YOS works with during property searches. They do not imply ownership, exclusivity or endorsement. All trademarks remain the property of their respective owners.
          </p>
        </div>
      </section>

      {/* ─── CLIENT REVIEWS ───────────────────────────────── */}
      <section className="bg-warm-grey" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>What clients say</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-12"
              style={{ fontSize: 'clamp(1.5rem,3.5vw,3rem)' }}>
              Real feedback from tenant-side clients.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: 'Joe was incredibly helpful through our first tenant rep experience. He made the property search and lease process much easier, explained our rights and options clearly, spotted things we would have missed, and helped with fitout, furniture and cleaners too. Worth it.',
                name: 'Beth Gwalter',
              },
              {
                quote: 'Highly recommend Your Office Space. Joe was professional, reliable and fantastic to communicate with, and the service was flawless from start to finish. Joe was beyond amazing.',
                name: 'Olivia Crawford',
              },
            ].map((t) => (
              <FadeIn key={t.name}>
                <div className="bg-white border border-gray-100 p-8 sm:p-10 h-full">
                  <p className="text-near-black font-light leading-relaxed mb-10" style={{ fontSize: '1.02rem', lineHeight: 1.9 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: '1px solid #efefef', paddingTop: '1.25rem' }}>
                    <p className="text-near-black font-bold" style={{ fontSize: '0.9rem' }}>{t.name}</p>
                    <p className="text-teal font-semibold uppercase tracking-widest" style={{ fontSize: '0.62rem' }}>Tenant representation</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK 1 ──────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(26rem,42vw,38rem)' }}>
        <Image
          priority
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80"
          alt="Business owner reviewing commercial lease with advisor"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,59,56,0.55)' }} />
        <div className={`absolute inset-0 flex items-end ${WRAP}`} style={{ ...PAD, paddingBottom: 'clamp(2.5rem,6vw,5rem)' }}>
          <FadeIn>
            <p className="text-white font-light italic" style={{ fontSize: 'clamp(1.1rem,2.2vw,1.5rem)', maxWidth: '44rem', lineHeight: 1.75, borderLeft: '3px solid #01A7A3', paddingLeft: '1.5rem' }}>
              &ldquo;The useful time to test lease assumptions is before the business commits.&rdquo;
              <br /><span className="text-teal font-semibold not-italic" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>, Joe Kelley, Your Office Space</span>
            </p>
          </FadeIn>
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
                <p className="text-charcoal font-light leading-relaxed mb-12"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  Instead of accepting what&apos;s offered, we fight for stronger terms and fairer conditions.
                  Every lease decision impacts your bottom line, so we focus on long-term value, not short-term convenience.
                  We identify risks early, protect your upside, and negotiate outcomes that work in your favour.
                </p>
                <p className="text-charcoal font-light leading-relaxed mb-14"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  We step in early to make sure the deal structure works for you, not the landlord.
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
                    Commercial terms and lease risks made clear before commitment.
                  </p>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                    Recommendations are tied back to the agreed brief, comparable evidence and the business outcome.
                  </p>
                </div>
                <div className="border border-gray-200 p-8 sm:p-10">
                  <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">Market search</p>
                  <p className="text-near-black font-bold leading-snug mb-3" style={{ fontSize: 'clamp(1.1rem,2vw,1.4rem)' }}>
                    A broader view of suitable options.
                  </p>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>
                    We assess advertised, pre-release and relationship-sourced leasing options against the same brief,
                    then show the trade-offs clearly.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK 2 ──────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(26rem,42vw,38rem)' }}>
        <Image
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1920&q=80"
          alt="Team negotiating commercial lease terms"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,59,56,0.6)' }} />
        <div className={`absolute inset-0 flex items-center ${WRAP}`} style={PAD}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.75rem,3.5vw,3.25rem)', maxWidth: '20ch' }}>
              We negotiate harder<br />because we only answer<br /><span style={{ color: '#01A7A3' }}>to you.</span>
            </p>
          </FadeIn>
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
              We represent tenants across Australia, with a strong NSW focus, with one clear goal: to secure terms that serve your business, not the landlord&apos;s.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
            {[
              {
                title: 'Direct negotiation',
                body: 'We negotiate directly with landlords and agents. No middlemen, no softened messages, hard and fair representation on your behalf.'
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
                This isn&apos;t about paperwork. It&apos;s about protection. Every dollar, every clause, every timeline negotiated with one goal, your best possible outcome.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── IMAGE BREAK 3 ──────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(26rem,42vw,38rem)' }}>
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80"
          alt="Modern commercial office space Newcastle"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,59,56,0.5)' }} />
        <div className={`absolute inset-0 flex items-center justify-end ${WRAP}`} style={PAD}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight text-right" style={{ fontSize: 'clamp(1.75rem,3.5vw,3.25rem)', maxWidth: '22ch' }}>
              The right space changes<br />how your business feels<br /><span style={{ color: '#01A7A3' }}>every single day.</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── FULL SERVICE, 6-STEP PROCESS ─────────────────── */}
      <TenantProcess dark={false} />
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
              Lease risk often sits outside the headline rent. It is easier to address before terms are agreed.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { risk: 'Rent without context', detail: 'Headline rent needs to be tested against comparable options, outgoings, incentives and the full lease term.' },
              { risk: 'Unclear make-good', detail: 'Make-good obligations can create a material end-of-lease cost when the scope, evidence and handover standard are not clear.' },
              { risk: 'Unexamined incentives', detail: 'Incentives change the effective cost of a lease and should be assessed alongside the base rent and fit out requirements.' },
              { risk: 'Bad option structures', detail: 'A poorly drafted option clause can lock you into market rent, removing all leverage at renewal time.' },
              { risk: 'Relocation risk', detail: 'Relocation rights can affect continuity, fit out value and future operating plans if they are not understood before signing.' },
              { risk: 'Outgoings exposure', detail: 'Gross and net leases allocate operating costs differently. The comparison needs to include every recurring occupancy cost.' }
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
                  A landlord&apos;s appointed agent acts for the property owner. Tenant representation gives the occupying
                  business its own advice, assessment and negotiation support.
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
                    { title: 'Harder negotiation', body: 'Rent, fit-out contributions, lease length, pushed harder than a split-incentive advisor ever will.' },
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
                  options, every clause rated Red / Amber / Green. Free summary returned shortly.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button href="/lease-review" variant="primary" size="lg">
                  Start Free Review
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
              <SectionLabel>Get started</SectionLabel>
              <h2 className="text-white font-black uppercase leading-tight tracking-tight w-full"
                style={{ fontSize: 'clamp(1.7rem,4.5vw,3.75rem)', marginTop: '0.75rem', marginBottom: '1.25rem' }}>
                Let&apos;s talk about your next lease.
              </h2>
              <p className="text-white/60 font-light leading-relaxed mb-10 w-full"
                style={{ fontSize: 'clamp(1rem,1.8vw,1.2rem)', lineHeight: 1.8 }}>
                20 minutes. No pitch. Just a straight conversation about your space, your situation, and what you&apos;re trying to achieve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
                  Book a Clarity Call
                </Button>
                <CapabilityDownload
                  label="Download Our Credentials"
                  variant="outline"
                  className="min-h-[56px] px-8"
                />
              </div>
              <p className="text-white/20 font-light" style={{ fontSize: '0.78rem' }}>
                Not ready to talk? Download our capability statement first.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>


      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What does a tenant representative do?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A tenant representative advocates exclusively for businesses looking to lease commercial space. Unlike a landlord's agent, we work only for you, negotiating rent, lease terms, incentives, and every clause on your behalf. We have no relationship with the landlord and no conflict of interest.",
                },
              },
              {
                "@type": "Question",
                "name": "How does tenant representation work in practice?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We start with your brief, space requirements, location, timeline, non-negotiables. We then search on-market and off-market options, shortlist based on your criteria, and negotiate the lease directly with the landlord's agent. We work alongside your solicitors through to signing and handover. Every step is in your interest.",
                },
              },
              {
                "@type": "Question",
                "name": "Who pays for tenant representation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Fee arrangements depend on the engagement and transaction structure. We explain the scope, fee and any relevant payment arrangements before work begins.",
                },
              },
              {
                "@type": "Question",
                "name": "How is a tenant representative different from a commercial agent?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A commercial agent appointed by the landlord acts for the property owner. A tenant representative is engaged to advise the tenant, assess the options and negotiate from the occupying business's perspective.",
                },
              },
              {
                "@type": "Question",
                "name": "Can you help with an existing lease rather than a new one?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Our LeaseIntel review covers existing leases, we run your current agreement through a 12-category risk framework covering rent, make-good, relocation rights, option clauses, and outgoings. Each clause is rated Red / Amber / Green. If you are mid-lease or facing a renewal, we can identify leverage you didn't know you had.",
                },
              },
              {
                "@type": "Question",
                "name": "What types of commercial property do you cover?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Office, industrial, retail, and specialised use, including childcare centres, medical suites, and hospitality fitouts. Each sector has its own lease dynamics, and we tailor the representation accordingly. If it is a commercial lease in NSW, we can help.",
                },
              },
              {
                "@type": "Question",
                "name": "How much can a tenant representative save on a commercial lease?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "It depends on the deal. We consistently negotiate rent-free periods worth tens of thousands of dollars, caps on annual rent increases, make-good obligations reduced or eliminated, and fitout contributions from the landlord. The fee is usually covered by what we negotiate. Most clients see a net positive return on representation within the first year of their lease.",
                },
              },
            ],
          })
        }}
      />

      </main>

      <Footer />
    </>
  )
}
