import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import BookingCTA from '@/components/BookingCTA'
import CapabilityDownload from '@/components/CapabilityDownload'
import TenantProcess from '@/components/TenantProcess'

export const metadata: Metadata = {
  title: 'Tenant-Side Workplace Partner | Your Office Space',
  description: 'Based in Newcastle and working Australia-wide where capability and licensing permit. One team for tenant-side property decisions, commercial fit out and workplace furniture.',
  alternates: { canonical: 'https://www.yourofficespace.au' },
  twitter: { card: 'summary_large_image', title: 'Your Office Space | One Team on Your Side', description: 'One team. Clear direction. No guesswork. Property decisions, fit out and furniture planned together.' },
  openGraph: {
    title: 'Your Office Space | One Team on Your Side',
    description: 'Based in Newcastle. Working Australia-wide where capability and licensing permit.',
    url: 'https://www.yourofficespace.au',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
    images: [{ url: '/og/og-home.png', width: 1200, height: 630, alt: 'Your Office Space — one team on your side' }],
  },
}

const WRAP = 'max-w-screen-xl mx-auto'
const SEC    = { paddingTop: 'clamp(4rem,8vw,10rem)', paddingBottom: 'clamp(4rem,8vw,10rem)' }
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

const SERVICES = [
  { num: '01', title: 'Tenant Representation', tagline: 'Your lease. Your terms.', body: 'We advise and negotiate exclusively on the tenant side, making the obligations, risks and trade-offs clear before you commit.', href: '/tenant-rep' },
  { num: '02', title: 'Commercial Fit Out & Project Management', tagline: 'From brief to delivered workspace.', body: 'We coordinate the fit out from workplace brief and procurement through delivery, handover and the details between them.', href: '/office-fitout' },
  { num: '03', title: 'Office & Commercial Furniture', tagline: 'Furniture that fits the work.', body: 'We help select, supply and install furniture that suits the space, the team and the way the workplace needs to operate.', href: '/furniture' },
]

const DELIVERY_RELATIONSHIPS = [
  {
    organisation: 'Recovery Station',
    contact: 'Beth Gwalter',
    context: 'Client relationship',
    logo: '/images/relationships/recovery-station.jpg',
    width: 588,
    height: 330,
  },
  {
    organisation: 'Total Fitouts',
    contact: 'Jason Dowdall',
    context: 'Fit out relationship',
    logo: '/images/relationships/total-fitouts.webp',
    width: 1000,
    height: 316,
  },
]

