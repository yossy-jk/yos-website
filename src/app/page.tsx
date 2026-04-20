import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'
import { IMAGES } from '@/lib/images'

/* ─── Layout constants ───────────────────────────────────────── */
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = 'clamp(1.5rem,8vw,10rem)'

const SERVICES = [
  { num: '01', title: 'Tenant Representation', tagline: 'Your lease. Your terms.', body: 'We represent the tenant — never the landlord. Every clause, every negotiation, every make-good obligation reviewed to protect your business.', href: '/tenant-rep' },
  { num: '02', title: 'Furniture & Fitout',    tagline: 'Brief to delivered.', body: 'From brief to fully delivered workspace. Specified, coordinated and installed end to end. One team, no gaps.', href: '/furniture' },
  { num: '03', title: 'Buyers Agency',         tagline: 'Buy without getting burned.', body: 'Off-market access, rigorous due diligence, and hard negotiations for commercial property buyers across Australia.', href: '/buyers-agency' },
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
          style={{ paddingLeft: PAD, paddingRight: PAD, paddingTop: 'clamp(9rem,18vw,15rem)', paddingBottom: 'clamp(7rem,14vw,11rem)' }}
        >
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-8">
              Commercial Property Advisors — Australia
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black uppercase leading-[1.05] tracking-tight mb-8"
              style={{ fontSize: 'clamp(2.25rem,6vw,6.5rem)', maxWidth: '12ch' }}>
              Your workspace.<br />Our responsibility.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/65 font-light leading-relaxed mb-8"
              style={{ fontSize: '1rem', maxWidth: '34rem', lineHeight: 1.75 }}>
              Most commercial property decisions are made without anyone truly in your corner.
              We change that. One team, working only for you — from the first conversation to the day your space is running.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors"
                style={{ padding: '1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Book a Clarity Call
              </a>
              <Link href="/lease-review"
                className="text-white font-medium no-underline text-center hover:text-teal hover:border-teal transition-colors"
                style={{ padding: '1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.3)' }}>
                Free Lease Review →
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={340}>
            <div className="hidden md:grid grid-cols-4 gap-10 mt-36 pt-10 border-t border-white/10">
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
      <section className="bg-white" style={{ paddingTop: 'clamp(4rem,11vw,10rem)', paddingBottom: 'clamp(4rem,11vw,10rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-5">What we do</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-6"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
              Whatever your workspace<br />needs — we handle it.
            </h2>
            <p className="text-charcoal font-light leading-relaxed mb-14" style={{ fontSize: '1.1rem', maxWidth: '40rem', lineHeight: 1.75 }}>
              Most businesses deal with five different advisors on a single office move. We think that&apos;s too complicated. One relationship, from lease to clean.
            </p>
          </FadeIn>

          {/* Service list — each item is a full block row */}
          <div>
            {SERVICES.map((s, i) => (
              <FadeIn key={s.href} delay={i * 60}>
                <Link href={s.href} className="group no-underline block"
                  style={{ borderTop: i === 0 ? '1px solid #efefef' : undefined, borderBottom: '1px solid #efefef', paddingTop: 'clamp(1.75rem,4vw,2.75rem)', paddingBottom: 'clamp(1.75rem,4vw,2.75rem)' }}>
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
      <section className="bg-near-black" style={{ paddingTop: 'clamp(4rem,11vw,10rem)', paddingBottom: 'clamp(4rem,11vw,10rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-5">Why us</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-10 md:mb-16"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', maxWidth: '20ch' }}>
              Someone genuinely<br />in your corner.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-px" style={{ gap: '1px', background: 'rgba(255,255,255,0.07)' }}>
            {[
              { title: 'We only work for you', body: 'Never the landlord. Never the vendor. You are the only party we answer to.' },
              { title: 'We have done this before', body: 'Hundreds of projects. We know what goes wrong — and how to stop it happening to you.' },
              { title: 'One relationship, not five', body: 'Lease, fitout, furniture, cleaning. One call. One team. You focus on your business.' },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div className="bg-white md:bg-near-black" style={{ padding: '2rem 1.75rem' }}>
                  <div style={{ width: '3rem', height: '3px', background: '#00B5A5', marginBottom: '1.75rem' }} />
                  <h3 className="text-white font-black uppercase tracking-tight mb-5"
                    style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>
                    {p.title}
                  </h3>
                  <p className="text-white/60 font-light leading-relaxed"
                    style={{ fontSize: '1rem', lineHeight: 1.7 }}>
                    {p.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────── warm grey */}
      <section className="bg-warm-grey" style={{ paddingTop: 'clamp(4rem,11vw,10rem)', paddingBottom: 'clamp(4rem,11vw,10rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-5">What clients say</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-10 md:mb-16"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
              What clients say<br />about working with us.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className={`bg-white flex flex-col h-full ${i > 0 ? 'hidden md:flex' : ''}`} style={{ padding: '2.5rem 2rem' }}>
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
      <section className="bg-teal" style={{ paddingTop: 'clamp(4rem,11vw,10rem)', paddingBottom: 'clamp(4rem,11vw,10rem)' }}>
        <div className={`${WRAP} text-center`} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <div className="inline-flex items-center gap-2 border border-white/30 mb-8"
              style={{ padding: '0.5rem 1.25rem' }}>
              <span className="bg-white rounded-full" style={{ width: '0.4rem', height: '0.4rem', flexShrink: 0 }} />
              <span className="text-white font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>
                New — LeaseIntel™
              </span>
            </div>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-8 mx-auto"
              style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)', maxWidth: '22ch' }}>
              Is your lease costing you more than it should?
            </h2>
            <p className="text-white/80 font-light leading-relaxed mb-10 mx-auto"
              style={{ fontSize: '1rem', maxWidth: '34rem', lineHeight: 1.8 }}>
              Plain-English risk analysis. Every clause rated Red, Amber, or Green.
              Free summary — or a full report for $97.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/lease-review"
                className="bg-white text-teal font-bold no-underline text-center hover:bg-light-teal transition-colors"
                style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Get Free Summary →
              </Link>
              <Link href="/lease-review"
                className="text-white font-medium no-underline text-center hover:bg-white/10 transition-colors"
                style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.4)' }}>
                Full Report — $97
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* ─── HOW WE WORK ───────────────────────── white */}
      <section className="bg-white" style={{ paddingTop: 'clamp(4rem,11vw,10rem)', paddingBottom: 'clamp(4rem,11vw,10rem)' }}>
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn>
              <div>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-5">How it works</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-8"
                  style={{ fontSize: 'clamp(1.75rem,3.5vw,3.5rem)' }}>
                  A relationship,<br />not a transaction.
                </h2>
                <p className="text-charcoal font-light leading-relaxed mb-8" style={{ fontSize: '1rem', lineHeight: 1.8 }}>
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
                    <div className="flex gap-6 items-start py-6 border-b border-gray-100">
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

      {/* ─── CTA ───────────────────────────────────── dark, team-focused */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(4rem,11vw,10rem)', paddingBottom: 'clamp(4rem,11vw,10rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            {/* On mobile: text first, stat block second */}
            <FadeIn className="order-2 lg:order-1">
              <div className="flex flex-col justify-center">
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-8">
                  Commercial Property Advisors
                </p>
                <p className="text-white font-black uppercase leading-none tracking-tight"
                  style={{ fontSize: 'clamp(1.75rem,5vw,5rem)', lineHeight: 1.15 }}>
                  100+<br />projects<br />delivered.
                </p>
                <p className="text-white/30 font-light mt-6" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                  Lease negotiations. Fitout projects. Furniture packages. Cleaning contracts. One team, start to finish.
                </p>
              </div>
            </FadeIn>

            {/* Right on desktop, first on mobile */}
            <FadeIn delay={120} className="order-1 lg:order-2">
              <div>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-6">Get started</p>
                <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-8"
                  style={{ fontSize: 'clamp(1.75rem,4vw,4rem)' }}>
                  Let&apos;s have<br />a conversation.
                </h2>
                <p className="text-white/55 font-light leading-relaxed mb-12"
                  style={{ fontSize: '1rem', lineHeight: 1.8, maxWidth: '30rem' }}>
                  No obligation. No pitch. Tell us what you are working with and we will give you an honest view of your options. Most people find it useful even if they are not ready to move yet.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                    className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors"
                    style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Book a Clarity Call
                  </a>
                  <Link href="/contact"
                    className="text-white font-medium no-underline text-center hover:text-teal transition-colors"
                    style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.25)' }}>
                    Get in Touch
                  </Link>
                </div>
                <p className="text-white/25 font-light mt-10" style={{ fontSize: '0.8rem' }}>
                  <a href={`tel:${CONTACT.phone.replace(/\s/g,'')}`} className="text-white/35 no-underline hover:text-white/70 transition-colors">{CONTACT.phone}</a>
                  {' · '}
                  <a href="mailto:hello@yourofficespace.au" className="text-white/35 no-underline hover:text-white/70 transition-colors">hello@yourofficespace.au</a>
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
