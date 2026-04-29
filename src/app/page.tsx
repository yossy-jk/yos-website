import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'
import BookingCTA from '@/components/BookingCTA'
import { IMAGES } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Your Office Space | Tenant-Side Commercial Property Advisory',
  description: 'One team working only for you. Tenant representation, buyers agency, furniture & fitout, and commercial cleaning. Honest advice. Real outcomes.',
  twitter: { card: 'summary_large_image', title: 'Your Office Space | Tenant-Side Commercial Property Advisory', description: 'One team working only for you. Tenant rep, buyers agency, furniture, fitout and cleaning.' },
  openGraph: {
    title: 'Your Office Space | Tenant-Side Commercial Property Advisory',
    description: 'One team working only for you — from the first conversation to the day your space is running.',
    url: 'https://yourofficespace.au',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = 'clamp(1.5rem,8vw,10rem)'

const SERVICES = [
  { num: '01', title: 'Tenant Representation', tagline: 'Your lease. Your terms.', body: 'The landlord has an agent. You should too. We negotiate exclusively for tenants — rent, incentives, make-good, every clause — so you never sign a deal that costs you more than it should.', href: '/tenant-rep' },
  { num: '02', title: 'Buyers Agency',         tagline: 'Buy without getting burned.', body: 'Off-market access, rigorous due diligence, and hard negotiations for commercial property buyers who want someone fighting for them — not the vendor.', href: '/buyers-agency' },
  { num: '03', title: 'Furniture & Fitout',    tagline: 'Brief to delivered.', body: 'From brief to fully fitted workspace. Specified, coordinated and installed end to end. One team, no gaps, no surprises on delivery day.', href: '/furniture' },
  { num: '04', title: 'Commercial Cleaning',   tagline: 'Shows up. Every time.', body: 'Healthcare-grade commercial cleaning for offices that can\'t afford inconsistency. Locally managed, accountable, and built around your standards.', href: '/cleaning' },
]

const TESTIMONIALS = [
  { name: 'Liz Murray', company: 'Edge of Possibilities', service: 'Workplace Strategy', quote: 'Joe takes the time to really listen and understand what you need. He asks thoughtful questions, builds genuine relationships, and makes the whole process feel collaborative.' },
  { name: 'Nathan Franks', company: 'Dynamic Business Technologies', service: 'Furniture & Fitout', quote: 'Joe was instrumental in building out our boardroom — high-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent detail.' },
  { name: 'Sophie', company: 'Jirsch Sutherland', service: 'Commercial Cleaning', quote: 'We are very happy with the service provided by Sarah and Joe. They are reliable and consistent, and go above and beyond to make sure all our cleaning needs are met.' },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ProfessionalService",
            "@id": "https://yourofficespace.au/#business",
            "name": "Your Office Space",
            "url": "https://yourofficespace.au",
            "logo": "https://yourofficespace.au/logo.png",
            "description": "Tenant-side commercial property advisory across Australia. Tenant representation, buyers agency, office furniture, fitout and commercial cleaning.",
            "areaServed": ["New South Wales", "Australia"],
            "serviceType": ["Tenant Representation", "Commercial Buyers Agency", "Office Furniture", "Office Fitout", "Commercial Cleaning"],
            "knowsAbout": ["Commercial Leases", "Tenant Rights", "Commercial Property Investment", "Office Fitout", "Workplace Design"],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+61434655511",
              "contactType": "Customer Service",
              "areaServed": "AU",
              "availableLanguage": "English"
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What is tenant representation in commercial property?", "acceptedAnswer": { "@type": "Answer", "text": "Tenant representation is a service where a licensed agent works exclusively for the tenant — not the landlord — in negotiating a commercial lease. They help secure better rent, favourable terms, rent-free periods and incentives. Your Office Space only ever represents tenants." } },
              { "@type": "Question", "name": "How much does commercial tenant representation cost?", "acceptedAnswer": { "@type": "Answer", "text": "In most cases, tenant representation is paid by the landlord as part of the leasing transaction. The tenant pays nothing directly. Your Office Space will confirm the fee structure upfront before any engagement begins." } },
              { "@type": "Question", "name": "What is a make-good clause in a commercial lease?", "acceptedAnswer": { "@type": "Answer", "text": "A make-good clause requires the tenant to restore the premises to its original condition at the end of the lease. Full reinstatement clauses can cost tens of thousands of dollars. Negotiating a fair wear and tear standard — or capping the obligation — is one of the most valuable things a tenant representative can do." } }
            ]
          }
        ]
      })}} />

      {/* ─── HERO ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Modern commercial workspace Newcastle"
          fill className="object-cover object-center" priority
        />
        <div className="absolute inset-0 bg-near-black/65" />
        <div
          className={`relative z-10 w-full ${WRAP}`}
          style={{ paddingLeft: PAD, paddingRight: PAD, paddingTop: 'clamp(5rem,12vw,13rem)', paddingBottom: 'clamp(4rem,10vw,9rem)' }}
        >
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-6">
              Newcastle · NSW · Australia
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black uppercase leading-[1.02] tracking-tight"
              style={{ fontSize: 'clamp(2.5rem,6.5vw,7rem)', maxWidth: '14ch', marginBottom: '1.75rem' }}>
              Your space.<br />Your terms.<br />Your team.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/70 font-light leading-relaxed"
              style={{ fontSize: 'clamp(1rem,2.5vw,1.15rem)', maxWidth: '34rem', lineHeight: 1.9, marginBottom: '2.25rem' }}>
              Most business owners spend more on their lease than they should, sign terms they don&apos;t understand, and manage
              three or four different contractors just to keep the lights on. We fix that — one team, completely on your side.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row gap-3">
              <BookingCTA label="Book a Free Call" variant="primary" size="lg" />
              <Link href="/lease-review"
                className="text-white/70 font-medium no-underline text-center hover:text-teal hover:border-teal transition-colors border border-white/30 inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] sm:w-auto w-full"
                style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                Free Lease Review →
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={340}>
            <div className="hidden md:grid grid-cols-4 gap-10 pt-10 border-t border-white/10" style={{ marginTop: 'clamp(4rem,10vw,9rem)' }}>
              {[
                { stat: '100+', label: 'Projects delivered' },
                { stat: 'Tenant-side only', label: 'We never represent landlords' },
                { stat: '12+ years', label: 'Commercial property experience' },
                { stat: 'Newcastle born', label: 'Local knowledge, national reach' },
              ].map(item => (
                <div key={item.stat}>
                  <p className="text-white font-black mb-2" style={{ fontSize: 'clamp(0.9rem,1.6vw,1.1rem)' }}>{item.stat}</p>
                  <p className="text-white/35 font-light" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── EMOTIONAL HOOK ──────────────────────── near-black */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(4rem,8vw,8rem)', paddingBottom: 'clamp(4rem,8vw,8rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <div style={{ maxWidth: '54rem' }}>
              <p className="text-teal font-black uppercase leading-none" style={{ fontSize: 'clamp(2rem,5vw,4.5rem)', marginBottom: '2rem', lineHeight: 1.05 }}>
                &ldquo;I had no idea the lease I signed was costing me that much.&rdquo;
              </p>
              <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', lineHeight: 1.9 }}>
                We hear this every week. A business owner signs what the landlord puts in front of them. Five years later
                they&apos;re paying above-market rent, facing a $180,000 make-good bill, and wondering how it got to this.
                It doesn&apos;t have to go that way.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── TESTIMONIALS — moved up, above services ─────── warm grey */}
      <section className="bg-warm-grey" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-3">What clients say</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mt-2 mb-12"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
              Real people.<br />Real outcomes.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="bg-white flex flex-col h-full" style={{ padding: 'clamp(1.5rem,4vw,2.5rem) clamp(1.25rem,3vw,2rem)' }}>
                  <Stars />
                  <p className="text-near-black font-light leading-relaxed flex-1 mt-8 mb-10"
                    style={{ fontSize: '1.05rem', lineHeight: 1.9 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: '1px solid #efefef', paddingTop: '1.5rem' }}>
                    <p className="text-near-black font-bold mb-1" style={{ fontSize: '0.9rem' }}>{t.name}</p>
                    <p className="text-charcoal font-medium mb-2" style={{ fontSize: '0.82rem' }}>{t.company}</p>
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
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.55)' }} />
        <div className="absolute inset-0 flex items-center" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.75rem,3.5vw,3.25rem)', maxWidth: '20ch' }}>
              The landlord has an expert working for them.<br />
              <span style={{ color: '#00B5A5' }}>Now you do too.</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── SERVICES ──────────────────────────────── white */}
      <section className="bg-white" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-3">What we do</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mt-2 mb-5"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
              Four services.<br />One relationship.
            </h2>
            <p className="text-charcoal font-light leading-relaxed mb-12" style={{ fontSize: '1.05rem', maxWidth: '40rem', lineHeight: 1.85 }}>
              Most businesses deal with five different advisors on a single office move. That&apos;s five invoices,
              five phone calls, five people pointing at each other when something goes wrong. We do it differently.
            </p>
          </FadeIn>

          <div>
            {SERVICES.map((s, i) => (
              <FadeIn key={s.href} delay={i * 60}>
                <Link href={s.href} className="group no-underline block"
                  style={{ borderTop: i === 0 ? '1px solid #e5e7eb' : undefined, borderBottom: '1px solid #e5e7eb', paddingTop: 'clamp(2rem,4vw,3rem)', paddingBottom: 'clamp(2rem,4vw,3rem)' }}>
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-6 mb-3">
                        <span className="text-teal font-bold flex-shrink-0" style={{ fontSize: '0.65rem', letterSpacing: '0.25em', minWidth: '2rem' }}>{s.num}</span>
                        <div>
                          <h3 className="text-near-black font-black uppercase leading-tight tracking-tight group-hover:text-teal transition-colors duration-200"
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
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.5)' }} />
        <div className="absolute inset-0 flex items-center justify-end" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight text-right" style={{ fontSize: 'clamp(1.75rem,3.5vw,3.25rem)', maxWidth: '22ch' }}>
              A space that works is one less thing<br />keeping you up at night.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHY US ────────────────────────────────── near-black */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-3">Why us</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mt-2 mb-10"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', maxWidth: '22ch' }}>
              Someone who actually<br />gives a damn.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: 'We never work for landlords', body: 'Every negotiation, every clause, every conversation — we are answering to you. Not the building owner, not a referral fee.' },
              { title: 'We have seen what goes wrong', body: 'Hundreds of projects. We know the traps in commercial leases, the gaps in fitout contracts, and what to push back on.' },
              { title: 'One call covers everything', body: 'Lease, fitout, furniture, cleaning. One relationship. We are the last business card you need for your workspace.' },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div style={{ padding: 'clamp(1.75rem,3.5vw,2.5rem) clamp(1.5rem,3vw,2rem)', background: 'rgba(255,255,255,0.06)', borderLeft: '3px solid #00B5A5' }}>
                  <h3 className="text-white font-black uppercase tracking-tight mb-4" style={{ fontSize: '1rem' }}>{p.title}</h3>
                  <p className="text-white/65 font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.8 }}>{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK 3 ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(24rem,40vw,34rem)' }}>
        <Image src={IMAGES.boardroom} alt="Modern Newcastle boardroom" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.45)' }} />
        <div className="absolute inset-0 flex items-end" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)', paddingBottom: 'clamp(2rem,5vw,4rem)' }}>
          <FadeIn>
            <p className="text-white font-light italic" style={{ fontSize: 'clamp(1rem,2vw,1.35rem)', maxWidth: '44rem', lineHeight: 1.8, borderLeft: '3px solid #00B5A5', paddingLeft: '1.5rem' }}>
              &ldquo;Joe was instrumental in building out our boardroom — high quality, practical advice, excellent detail.&rdquo;
              <br /><span className="text-teal font-semibold not-italic" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>— Nathan Franks, Dynamic Business Technologies</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── LEASEINTEL ────────────────────────────── teal */}
      <section className="bg-teal" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '46rem', margin: '0 auto' }}>
              <div className="inline-flex items-center gap-2 border border-white/30 mb-8" style={{ padding: '0.5rem 1.25rem' }}>
                <span className="bg-white rounded-full" style={{ width: '0.4rem', height: '0.4rem', flexShrink: 0 }} />
                <span className="text-white font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>New — LeaseIntel™</span>
              </div>
              <h2 className="text-white font-black uppercase leading-tight tracking-tight w-full"
                style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', marginBottom: '1.25rem' }}>
                Does your lease have a trap you haven&apos;t found yet?
              </h2>
              <p className="text-white/80 font-light leading-relaxed w-full"
                style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '0.75rem' }}>
                Most business owners don&apos;t read every clause. Most landlords know that.
              </p>
              <p className="text-white/80 font-light leading-relaxed w-full"
                style={{ fontSize: '1.05rem', lineHeight: 1.85, marginBottom: '2.5rem' }}>
                Answer 10 questions. Get a plain-English risk rating — Red, Amber, or Green — and the top issues to deal with. Free, instant, no document needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/lease-review"
                  className="bg-near-black text-white font-bold no-underline text-center hover:bg-near-black/80 transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Get Free Risk Check →
                </Link>
                <Link href="/lease-review#full-report"
                  className="text-white font-medium no-underline text-center hover:bg-white/20 transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', background: 'rgba(255,255,255,0.12)', borderRadius: '0.5rem' }}>
                  Full Report — $297
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── HOW WE WORK ───────────────────────── white */}
      <section className="bg-white" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn>
              <div>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-4">How it works</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', marginBottom: '1.5rem' }}>
                  A real conversation.<br />No obligation.
                </h2>
                <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                  The first call is just a conversation. No forms, no pitch, no pressure. We ask about your situation —
                  what you are trying to achieve, what&apos;s worrying you, what timeline you are working with.
                </p>
                <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.85 }}>
                  We will tell you honestly whether we can help and what it looks like. If we are not the right fit,
                  we will say so and point you somewhere better.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="flex flex-col gap-6">
                {[
                  { step: '01', title: 'We talk', body: 'A real conversation. No forms. No pressure. Just your situation.' },
                  { step: '02', title: 'We assess', body: 'Honest view of your options. What is realistic, what it costs, what you can expect.' },
                  { step: '03', title: 'We act', body: 'One team. One contact. Full accountability from the first meeting to the last invoice.' },
                  { step: '04', title: 'We stay', body: 'We do not disappear after the deal is done. Most clients come back for the next decision.' },
                ].map((item, i) => (
                  <FadeIn key={item.step} delay={i * 80}>
                    <div className="flex gap-6 items-start py-7 border-b border-gray-100">
                      <span className="text-teal font-black flex-shrink-0" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', minWidth: '2rem', paddingTop: '0.2rem' }}>{item.step}</span>
                      <div>
                        <p className="text-near-black font-black uppercase tracking-tight mb-2" style={{ fontSize: '1.15rem' }}>{item.title}</p>
                        <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.95rem', lineHeight: 1.75 }}>{item.body}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────── near-black */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-4">Get started</p>
              <h2 className="text-white font-black uppercase leading-tight tracking-tight w-full"
                style={{ fontSize: 'clamp(2rem,5vw,5rem)', marginBottom: '1.25rem' }}>
                Let&apos;s talk<br />about your space.
              </h2>
              <p className="text-white/50 font-light leading-relaxed w-full"
                style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                No obligation. No pitch. Tell us what you&apos;re working with and we&apos;ll give you a straight answer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', borderRadius: '0.5rem' }}>
                  Book a Free Call
                </a>
                <Link href="/contact"
                  className="text-white font-medium no-underline text-center hover:text-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px] w-full sm:w-auto"
                  style={{ padding: '1.25rem 3.5rem', fontSize: '0.72rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.5rem' }}>
                  Get in Touch
                </Link>
              </div>
              <p className="text-white/20 font-light mt-8" style={{ fontSize: '0.78rem' }}>
                <a href={`tel:${CONTACT.phone.replace(/\s/g,'')}`} className="text-white/30 no-underline hover:text-white/60 transition-colors">{CONTACT.phone}</a>
                {' · '}
                <a href="mailto:hello@yourofficespace.au" className="text-white/30 no-underline hover:text-white/60 transition-colors">hello@yourofficespace.au</a>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  )
}