export default function Home() {
  return (
    <>
      <Nav />

      <main id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["LocalBusiness", "ProfessionalService"],
            "@id": "https://www.yourofficespace.au/#business",
            "name": "Your Office Space",
            "url": "https://www.yourofficespace.au",
            "logo": "https://www.yourofficespace.au/logo.png",
            "description": "Based in Newcastle and working Australia-wide where capability and licensing permit. Your Office Space connects tenant-side property decisions, commercial fit out and workplace furniture, with commercial cleaning available in Newcastle and the Hunter.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Newcastle",
              "addressRegion": "NSW",
              "postalCode": "2300",
              "addressCountry": "AU"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -32.9283,
              "longitude": 151.7817
            },
            "telephone": "+61434655511",
            "email": "jk@yourofficespace.au",
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "AdministrativeArea", "name": "Hunter Region" },
              { "@type": "Country", "name": "Australia" }
            ],
            "serviceType": ["Tenant Representation", "Commercial Fit Out & Project Management", "Office & Commercial Furniture"],
            "knowsAbout": ["Commercial Leases", "Tenant Rights", "Commercial Fit Out", "Workplace Furniture", "Commercial Cleaning"],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+61434655511",
              "contactType": "Customer Service",
              "areaServed": "AU",
              "availableLanguage": "English"
            },
            "sameAs": [
              "https://www.google.com/maps?cid=00516804211961979706"
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What is tenant representation in commercial property?", "acceptedAnswer": { "@type": "Answer", "text": "Tenant representation is a service where a licensed agent works exclusively for the tenant. not the landlord. in negotiating a commercial lease. They help secure better rent, favourable terms, rent-free periods and incentives. Your Office Space only ever represents tenants." } },
              { "@type": "Question", "name": "How much does commercial tenant representation cost?", "acceptedAnswer": { "@type": "Answer", "text": "The fee structure depends on the scope and transaction. Your Office Space confirms fees and any third-party arrangements before an engagement begins." } },
              { "@type": "Question", "name": "What is a make-good clause in a commercial lease?", "acceptedAnswer": { "@type": "Answer", "text": "A make-good clause sets out what a tenant must do to the premises at the end of the lease. The obligation can vary significantly, so it should be understood and negotiated before the lease is signed." } },
              { "@type": "Question", "name": "How does a commercial office fitout work from start to finish?", "acceptedAnswer": { "@type": "Answer", "text": "Your Office Space coordinates the fit out process from design and brief through procurement, programme management, services coordination, furniture installation, practical completion and handover." } },
              { "@type": "Question", "name": "Where does Your Office Space work?", "acceptedAnswer": { "@type": "Answer", "text": "Your Office Space is based in Newcastle and works Australia-wide where service capability and licensing permit. Commercial cleaning is available in Newcastle and the Hunter." } },
              { "@type": "Question", "name": "What is the difference between a tenant representative and a commercial real estate agent acting for a landlord?", "acceptedAnswer": { "@type": "Answer", "text": "A commercial agent engaged by the landlord acts for the property owner. A tenant representative acts for the tenant, helping the occupying business assess options and negotiate its lease." } }
            ]
          }
        ]
      })}} />

      {/* ─── ANNOUNCEMENT BAR ──────────────────────────────────── */}
      <div className="bg-light-teal" style={{ padding: '0.65rem clamp(1.5rem,8vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto text-center">
          <span className="text-near-black font-semibold text-xs">Based in Newcastle. Working Australia-wide, within verified service and licensing coverage.</span>
        </div>
      </div>

      {/* ─── HERO ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black">
        <div
          className={`relative z-10 w-full ${WRAP} hero-overlay-content`}
          style={PAD}
        >
          <FadeIn>
            <SectionLabel>Tenant-side commercial property advisory</SectionLabel>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white leading-[1.02] tracking-tight"
              style={{ fontSize: 'clamp(2.5rem,6.5vw,7rem)', maxWidth: '14ch', marginBottom: '1.75rem' }}>
              We help businesses find their next commercial building. Lease or buy.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/90 font-normal leading-relaxed"
              style={{ fontSize: 'clamp(1rem,2.5vw,1.15rem)', maxWidth: '34rem', lineHeight: 1.9, marginBottom: '2.25rem' }}>
              Your lease. Your fit out. Your furniture. One accountable team on your side from the first decision to move-in.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col items-start gap-3">
              <BookingCTA label="Book a Clarity Call" variant="primary" size="lg" />
              <span className="text-white/80 text-sm">A focused conversation about the decision in front of you.</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── EMOTIONAL HOOK ──────────────────────── near-black */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(3rem,6vw,5rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div style={{ maxWidth: '54rem' }}>
              <p className="text-teal leading-none" style={{ fontWeight: 700, fontSize: 'clamp(2rem,5vw,4.5rem)', marginBottom: '2rem', lineHeight: 1.05 }}>
                The landlord has an expert. You should too.
              </p>
              <p className="text-white/80 font-normal leading-relaxed" style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', lineHeight: 1.9 }}>
                Commercial lease terms, fit out decisions and ongoing workplace services all carry trade-offs. We make them clear, coordinate the moving parts and stay accountable for the outcome.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Proof is shown through the process until testimonial permissions are recorded. */}
      <section className="bg-warm-grey" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>How we work</SectionLabel>
            <h2 className="text-near-black leading-tight tracking-tight mt-2 mb-5"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', maxWidth: '18ch' }}>
              Make the trade-offs visible before you commit.
            </h2>
            <p className="text-charcoal leading-relaxed" style={{ fontSize: '1.05rem', maxWidth: '44rem', lineHeight: 1.85 }}>
              We bring the property, fit out and furniture decisions into one plan, show the working and keep the next decision clear.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── SERVICES ──────────────────────────────── white */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>What we do</SectionLabel>
            <h2 className="text-near-black leading-tight tracking-tight mt-2 mb-5"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
              Three core services.<br />One accountable partner.
            </h2>
            <p className="text-charcoal font-normal leading-relaxed mb-12" style={{ fontSize: '1.05rem', maxWidth: '40rem', lineHeight: 1.85 }}>
              Leasing, fit out and furniture are planned together so responsibilities stay clear and gaps do not become your problem.
            </p>
          </FadeIn>

          <div>
            {SERVICES.map((s, i) => (
              <FadeIn key={s.href} delay={i * 60}>
                <Link href={s.href} className="group no-underline block transition-colors duration-200"
                  style={{ borderTop: i === 0 ? '1px solid #e5e7eb' : undefined, borderBottom: '1px solid #e5e7eb', paddingTop: 'clamp(2rem,4vw,3rem)', paddingBottom: 'clamp(2rem,4vw,3rem)' }}>
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-6 mb-3">
                        <span className="text-teal font-bold flex-shrink-0" style={{ fontSize: '0.65rem', letterSpacing: '0.25em', minWidth: '2rem' }}>{s.num}</span>
                        <div>
                          <h3 className="text-near-black leading-tight tracking-tight group-hover:text-teal transition-colors duration-200"
                            style={{ fontSize: 'clamp(1.25rem,2.5vw,2.25rem)', marginBottom: '0.2rem' }}>
                            {s.title}
                          </h3>
                          <p className="text-teal font-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>{s.tagline}</p>
                        </div>
                      </div>
                      <div className="pl-0 md:pl-14">
                        <p className="text-charcoal font-normal leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.8, maxWidth: '42rem' }}>{s.body}</p>
                      </div>
                    </div>
                    <span className="text-teal/40 font-bold flex-shrink-0 group-hover:text-teal group-hover:translate-x-2 transition-all duration-200 mt-1" style={{ fontSize: '1.25rem' }}>→</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={180}>
            <div className="mt-10 border-l-4 border-teal bg-light-teal p-6" style={{ borderRadius: '4px' }}>
              <p className="text-near-black font-bold text-xs tracking-[0.18em] uppercase mb-3">Once you&apos;re in</p>
              <h3 className="text-near-black mb-3" style={{ fontSize: '1.35rem' }}>Commercial Cleaning</h3>
              <p className="text-charcoal leading-relaxed mb-4" style={{ maxWidth: '44rem' }}>
                Ongoing workplace care for businesses in Newcastle and the Hunter, scoped around the standard your site needs.
              </p>
              <Link href="/cleaning" className="text-action-teal font-semibold underline underline-offset-4">Get a cleaning quote</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Relationship claims are limited to owner-confirmed organisation/contact mappings. */}
      <section className="bg-warm-grey" style={SEC} aria-labelledby="delivery-relationships-heading">
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>Selected relationships</SectionLabel>
            <h2 id="delivery-relationships-heading" className="text-near-black leading-tight tracking-tight mt-2 mb-5"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', maxWidth: '19ch' }}>
              People and organisations we work with.
            </h2>
            <p className="text-charcoal leading-relaxed mb-10" style={{ fontSize: '1.05rem', maxWidth: '44rem', lineHeight: 1.85 }}>
              Clear relationships help keep the client brief, delivery responsibilities and next decision connected.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DELIVERY_RELATIONSHIPS.map((relationship, index) => (
              <FadeIn key={relationship.organisation} delay={index * 80}>
                <article className="bg-white border border-gray-200 h-full p-6 sm:p-8" style={{ borderRadius: '4px' }}>
                  <div className="bg-white flex items-center justify-center mb-6" style={{ minHeight: '9rem' }}>
                    <Image
                      src={relationship.logo}
                      alt={`${relationship.organisation} logo`}
                      width={relationship.width}
                      height={relationship.height}
                      className="max-h-28 w-auto object-contain"
                    />
                  </div>
                  <p className="text-teal font-bold text-xs tracking-[0.16em] uppercase mb-2">{relationship.context}</p>
                  <h3 className="text-near-black mb-2" style={{ fontSize: '1.35rem' }}>{relationship.organisation}</h3>
                  <p className="text-charcoal leading-relaxed">Relationship contact: <strong>{relationship.contact}</strong></p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <p className="text-white leading-tight" style={{ fontSize: 'clamp(1.75rem,3.5vw,3.25rem)', maxWidth: '22ch' }}>
              A workplace that works is one less thing competing for your attention.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHY US ────────────────────────────────── near-black */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>Why us</SectionLabel>
            <h2 className="text-white leading-tight tracking-tight mt-2 mb-10"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', maxWidth: '22ch' }}>
              Advice that stays<br />on your side.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'We never work for landlords', body: 'For every negotiation, every clause and every conversation, we answer to you. Not the building owner, and not a referral fee.' },
              { title: 'We make the risks clear', body: 'Commercial leases and fit out contracts can hide costly gaps. We surface the obligations, trade-offs and decisions before they become surprises.' },
              { title: 'One call covers everything', body: 'Lease, fitout, furniture, cleaning. One relationship. We are the last business card you need for your workspace.' },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div className="whyus-card">
                  <h3 className="text-white tracking-tight mb-4" style={{ fontSize: '1rem' }}>{p.title}</h3>
                  <p className="text-white/80 font-normal leading-relaxed" style={{ fontSize: 'clamp(0.95rem,1.5vw,1rem)', lineHeight: 1.8 }}>{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CAPABILITY STATEMENT DOWNLOAD ────────────────────── */}
      <section className="bg-white" style={{ paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div className={WRAP} style={PAD}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn>
              <div>
                <SectionLabel>Our credentials</SectionLabel>
                <h2 className="text-near-black leading-tight tracking-tight mt-2 mb-5"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,3rem)' }}>
                  Review our capability before we talk.
                </h2>
                <p className="text-charcoal font-normal leading-relaxed mb-6"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  The capability statement covers our services, approach, selected work and the sectors we support. Download it before our first call so we can get straight to your situation.
                </p>
                <p className="text-charcoal/60 font-normal" style={{ fontSize: '0.85rem' }}>
                  Includes selected work, sector coverage and contact details.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="border border-gray-200 p-8 sm:p-10 flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-teal/10 rounded-[4px] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B5A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-near-black font-bold mb-1" style={{ fontSize: '0.95rem' }}>YOS Tenant Representation Capability Statement</p>
                    <p className="text-charcoal/60" style={{ fontSize: '0.8rem' }}>PDF · Your Office Space</p>
                  </div>
                </div>
                <CapabilityDownload
                  label="Download Capability Statement"
                  variant="primary"
                  className="w-full sm:w-auto"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── LEASEINTEL ────────────────────────────── teal */}
      <section className="bg-teal text-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '46rem', margin: '0 auto' }}>
              <div className="inline-flex items-center gap-2 border border-white/30 mb-8" style={{ padding: '0.5rem 1.25rem' }}>
                <span className="bg-white rounded-sm" style={{ width: '0.4rem', height: '0.4rem', flexShrink: 0 }} />
                <span className="text-white font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>New — LeaseIntel™</span>
              </div>
              <h2 className="text-white leading-tight tracking-tight w-full"
                style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', marginBottom: '1.25rem' }}>
                Does your lease have a trap you haven&apos;t found yet?
              </h2>
              <p className="text-white font-normal leading-relaxed w-full"
                style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '0.75rem' }}>
                Commercial lease obligations are not always obvious from the headline rent.
              </p>
              <p className="text-white font-normal leading-relaxed w-full"
                style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '2.5rem' }}>
                Answer 10 questions. Get a plain-English Red, Amber or Green risk rating, plus the top issues to address. Free, instant, no document needed.
              </p>
              <div>
                <Button href="/resources/lease-review" variant="dark" size="lg">
                  Start the lease risk check
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── TENANT PROCESS ─────────────────────────────────── */}
      <TenantProcess dark={false} compact />

      {/* ─── CTA ───────────────────────────────────── near-black */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
              <SectionLabel>Get started</SectionLabel>
              <h2 className="text-white leading-tight tracking-tight w-full"
                style={{ fontSize: 'clamp(2rem,5vw,5rem)', marginBottom: '1.25rem' }}>
                Let&apos;s talk<br />about your space.
              </h2>
              <p className="text-white/80 font-normal leading-relaxed w-full"
                style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                Tell us what you&apos;re working with and we&apos;ll identify the clearest next step.
              </p>
              <BookingCTA label="Book a Clarity Call" variant="primary" size="lg" />
              <p className="text-white/80 font-normal mt-5" style={{ fontSize: '0.8rem' }}>
                Appointment availability is shown when you book.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      </main>

      <Footer />
    </>
  )
}
