import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'
import { IMAGES } from '@/lib/images'

export const metadata: Metadata = {
  title: 'Your Office Space | Tenant-Side Commercial Property Advisory',
  description: 'One team working only for you. Tenant representation, buyers agency, furniture & fitout, and commercial cleaning. Honest advice. Real outcomes.',
  openGraph: {
    title: 'Your Office Space | Tenant-Side Commercial Property Advisory',
    description: 'One team working only for you — from the first conversation to the day your space is running.',
    url: 'https://yourofficespace.au',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

/* ─── Layout constants ───────────────────────────────────────── */
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = 'clamp(1.5rem,8vw,10rem)'

const SERVICES = [
  { num: '01', title: 'Tenant Representation', tagline: 'Your lease. Your terms.', body: 'We represent the tenant — never the landlord. Every clause, every negotiation, every make-good obligation reviewed to protect your business.', href: '/tenant-rep' },
  { num: '02', title: 'Buyers Agency',         tagline: 'Buy without getting burned.', body: 'Off-market access, rigorous due diligence, and hard negotiations for commercial property buyers across Australia.', href: '/buyers-agency' },
  { num: '03', title: 'Furniture & Fitout',    tagline: 'Brief to delivered.', body: 'From brief to fully delivered workspace. Specified, coordinated and installed end to end. One team, no gaps.', href: '/furniture' },
  { num: '04', title: 'Commercial Cleaning',   tagline: 'Shows up. Every time.', body: 'Commercial cleaning for offices, childcare, medical and industrial. Consistent, accountable, locally managed.', href: '/cleaning' },
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

      {/* ─── HERO ──────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Modern commercial workspace"
          fill className="object-cover object-center" priority
        />
        <div className="absolute inset-0 bg-near-black/55" />
        <div
          className={`relative z-10 w-full ${WRAP}`}
          style={{ paddingLeft: PAD, paddingRight: PAD, paddingTop: 'clamp(5rem,12vw,13rem)', paddingBottom: 'clamp(4rem,10vw,9rem)' }}
        >
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-6">
              Commercial Property Advisors — Australia
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black uppercase leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2.25rem,6vw,6.5rem)', maxWidth: '12ch', marginBottom: '1.5rem' }}>
              Your workspace.<br />Our responsibility.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/65 font-light leading-relaxed"
              style={{ fontSize: '1rem', maxWidth: '32rem', lineHeight: 1.75, marginBottom: '2rem' }}>
              One team, working only for you — from the first conversation to the day your space is running.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px]"
                style={{ padding: '0 2.75rem', fontSize: '0.72rem' }}>
                Book a Clarity Call
              </a>
              <Link href="/lease-review"
                className="text-white/70 font-medium no-underline text-center hover:text-teal hover:border-teal transition-colors border border-white/30 inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px]"
                style={{ padding: '0 2.75rem', fontSize: '0.72rem' }}>
                Free Lease Review →
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={340}>
            <div className="hidden md:grid grid-cols-4 gap-10 pt-10 border-t border-white/10" style={{ marginTop: 'clamp(4rem,10vw,9rem)' }}>
              {[
                { stat: '100+', label: 'Projects delivered' },
                { stat: 'In Your Corner', label: 'Every project. Every client.' },
                { stat: '12+ years', label: 'Industry experience' },
                { stat: 'Lease to clean', label: 'One team, no handoffs' },
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
              Most businesses deal with five different advisors on a single office move. We think that&apos;s too complicated. One relationship, from lease to clean.
            </p>
          </FadeIn>

          {/* Service list — each item is a full block row */}
          <div>
            {SERVICES.map((s, i) => (
              <FadeIn key={s.href} delay={i * 60}>
                <Link href={s.href} className="group no-underline block"
                  style={{ borderTop: i === 0 ? '1px solid #e5e7eb' : undefined, borderBottom: '1px solid #e5e7eb', paddingTop: 'clamp(2rem,4vw,3rem)', paddingBottom: 'clamp(2rem,4vw,3rem)' }}>
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      {/* Number + Title row */}
                      <div className="flex items-baseline gap-6 mb-4">
                        <span className="text-teal font-bold flex-shrink-0"
                          style={{ fontSize: '0.65rem', letterSpacing: '0.25em', minWidth: '2rem' }}>
                          {s.num}
                        </span>
                        <h3 className="text-near-black font-black uppercase leading-tight tracking-tight group-hover:text-teal transition-colors duration-200"
                          style={{ fontSize: 'clamp(1.25rem,2.5vw,2.25rem)' }}>
                          {s.title}
                        </h3>
                      </div>
                      {/* Body below, indented to align with title */}
                      <div className="pl-0 md:pl-14">
                        <p className="text-charcoal font-light leading-relaxed"
                          style={{ fontSize: '1rem', lineHeight: 1.75, maxWidth: '42rem' }}>
                          {s.body}
                        </p>
                      </div>
                    </div>
                    <span className="text-teal/40 font-bold flex-shrink-0 group-hover:text-teal group-hover:translate-x-2 transition-all duration-200 mt-1"
                      style={{ fontSize: '1.25rem' }}>
                      →
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <div className="md:hidden mt-8 text-center">
            <Link href="/blog"
              className="text-teal font-bold uppercase tracking-widest no-underline hover:text-dark-teal transition-colors"
              style={{ fontSize: '0.72rem' }}
            >
              Read more client stories →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(18rem,35vw,28rem)' }}>
        <Image src={IMAGES.meeting} alt="Business meeting" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.5)' }} />
        <div className="absolute inset-0 flex items-center" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.5rem,3vw,2.75rem)', maxWidth: '22ch' }}>
              We pick up the phone. We show up. We deliver.
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
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', maxWidth: '20ch' }}>
              Someone genuinely<br />in your corner.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: 'We only work for you', body: 'Never the landlord. Never the vendor. You are the only party we answer to.' },
              { title: 'We have done this before', body: 'Hundreds of projects. We know what goes wrong — and how to stop it happening to you.' },
              { title: 'One relationship, not five', body: 'Lease, fitout, furniture, cleaning. One call. One team. You focus on your business.' },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div style={{ padding: 'clamp(1.75rem,3.5vw,2.5rem) clamp(1.5rem,3vw,2rem)', background: 'rgba(255,255,255,0.06)', borderLeft: '3px solid #00B5A5' }}>
                  <h3 className="text-white font-black uppercase tracking-tight mb-4"
                    style={{ fontSize: '1rem' }}>
                    {p.title}
                  </h3>
                  <p className="text-white/65 font-light leading-relaxed"
                    style={{ fontSize: '0.95rem', lineHeight: 1.75 }}>
                    {p.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────── warm grey */}
      <section className="bg-warm-grey" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-3">What clients say</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mt-2 mb-12"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
              Straight from<br />the people we work with.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="bg-white flex flex-col h-full" style={{ padding: 'clamp(1.5rem,4vw,2.5rem) clamp(1.25rem,3vw,2rem)' }}>
                  <Stars />
                  <p className="text-near-black font-light leading-relaxed flex-1 mt-8 mb-10"
                    style={{ fontSize: '1.05rem', lineHeight: 1.85 }}>
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
          <div className="md:hidden mt-8 text-center">
            <Link href="/blog"
              className="text-teal font-bold uppercase tracking-widest no-underline hover:text-dark-teal transition-colors"
              style={{ fontSize: '0.72rem' }}
            >
              Read more client stories →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(18rem,35vw,28rem)' }}>
        <Image src={IMAGES.boardroom} alt="Modern office boardroom" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.5)' }} />
        <div className="absolute inset-0 flex items-center justify-end" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight text-right" style={{ fontSize: 'clamp(1.5rem,3vw,2.75rem)', maxWidth: '20ch' }}>
              Spaces built around how your business works.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── LEASEINTEL ────────────────────────────── teal */}
      <section className="bg-teal" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
              <div className="inline-flex items-center gap-2 border border-white/30 mb-8"
                style={{ padding: '0.5rem 1.25rem' }}>
                <span className="bg-white rounded-full" style={{ width: '0.4rem', height: '0.4rem', flexShrink: 0 }} />
                <span className="text-white font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>
                  New — LeaseIntel™
                </span>
              </div>
              <h2 className="text-white font-black uppercase leading-tight tracking-tight w-full"
                style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', marginBottom: '1.5rem' }}>
                Is your lease costing you more than it should?
              </h2>
              <p className="text-white/80 font-light leading-relaxed w-full"
                style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                Plain-English risk analysis. Every clause rated Red, Amber, or Green. Free summary — or a full report for $97.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/lease-review"
                  className="bg-near-black text-white font-bold no-underline text-center hover:bg-near-black/80 transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px]"
                  style={{ padding: '0 2.5rem', fontSize: '0.72rem', minWidth: '14rem' }}>
                  Get Free Summary →
                </Link>
                <Link href="/lease-review#full-report"
                  className="text-white font-medium no-underline text-center hover:bg-white/20 transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px]"
                  style={{ padding: '0 2.5rem', fontSize: '0.72rem', background: 'rgba(255,255,255,0.12)', minWidth: '14rem' }}>
                  Full Report — $97
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
                  A relationship,<br />not a transaction.
                </h2>
                <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  The first call is just a conversation. We ask about your situation — what you are trying to achieve, what is worrying you, what timeline you are working with. No forms to fill in. No obligation.
                </p>
                <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                  From there, we tell you honestly whether we can help and what that looks like. Some clients need one service. Others need the whole team. Either way, you will know exactly where you stand.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="flex flex-col gap-6">
                {[
                  { step: '01', title: 'We talk', body: 'A real conversation. No forms. No pressure.' },
                  { step: '02', title: 'We assess', body: 'Honest options. What is realistic, what it costs, what you can expect.' },
                  { step: '03', title: 'We act', body: 'One team. One contact. Full accountability from day one.' },
                  { step: '04', title: 'We stay', body: 'We do not disappear. Most clients come back for the next decision.' },
                ].map((item, i) => (
                  <FadeIn key={item.step} delay={i * 80}>
                    <div className="flex gap-6 items-start py-7 border-b border-gray-100">
                      <span className="text-teal font-black flex-shrink-0" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', minWidth: '2rem', paddingTop: '0.2rem' }}>{item.step}</span>
                      <div>
                        <p className="text-near-black font-black uppercase tracking-tight mb-2" style={{ fontSize: '1.15rem', letterSpacing: '-0.01em' }}>{item.title}</p>
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

      {/* ─── CTA ───────────────────────────────────── dark, clean, centred */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-4">
                Get started
              </p>
              <h2 className="text-white font-black uppercase leading-tight tracking-tight w-full"
                style={{ fontSize: 'clamp(2rem,5vw,5rem)', marginBottom: '1.25rem' }}>
                Let&apos;s have<br />a conversation.
              </h2>
              <p className="text-white/50 font-light leading-relaxed w-full"
                style={{ fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                No obligation. No pitch. Tell us what you&apos;re working with — we&apos;ll give you an honest view.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px]"
                  style={{ padding: '0 2.75rem', fontSize: '0.72rem', minWidth: '16rem' }}>
                  Book a Clarity Call
                </a>
                <Link href="/contact"
                  className="text-white font-medium no-underline text-center hover:text-teal transition-colors inline-flex items-center justify-center uppercase tracking-[0.14em] min-h-[52px]"
                  style={{ padding: '0 2.75rem', fontSize: '0.72rem', border: '1px solid rgba(255,255,255,0.2)', minWidth: '16rem' }}>
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
