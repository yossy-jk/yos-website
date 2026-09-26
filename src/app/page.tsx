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
import { IMAGES } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Commercial Office Space Newcastle | Tenant Rep, Fitout, Furniture | YOS',
  description: 'Newcastle-based, tenant-side commercial property advisory across Australia. One accountable partner for tenant representation, fit out, furniture and cleaning.',
  alternates: { canonical: 'https://www.yourofficespace.au' },
  twitter: { card: 'summary_large_image', title: 'Your Office Space | Tenant-Side Commercial Property Advisory', description: 'One team. Clear direction. No guesswork. One accountable partner from lease decisions through fit out, furniture and ongoing cleaning.' },
  openGraph: {
    title: 'Your Office Space | Tenant-Side Commercial Property Advisory Newcastle',
    description: 'One team. Clear direction. No guesswork. Newcastle-based, tenant-side commercial property advisory across Australia.',
    url: 'https://www.yourofficespace.au',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
    images: [{ url: '/og/og-home.png', width: 1200, height: 630, alt: 'Commercial Office Space Newcastle | Your Office Space' }],
  },
}

const WRAP = 'max-w-screen-xl mx-auto'
const SEC    = { paddingTop: 'clamp(4rem,8vw,10rem)', paddingBottom: 'clamp(4rem,8vw,10rem)' }
const PAD    = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

const SERVICES = [
  { num: '01', title: 'Tenant Representation', tagline: 'Your lease. Your terms.', body: 'We advise and negotiate exclusively on the tenant side, making the obligations, risks and trade-offs clear before you commit.', href: '/tenant-rep' },
  { num: '02', title: 'Commercial Fit Out & Project Management', tagline: 'From brief to delivered workspace.', body: 'We coordinate the fit out from workplace brief and procurement through delivery, handover and the details between them.', href: '/office-fitout' },
  { num: '03', title: 'Office & Commercial Furniture', tagline: 'Furniture that fits the work.', body: 'We help select, supply and install furniture that suits the space, the team and the way the workplace needs to operate.', href: '/furniture' },
  { num: '04', title: 'Commercial Cleaning', tagline: 'Shows up. Every time.', body: 'We build a clear cleaning scope around your workplace standards, with practical communication and accountability.', href: '/cleaning' },
]

const TESTIMONIALS: Array<{ name: string; company?: string; service: string; quote: string }> = [
  { name: 'Beth Gwalter', service: 'Tenant representation', quote: 'Joe was incredibly helpful through our first tenant rep experience. He made the property search and lease process much easier, explained our rights and options clearly, spotted things we would have missed, and helped with fitout, furniture and cleaners too. Worth it.' },
  { name: 'Olivia Crawford', service: 'Commercial property', quote: 'Highly recommend Your Office Space. Joe was professional, reliable and fantastic to communicate with, and the service was flawless from start to finish. Joe was beyond amazing.' },
  { name: 'Jason Dowdall', service: 'Fitout project support', quote: 'Joe and the team were incredible. They took the stress out of a stressful time and felt like a one-stop shop.' },
]

