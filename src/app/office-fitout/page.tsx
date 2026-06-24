import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'
import BookingCTA from '@/components/BookingCTA'
import HubSpotForm from '@/components/HubSpotForm'

const SEC    = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const SEC_SM = { paddingTop: 'clamp(3rem,6vw,5rem)',   paddingBottom: 'clamp(3rem,6vw,5rem)' }
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

export const metadata = {
  title: 'Commercial Office Fitout Newcastle | Brief to Practical Completion | YOS',
  description: 'Newcastle commercial fitout project management. One team from brief to practical completion — design, construction, joinery and services. Fixed price, no surprises.',
  alternates: { canonical: 'https://www.yourofficespace.au/office-fitout' },
  twitter: { card: 'summary_large_image', title: 'Commercial Office Fitout Newcastle | Your Office Space', description: 'Office fitout project management from brief to practical completion. One team. Fixed price. Newcastle and NSW.' },
  openGraph: {
    title: 'Commercial Office Fitout Newcastle | Your Office Space',
    description: 'Commercial fitout project management from brief to practical completion. One team. Transparent process. Newcastle and NSW.',
    url: 'https://www.yourofficespace.au/office-fitout',
    images: [{ url: '/og/og-office-fitout.png', width: 1200, height: 630, alt: 'Commercial Office Fitout Newcastle | Brief to Practical Completion | Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function OfficeFitoutPage() {
  return (
    <>
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
            "description": "Commercial office fitout project management. Brief to practical completion across Newcastle and NSW.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Newcastle",
              "addressRegion": "NSW",
              "postalCode": "2300",
              "addressCountry": "AU"
            },
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Sydney" },
              { "@type": "State", "name": "New South Wales" },
              { "@type": "Country", "name": "Australia" }
            ]
          },
          {
            "@type": "Service",
            "@id": "https://www.yourofficespace.au/office-fitout#service",
            "name": "Commercial Office Fitout Project Management — Newcastle",
            "provider": { "@id": "https://www.yourofficespace.au/#organization" },
            "description": "Commercial office fitout project management. One team manages the full process from initial brief through to practical completion — design, contractor procurement, authority approvals, construction, joinery, services, and furniture installation.",
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Maitland" },
              { "@type": "City", "name": "Lake Macquarie" },
              { "@type": "State", "name": "New South Wales" },
              { "@type": "Country", "name": "Australia" }
            ],
            "serviceType": "Commercial Office Fitout Project Management",
            "url": "https://www.yourofficespace.au/office-fitout"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What does commercial fitout project management cover?", "acceptedAnswer": { "@type": "Answer", "text": "A commercial fitout project manager coordinates everything from the initial brief through to practical completion — design intent, contractor procurement, authority approvals, construction management, joinery, electrical, AV, IT, and furniture installation. You deal with one team. We manage the rest." } },
              { "@type": "Question", "name": "How much does a commercial fitout cost in Newcastle?", "acceptedAnswer": { "@type": "Answer", "text": "Commercial fitout costs in Newcastle range from $600–$1,200/sqm for a basic fitout, $1,200–$2,000/sqm for mid-range, and $2,000+/sqm for premium. A 300 sqm office fitout typically ranges from $360,000 to $600,000 depending on scope. Use our free fitout estimator for a budget based on your brief." } },
              { "@type": "Question", "name": "How long does a commercial fitout take in Newcastle?", "acceptedAnswer": { "@type": "Answer", "text": "A basic furniture-only fitout delivers in 2–4 weeks. A full commercial fitout with construction, joinery, electrical and AV typically takes 8–16 weeks from brief to practical completion. We map the programme at the start so you know exactly when your team moves in." } },
              { "@type": "Question", "name": "Do I need authority approvals for a commercial fitout in NSW?", "acceptedAnswer": { "@type": "Answer", "text": "Depending on the scope and the building, you may need change-of-use consent, BCA compliance documentation, fire engineering, or heritage approvals. We manage the approvals process as part of the project — identifying what is needed, preparing documentation, and lodging on your behalf." } },
              { "@type": "Question", "name": "What is BCA compliance and do I need it for my fitout?", "acceptedAnswer": { "@type": "Answer", "text": "The Building Code of Australia sets minimum standards for occupant safety, accessibility, and fire safety in all commercial buildings. A tenant fitout must comply with BCA requirements regardless of what the landlord's existing approval covers. We manage BCA compliance documentation as part of the approvals process." } },
              { "@type": "Question", "name": "What is the difference between a fitout manager and a builder?", "acceptedAnswer": { "@type": "Answer", "text": "A builder executes the construction works. A fitout manager manages the entire process — including which builder to use, how they are appointed, what they price, how the programme runs, and how all the other trades and suppliers fit around them. You appoint us. We appoint and manage everyone else." } },
              { "@type": "Question", "name": "How do you handle heritage buildings in Newcastle?", "acceptedAnswer": { "@type": "Answer", "text": "Newcastle has a significant number of heritage-listed commercial buildings in areas like the CBD, Honeysuckle, and Newcastle East. Heritage constraints affect what can be done externally and to the fabric of the building. We manage heritage consent applications through Newcastle City Council as part of the approvals process." } },
              { "@type": "Question", "name": "What happens if my fitout programme runs over?", "acceptedAnswer": { "@type": "Answer", "text": "We track every milestone against the programme. If a trade falls behind, we identify it early and manage the recovery — sequencing remaining work, escalating to contractors, and finding solutions. Programme overruns are almost always managed before they become crises. You are informed before it becomes your problem." } }
            ]
          },
          {
            "@type": "HowTo",
            "name": "How to plan a commercial office fitout in Newcastle",
            "description": "A step-by-step guide to planning a commercial office fitout in Newcastle — from initial brief to practical completion.",
            "step": [
              { "@type": "HowToStep", "name": "Define your brief", "text": "Identify what you need — workstation count, meeting rooms, breakout zones, and any specific requirements. A rough floor plan or headcount is enough to get started." },
              { "@type": "HowToStep", "name": "Set a realistic budget", "text": "Budget guides: basic fitout $600-$1,200/sqm, mid-range $1,200-$2,000/sqm, premium $2,000+/sqm. Use our fitout estimator or call us for a budget based on your brief." },
              { "@type": "HowToStep", "name": "Confirm your lease and timeline", "text": "Know your lease commencement date before you start. Every week of delay between handover and practical completion costs your business money. A tight timeline affects contractor selection and scope." },
              { "@type": "HowToStep", "name": "Choose your fitout manager", "text": "Appoint a licensed commercial fitout manager who works in Newcastle and knows the local contractor market, council requirements, and heritage constraints where applicable." },
              { "@type": "HowToStep", "name": "Approve the design and price", "text": "Review the 3D layout, finishes schedule, and itemised price before committing. What you approve in writing is what gets built — no surprises on installation day." },
              { "@type": "HowToStep", "name": "Hand over and move in", "text": "We manage the build, coordinate all trades, handle practical completion, and manage the defects period. You receive a finished workspace on the agreed date." }
            ]
          }
        ]
      }) }} />

      <Nav />

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black" style={SEC}>
        <Image
          src="/images/furniture/space-cogc-wide.jpg"
          alt="Commercial office fitout Newcastle — YOS managed from brief to practical completion"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/65" />
        <div className="relative z-10 max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn delay={0}>
            <SectionLabel>Commercial Office Fitout — Project Management</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-6"
              style={{ fontSize: 'clamp(2rem,6vw,6rem)' }}>
              Office Fitout Newcastle —
              <br /><span className="text-teal">brief to practical completion.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/80 font-light leading-relaxed max-w-2xl mb-8"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              We manage the full commercial fitout process — design, construction, joinery, services coordination, and furniture installation. One team, fixed price, from the first conversation to the day your workspace is ready.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-row flex-wrap gap-4 items-center">
              <Button href="/resources/furniture-quote" variant="primary" size="lg">
                Start Your Fitout Brief
              </Button>
              <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 text-white font-bold border border-white/20 rounded-none no-underline hover:border-white/60 transition-colors"
                style={{ fontSize: 'clamp(0.85rem,1.5vw,1rem)', letterSpacing: '0.02em', padding: '1.1rem 3rem' }}>
                <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {CONTACT.phone}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────── */}
      <section className="bg-warm-grey border-b border-gray-200" style={SEC_SM}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
              {[
                { stat: '200+', label: 'Fitouts managed from brief to completion' },
                { stat: '8–16 wks', label: 'Full commercial fitout programme' },
                { stat: 'Fixed price', label: 'You approve before we start' },
                { stat: '1 contact', label: 'From brief to practical completion' }
              ].map((item) => (
                <div key={item.label} className="py-5 px-4 sm:py-8 sm:px-6 text-center">
                  <p className="text-near-black font-black text-2xl lg:text-3xl mb-2 leading-tight">{item.stat}</p>
                  <p className="text-mid-grey font-light text-sm leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── WHAT FITOUT MANAGEMENT IS ────────────── */}
      <section className="bg-white" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <FadeIn direction="left">
              <div>
                <SectionLabel>How we work</SectionLabel>
                <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-6"
                  style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
                  We manage the fitout. You manage your business.
                </h2>
                <p className="text-charcoal font-light leading-relaxed mb-6"
                  style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.85 }}>
                  A commercial fitout is not a furniture purchase. It is a sequence of design decisions, authority approvals, contractor appointments, and construction stages — running in parallel, dependent on each other, and vulnerable to delay at every step.
                </p>
                <p className="text-charcoal font-light leading-relaxed mb-6"
                  style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.85 }}>
                  We manage that sequence. You deal with one team from the first phone call to the day your workspace is handed over. We brief the contractors, manage the programme, handle the variations, and deliver the finished result.
                </p>
                <p className="text-charcoal font-light leading-relaxed"
                  style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.85 }}>
                  You are not left holding the relationship with a builder who is running three other jobs. We hold that — and every other thread — until the workspace is done.
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="bg-warm-grey rounded-xl p-8 sm:p-10">
                <p className="text-near-black font-bold text-base mb-6">What you are not doing when you work with us:</p>
                <ul className="space-y-4">
                  {[
                    "Coordinating three to six trade contractors simultaneously",
                    "Chasing a builder who has gone quiet",
                    "Managing authority approval submissions yourself",
                    "Negotiating variation costs after the fact",
                    "Absorbing programme delays because no one was tracking them",
                    "Dealing with the gaps between trades on site"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-charcoal font-light text-sm leading-relaxed">
                      <svg style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.15rem' }} className="text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-near-black font-bold text-base mb-3">What you are doing:</p>
                  <ul className="space-y-3">
                    {[
                      "Briefing us once",
                      "Approving key decisions at defined milestones",
                      "Receiving a finished workspace on the agreed date"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-charcoal font-light text-sm leading-relaxed">
                        <svg style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.15rem' }} className="text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── THE FITOUT PROCESS ──────────────────────── */}
      <section className="bg-[#0D1117]" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>How a fitout works</SectionLabel>
            <h2 className="text-white font-bold leading-tight tracking-tight mt-3 mb-4 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Nine steps from brief to practical completion.
            </h2>
            <p className="text-white/50 font-light leading-relaxed max-w-2xl mb-14"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.85 }}>
              Every fitout is different. The sequence is not. We run through the same nine steps on every project — in the same order, with the same discipline — because that is what keeps a programme on track.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Brief & Budget', body: 'Space planning, design intent, finishes, fixtures and equipment (FF&E) schedule. We define what is being built and what it costs before anyone commits.' },
              { step: '02', title: 'Authority Approvals', body: 'Change of use, BCA compliance, fire engineering, heritage consent where applicable. We identify what is needed, prepare the documentation, and lodge on your behalf.' },
              { step: '03', title: 'Contractor Procurement', body: 'We go to market, obtain fixed-price quotes from licensed contractors, and manage the selection process. You approve before any commitment is made.' },
              { step: '04', title: 'Programme Management', body: 'The full construction programme — sequenced, tracked, and actively managed. We hold contractors accountable to milestones and manage variations before they become cost overruns.' },
              { step: '05', title: 'Services Coordination', body: 'Electrical, data, AV, hydraulic, mechanical. We coordinate all services trades to happen in the right sequence without clashes on site.' },
              { step: '06', title: 'Joinery & Shopfitting', body: 'Custom joinery design, shopfitting, and specialist finishes. Managed as part of the fitout scope — not as a separate contractor relationship you have to run.' },
              { step: '07', title: 'Furniture Installation', body: 'Workstations, seating, storage, and all other furniture items installed as part of the final fitout stage. Coordinated with the builder to avoid damage and double-handling.' },
              { step: '08', title: 'Practical Completion', body: 'Final inspection, defects list, and handover documentation. You receive a completed workspace — not a list of outstanding issues on day one.' },
              { step: '09', title: 'Post-Handover', body: 'Defects period management. We manage the contractor through the warranty period so you do not have to.' }
            ].map((item) => (
              <FadeIn key={item.step} direction="up">
                <div className="bg-[#0A0A0A] rounded-xl p-7 flex flex-col border border-white/5">
                  <p className="text-teal font-black text-3xl mb-4 leading-none">{item.step}</p>
                  <h3 className="text-white font-bold text-base mb-3">{item.title}</h3>
                  <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK ─────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(28rem,42vw,40rem)' }}>
        <Image src="/images/furniture/space-bendigo-wide.jpg" alt="Bendigo GovHub — YOS managed fitout from brief to practical completion" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.5)' }} />
        <div className="absolute inset-0 flex items-center max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-white font-black leading-tight max-w-2xl" style={{ fontSize: 'clamp(1.4rem,3vw,2.75rem)' }}>
              The difference between a fitout that finishes on time and one that blows out by six weeks is whether someone is actually managing the sequence.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── TIMELINE GUIDE ───────────────────────────── */}
      <section className="bg-warm-grey" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Programme</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-6 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              How long does a commercial fitout take?
            </h2>
            <p className="text-charcoal font-light leading-relaxed max-w-2xl mb-12"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.85 }}>
              Every project programme depends on scope and building access. We map the full timeline before you commit — so you know exactly when your team moves in.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tier: 'Furniture-Only Fitout', duration: '2–4 weeks', desc: 'No construction works. Furniture supply and installation into an existing space in clean condition.', includes: ['Space planning and 3D layout', 'Furniture specification and procurement', 'Delivery and installation', 'Minor adjustments on-site'] },
              { tier: 'Standard Commercial Fitout', duration: '8–12 weeks', desc: 'Partitioning, flooring, electrical, data, joinery, and furniture installation. The most common scope for a new or relocated office.', includes: ['Design documentation', 'Authority approvals', 'Trade contractor management', 'Furniture installation'] },
              { tier: 'Complex or Heritage Fitout', duration: '12–20 weeks', desc: 'Major works including structural changes, heritage consent, complex services coordination, or multi-floor fitouts.', includes: ['Heritage or change-of-use approvals', 'Fire engineering', 'Multi-trade coordination', 'Heritage-sensitive works management'] }
            ].map((tier) => (
              <FadeIn key={tier.tier} direction="up">
                <div className="bg-white rounded-xl p-8 border border-gray-100 flex flex-col">
                  <p className="text-charcoal/50 font-light text-xs tracking-widest uppercase mb-3">{tier.tier}</p>
                  <p className="text-near-black font-black text-2xl mb-4 leading-tight">{tier.duration}</p>
                  <p className="text-charcoal font-light text-sm leading-relaxed mb-6">{tier.desc}</p>
                  <ul className="space-y-2 flex-1">
                    {tier.includes.map(w => (
                      <li key={w} className="text-charcoal font-light text-sm flex items-start gap-2">
                        <span className="text-teal mt-0.5 flex-shrink-0" style={{ fontSize: '0.7rem' }}>—</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={100}>
            <p className="text-mid-grey font-light text-sm leading-relaxed mt-8">These are indicative ranges. We confirm the programme timeline as part of the initial brief review.</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── COST GUIDE ─────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Fitout Cost Guide</SectionLabel>
            <h2 className="text-white font-bold leading-tight mt-3 mb-12 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              What does a commercial fitout cost?
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { tier: 'Basic Fitout', range: '$600–$1,200 / sqm', desc: 'Standard partitioning, floor finishes, electrical, and furniture installation. For spaces that need a refresh, not a rebuild.', works: ['Standard partitioning and partitions', 'Floor finishes (carpet or vinyl)', 'Basic electrical and data', 'Painting and ceilings', 'Furniture installation'] },
              { tier: 'Mid-Range Fitout', range: '$1,200–$2,000 / sqm', desc: 'A properly specified commercial fitout with quality finishes, acoustic treatment, and coordinated services.', works: ['Custom partitioning and glazed walls', 'Acoustic treatment and privacy solutions', 'Upgraded electrical, data and AV', 'Joinery and feature elements', 'Specialist lighting design'] },
              { tier: 'Premium Fitout', range: '$2,000+ / sqm', desc: 'High-end specification for executive environments, client-facing spaces, or buildings where the fitout reflects the brand.', works: ['Full custom joinery throughout', 'Premium finishes and architectural features', 'Full AV and IT infrastructure', 'Heritage-sensitive works where required', 'Executive and boardroom specification'] }
            ].map((tier) => (
              <FadeIn key={tier.tier} direction="up">
                <div className="bg-[#0D1117] rounded-xl p-8 border border-white/10 flex flex-col">
                  <p className="text-white/40 font-light text-xs tracking-widest uppercase mb-3">{tier.tier}</p>
                  <p className="text-teal font-black text-2xl mb-4 leading-tight">{tier.range}</p>
                  <p className="text-white/60 font-light text-sm leading-relaxed mb-6">{tier.desc}</p>
                  <ul className="space-y-2 flex-1">
                    {tier.works.map(w => (
                      <li key={w} className="text-white/50 font-light text-sm flex items-start gap-2">
                        <span className="text-teal mt-0.5 flex-shrink-0" style={{ fontSize: '0.7rem' }}>—</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <p className="text-white/40 font-light text-sm leading-relaxed max-w-xl">* Indicative only. Actual cost depends on building condition, scope, and programme. Get a fixed price based on your brief — use our free fitout estimator or call us directly.</p>
          </FadeIn>
        </div>
      </section>

      {/* ─── 3D PLANNING ────────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn direction="left">
              <div>
                <SectionLabel>Before you commit</SectionLabel>
                <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-6"
                  style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
                  3D layout planning included. No charge.
                </h2>
                <p className="text-charcoal font-light leading-relaxed mb-6"
                  style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.85 }}>
                  We model your layout in 3D before you commit to anything. You see workstation positions, traffic flow, meeting rooms, and breakout zones — and test different configurations before a dollar is spent.
                </p>
                <p className="text-charcoal font-light leading-relaxed mb-10"
                  style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)', lineHeight: 1.85 }}>
                  What you approve in 3D is what turns up on installation day. No surprises.
                </p>
                <div className="space-y-5">
                  {[
                    { step: '01', title: 'Share your brief', body: 'Floor plan, headcount, and how your team works. That is all we need to get started.' },
                    { step: '02', title: 'We design your layout', body: 'We model your space in 3D. You review, request adjustments, and approve — before anything is ordered.' },
                    { step: '03', title: 'Fixed price. No surprises.', body: 'Once the layout is approved, you receive a fixed price. What you see in the 3D render is what gets built.' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-5">
                      <p className="text-teal font-black text-xl leading-none flex-shrink-0" style={{ paddingTop: '0.1rem' }}>{item.step}</p>
                      <div>
                        <p className="text-near-black font-bold text-base mb-1">{item.title}</p>
                        <p className="text-charcoal font-light text-sm leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="relative rounded-xl overflow-hidden" style={{ height: 'clamp(22rem, 35vw, 32rem)' }}>
                <Image src="/images/furniture/space-cogc-office.jpg" alt="3D office layout planning — commercial fitout Newcastle" fill className="object-cover object-center" />
                <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.3)' }} />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── FAST-TRACK ──────────────────────────────── */}
      <section className="bg-[#0D1117]" style={SEC_SM}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
              <div className="flex-1">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">On a tight timeline?</p>
                <h3 className="text-white font-bold text-2xl lg:text-3xl leading-tight mb-4">Fast-track your fitout.</h3>
                <p className="text-white/60 font-light leading-relaxed" style={{ fontSize: 'clamp(1rem,1.8vw,1.1rem)', lineHeight: 1.8 }}>
                  Lease commencement date is fixed. Rent is running. Every week of delay between handover and practical completion costs your business money. If you are up against a hard opening date, tell us — we will map out what is achievable and what it costs.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button href="/resources/furniture-quote" variant="primary" size="lg">
                  Get a Fast-Track Brief →
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHO WE WORK WITH ────────────────────────── */}
      <section className="bg-warm-grey" style={SEC}>
        <div className="max-w-screen-xl mx-auto" style={PAD}>
          <FadeIn>
            <SectionLabel>Who we work with</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mt-3 mb-8 max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
              Private businesses, councils, schools, and health facilities across NSW.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Commercial offices', body: 'Private sector businesses of all sizes. Tenants managing a lease change, relocation, or new-build fitout.' },
              { label: 'Councils & government', body: 'Local government and public sector organisations. Procurement-compliant, panel-approved where required.' },
              { label: 'Schools & education', body: 'Student environments, staff spaces, and administration fitouts. Understanding of education facility standards.' },
              { label: 'Health & community', body: 'Medical practices, allied health, and community facilities. Infection control and compliance-aware specification.' }
            ].map((item) => (
              <FadeIn key={item.label} direction="up">
                <div className="bg-white rounded-xl p-7 flex flex-col">
                  <p className="text-near-black font-bold text-base mb-3">{item.label}</p>
                  <p className="text-charcoal font-light leading-relaxed flex-1" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(20rem,30vw,26rem)' }}>
        <Image src="/images/furniture/dbt-boardroom.jpg" alt="DBT boardroom — YOS fitout management, brief to practical completion" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.4)' }} />
        <div className="absolute inset-0 flex items-end max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingBottom: 'clamp(2.5rem,6vw,5rem)' }}>
          <FadeIn>
            <p className="text-white font-light italic" style={{ fontSize: 'clamp(1.1rem,2.2vw,1.5rem)', maxWidth: '44rem', lineHeight: 1.75, borderLeft: '3px solid #00B5A5', paddingLeft: '1.5rem' }}>
              &ldquo;Joe was instrumental in building out our boardroom — high quality table, chairs, acoustic panelling. Practical advice, excellent detail.&rdquo;
              <br /><span className="text-teal font-semibold not-italic" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>— Nathan Franks, Dynamic Business Technologies</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── BUNDLE ────────────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="bg-near-black rounded-xl p-7 sm:p-10 lg:p-16 flex flex-col lg:flex-row gap-8 lg:gap-10 items-start lg:items-center">
              <div className="flex-1">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">Bundle &amp; Save</p>
                <h3 className="text-white font-bold text-2xl lg:text-3xl leading-tight mb-4">Fitout + furniture + cleaning. One team.</h3>
                <p className="text-white/60 font-light text-base leading-relaxed">
                  We manage the fitout, supply the furniture, and handle the post-construction clean. No gaps between trades, no multiple contractors to coordinate. One briefing. One team from start to finish.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-3">
                <Button href="/furniture" variant="primary" size="lg">See Furniture Range →</Button>
                <Button href="/cleaning" variant="primary" size="lg">See Cleaning →</Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── QUOTE FORM ─────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={PAD}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">Start Your Fitout Brief</p>
                <h2 className="text-white font-bold leading-tight mb-5" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>Tell us about your project.</h2>
                <p className="text-white/60 font-light leading-relaxed mb-8" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}>
                  We manage fitouts across Newcastle, the Hunter Valley, Sydney, and regional NSW. Send us your brief and we will come back with a process outline and a clear price.
                </p>
                <div className="flex flex-col gap-3 text-white/60 text-sm">
                  {[
                    "Floor plan or rough dimensions",
                    "Headcount and workstation requirements",
                    "Scope — construction, furniture, or both",
                    "Timeline and lease commencement date",
                    "Budget guidance"
                  ].map(s => (
                    <span key={s} className="flex items-center gap-2"><span className="text-teal">—</span>{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-warm-grey rounded-xl p-7 sm:p-10">
                <HubSpotForm formId="188fd0e9-44a0-4ed1-ab94-da26126fcc9e" targetId="fitout-quote-form" />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <BookingCTA label="Book a Free Consultation" />
      <Footer />
    </>
  )
}