function Stars() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} style={{ width: '0.85rem', height: '0.85rem', fill: '#EAB308' }} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

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
            "description": "Newcastle-based, tenant-side commercial property advisory across Australia. Tenant representation, commercial fit out and project management, office and commercial furniture, and commercial cleaning.",
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
            "serviceType": ["Tenant Representation", "Commercial Fit Out & Project Management", "Office & Commercial Furniture", "Commercial Cleaning"],
            "knowsAbout": ["Commercial Leases", "Tenant Rights", "Commercial Fit Out", "Workplace Furniture", "Commercial Cleaning"],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+61434655511",
              "contactType": "Customer Service",
              "areaServed": "AU",
              "availableLanguage": "English"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "3",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              { "@type": "Review", "author": { "@type": "Person", "name": "Beth Gwalter" }, "reviewBody": "Joe was incredibly helpful through our first tenant rep experience. He made the property search and lease process much easier, explained our rights and options clearly, spotted things we would have missed, and helped with fitout, furniture and cleaners too. Worth it.", "reviewRating": { "@type": "Rating", "ratingValue": "5" } },
              { "@type": "Review", "author": { "@type": "Person", "name": "Olivia Crawford" }, "reviewBody": "Highly recommend Your Office Space. Joe was professional, reliable and fantastic to communicate with, and the service was flawless from start to finish. Joe was beyond amazing.", "reviewRating": { "@type": "Rating", "ratingValue": "5" } },
              { "@type": "Review", "author": { "@type": "Person", "name": "Jason Dowdall" }, "reviewBody": "Joe and the team were incredible. They took the stress out of a stressful time and felt like a one-stop shop.", "reviewRating": { "@type": "Rating", "ratingValue": "5" } }
            ],
            "sameAs": [
              "https://www.google.com/maps?cid=00516804211961979706"
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What is tenant representation in commercial property?", "acceptedAnswer": { "@type": "Answer", "text": "Tenant representation is a service where a licensed agent works exclusively for the tenant — not the landlord — in negotiating a commercial lease. They help secure better rent, favourable terms, rent-free periods and incentives. Your Office Space only ever represents tenants." } },
              { "@type": "Question", "name": "How much does commercial tenant representation cost?", "acceptedAnswer": { "@type": "Answer", "text": "The fee structure depends on the scope and transaction. Your Office Space confirms fees and any third-party arrangements before an engagement begins." } },
              { "@type": "Question", "name": "What is a make-good clause in a commercial lease?", "acceptedAnswer": { "@type": "Answer", "text": "A make-good clause sets out what a tenant must do to the premises at the end of the lease. The obligation can vary significantly, so it should be understood and negotiated before the lease is signed." } },
              { "@type": "Question", "name": "How does a commercial office fitout work from start to finish?", "acceptedAnswer": { "@type": "Answer", "text": "Your Office Space coordinates the fit out process from design and brief through procurement, programme management, services coordination, furniture installation, practical completion and handover." } },
              { "@type": "Question", "name": "Where does Your Office Space work?", "acceptedAnswer": { "@type": "Answer", "text": "Your Office Space is Newcastle-based, with the Hunter as its home territory, and provides tenant-side commercial property advisory across Australia." } },
              { "@type": "Question", "name": "What is the difference between a tenant representative and a commercial real estate agent acting for a landlord?", "acceptedAnswer": { "@type": "Answer", "text": "A commercial agent engaged by the landlord acts for the property owner. A tenant representative acts for the tenant, helping the occupying business assess options and negotiate its lease." } }
            ]
          }
        ]
      })}} />

      {/* ─── ANNOUNCEMENT BAR ──────────────────────────────────── */}
      <div className="bg-light-teal" style={{ padding: '0.65rem clamp(1.5rem,8vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto text-center">
          <span className="text-near-black font-semibold text-xs">Independent tenant-side advice · Newcastle-based · Supporting businesses Australia-wide</span>
        </div>
      </div>

      {/* ─── HERO ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Modern commercial workspace Newcastle"
          fill className="object-cover object-center" priority
        />
        <div className="absolute inset-0 bg-near-black/65" />
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
            <p className="text-white/90 font-light leading-relaxed"
              style={{ fontSize: 'clamp(1rem,2.5vw,1.15rem)', maxWidth: '34rem', lineHeight: 1.9, marginBottom: '2.25rem' }}>
              The landlord has an expert. You should too. We bring the property, fit out, furniture and cleaning decisions into one clear plan.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col items-start gap-3">
              <BookingCTA label="Book a Clarity Call" variant="primary" size="lg" />
              <span className="text-white/80 text-sm">Start with the decision you need to make.</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── THE PIE ─────────────────────────────── */}
      <section className="bg-light-teal" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>Protect the project budget</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mt-3">
              <h2 className="text-near-black font-black leading-tight tracking-tight"
                style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>
                One budget. A lot of hands reaching for it.
              </h2>
              <div className="text-readable-grey font-light leading-relaxed space-y-5" style={{ fontSize: '1.05rem' }}>
                <p>Your workplace project starts with a fixed budget. Property costs, consultants, contractors, furniture suppliers and programme changes all take a share.</p>
                <p>When nobody is protecting the whole picture, early decisions can leave too little for the space your team actually needs.</p>
                <p className="text-near-black font-semibold">We get involved early, make the trade-offs visible and keep every decision tied to the same outcome.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── EMOTIONAL HOOK ──────────────────────── near-black */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(3rem,6vw,5rem)', paddingBottom: 'clamp(3rem,6vw,5rem)' }}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div style={{ maxWidth: '54rem' }}>
              <p className="text-teal leading-none" style={{ fontFamily: 'var(--font-fraunces), Fraunces, Georgia, serif', fontWeight: 600, fontSize: 'clamp(2rem,5vw,4.5rem)', marginBottom: '2rem', lineHeight: 1.05 }}>
                The landlord has an expert. You should too.
              </p>
              <p className="text-white/80 font-light leading-relaxed" style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', lineHeight: 1.9 }}>
                Commercial lease terms, fit out decisions and ongoing workplace services all carry trade-offs. We make them clear, coordinate the moving parts and stay accountable for the outcome.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────── warm grey */}
      <section className="bg-warm-grey" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <SectionLabel>What clients say</SectionLabel>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mt-2 mb-12"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
              Real people.<br />Real outcomes.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="testimonial-card">
                  <Stars />
                  <p className="text-near-black font-light leading-relaxed flex-1 mt-8 mb-10"
                    style={{ fontSize: '1.05rem', lineHeight: 1.9 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: '1px solid #efefef', paddingTop: '1.5rem' }}>
                    <p className="text-near-black font-bold mb-1" style={{ fontSize: '0.9rem' }}>{t.name}</p>
                    {t.company && <p className="text-charcoal font-medium mb-2" style={{ fontSize: '0.82rem' }}>{t.company}</p>}
                    <p className="text-teal font-semibold uppercase tracking-widest" style={{ fontSize: '0.62rem' }}>{t.service}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK 1 ─────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(24rem,40vw,34rem)' }}>
        <Image
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80"
          alt="Business owners meeting with advisor"
          fill className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,59,56,0.55)' }} />
        <div className="absolute inset-0 flex items-center" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.75rem,3.5vw,3.25rem)', maxWidth: '20ch' }}>
              The landlord has an expert working for them.<br />
              <span style={{ color: '#01A7A3' }}>Now you do too.</span>
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
              Four services.<br />One accountable partner.
            </h2>
            <p className="text-charcoal font-light leading-relaxed mb-12" style={{ fontSize: '1.05rem', maxWidth: '40rem', lineHeight: 1.85 }}>
              A commercial workplace brings together lease, fit out, furniture and cleaning decisions. We coordinate the work so responsibilities stay clear and gaps do not become your problem.
            </p>
          </FadeIn>

          <div>
            {SERVICES.map((s, i) => (
              <FadeIn key={s.href} delay={i * 60}>
                <Link href={s.href} className="group no-underline block hover:shadow-md transition-shadow duration-300"
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
                        <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.8, maxWidth: '42rem' }}>{s.body}</p>
                      </div>
                    </div>
                    <span className="text-teal/40 font-bold flex-shrink-0 group-hover:text-teal group-hover:translate-x-2 transition-all duration-200 mt-1" style={{ fontSize: '1.25rem' }}>→</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK 2 ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(24rem,40vw,34rem)' }}>
        <Image
          src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1920&q=80"
          alt="Professional Newcastle commercial office interior"
          fill className="object-cover object-top"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,59,56,0.5)' }} />
        <div className="absolute inset-0 flex items-center justify-end" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight text-right" style={{ fontSize: 'clamp(1.75rem,3.5vw,3.25rem)', maxWidth: '22ch' }}>
              A space that works is one less thing<br />keeping you up at night.
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
              { title: 'We never work for landlords', body: 'Every negotiation, every clause, every conversation — we are answering to you. Not the building owner, not a referral fee.' },
              { title: 'We make the risks clear', body: 'Commercial leases and fit out contracts can hide costly gaps. We surface the obligations, trade-offs and decisions before they become surprises.' },
              { title: 'One call covers everything', body: 'Lease, fitout, furniture, cleaning. One relationship. We are the last business card you need for your workspace.' },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div className="whyus-card">
                  <h3 className="text-white tracking-tight mb-4" style={{ fontSize: '1rem' }}>{p.title}</h3>
                  <p className="text-white/80 font-light leading-relaxed" style={{ fontSize: 'clamp(0.95rem,1.5vw,1rem)', lineHeight: 1.8 }}>{p.body}</p>
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
                <p className="text-charcoal font-light leading-relaxed mb-6"
                  style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  The capability statement covers our services, approach, selected work and the sectors we support. Download it before our first call so we can get straight to your situation.
                </p>
                <p className="text-charcoal/60 font-light" style={{ fontSize: '0.85rem' }}>
                  Includes selected work, sector coverage and contact details.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="border border-gray-200 p-8 sm:p-10 flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-teal/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#01A7A3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

      {/* ─── IMAGE BREAK 3 ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(24rem,40vw,34rem)' }}>
        <Image src={IMAGES.boardroom} alt="Modern Newcastle boardroom" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,59,56,0.45)' }} />
        <div className="absolute inset-0 flex items-end" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingBottom: 'clamp(2rem,5vw,4rem)' }}>
          <FadeIn>
            <p className="text-white font-light italic" style={{ fontSize: 'clamp(1rem,2vw,1.35rem)', maxWidth: '44rem', lineHeight: 1.8, borderLeft: '3px solid #01A7A3', paddingLeft: '1.5rem' }}>
              &ldquo;Joe was instrumental in building out our boardroom — high quality, practical advice, excellent detail.&rdquo;
              <br /><span className="text-teal font-semibold not-italic" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>— Nathan Franks, Dynamic Business Technologies</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── LEASEINTEL ────────────────────────────── teal */}
      <section className="bg-teal text-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '46rem', margin: '0 auto' }}>
              <div className="inline-flex items-center gap-2 border border-white/30 mb-8" style={{ padding: '0.5rem 1.25rem' }}>
                <span className="bg-white rounded-full" style={{ width: '0.4rem', height: '0.4rem', flexShrink: 0 }} />
                <span className="text-white font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>New — LeaseIntel™</span>
              </div>
              <h2 className="text-white leading-tight tracking-tight w-full"
                style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', marginBottom: '1.25rem' }}>
                Does your lease have a trap you haven&apos;t found yet?
              </h2>
              <p className="text-white font-light leading-relaxed w-full"
                style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '0.75rem' }}>
                Commercial lease obligations are not always obvious from the headline rent.
              </p>
              <p className="text-white font-light leading-relaxed w-full"
                style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '2.5rem' }}>
                Answer 10 questions. Get a plain-English risk rating — Red, Amber, or Green — and the top issues to deal with. Free, instant, no document needed.
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
              <p className="text-white/80 font-light leading-relaxed w-full"
                style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                No obligation. No pitch. Tell us what you&apos;re working with and we&apos;ll give you a straight answer.
              </p>
              <BookingCTA label="Book a Clarity Call" variant="primary" size="lg" />
              <p className="text-white/80 font-light mt-5" style={{ fontSize: '0.8rem' }}>
                Send the details and our team will be in touch.
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
