import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'
import { IMAGES } from '@/lib/images'

/* ─── Layout constants ───────────────────────────────────────── */
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = 'clamp(2rem, 10vw, 10rem)'

const SERVICES = [
  { num: '01', title: 'Tenant Representation', body: 'We represent the tenant — never the landlord. Every clause, every negotiation, every make-good obligation reviewed to protect your business.', href: '/tenant-rep' },
  { num: '02', title: 'Furniture & Fitout',    body: 'From brief to fully delivered workspace. Specified, coordinated and installed end to end. One team, no gaps.', href: '/furniture' },
  { num: '03', title: 'Buyers Agency',         body: 'Off-market access, rigorous due diligence, and hard negotiations for commercial property buyers across Australia.', href: '/buyers-agency' },
  { num: '04', title: 'Commercial Cleaning',   body: 'Commercial cleaning for offices, childcare, medical and industrial. Consistent, accountable, locally managed.', href: '/cleaning' },
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
            <h1 className="text-white font-black uppercase leading-none tracking-tight mb-8"
              style={{ fontSize: 'clamp(3rem,6vw,6.5rem)', maxWidth: '14ch' }}>
              Your workspace.<br />Our responsibility.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/65 font-light leading-relaxed mb-12"
              style={{ fontSize: '1.2rem', maxWidth: '34rem', lineHeight: 1.75 }}>
              Working exclusively for tenants and buyers.
              We never represent landlords — not once, not ever.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors"
                style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Book a Clarity Call
              </a>
              <Link href="/lease-review"
                className="text-white font-medium no-underline text-center hover:text-teal hover:border-teal transition-colors"
                style={{ padding: '1.1rem 2.5rem', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.3)' }}>
                Free Lease Review →
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={340}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-28 md:mt-36 pt-10 border-t border-white/10">
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
      <section className="bg-white" style={{ paddingTop: 'clamp(6rem,11vw,10rem)', paddingBottom: 'clamp(6rem,11vw,10rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-5">What we do</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-16"
              style={{ fontSize: 'clamp(2rem,3.5vw,3.5rem)' }}>
              One team.<br />Everything covered.
            </h2>
          </FadeIn>

          {/* Service list — each item is a full block row */}
          <div>
            {SERVICES.map((s, i) => (
              <FadeIn key={s.href} delay={i * 60}>
                <Link href={s.href} className="group no-underline block"
                  style={{ borderTop: i === 0 ? '1px solid #efefef' : undefined, borderBottom: '1px solid #efefef', padding: '2.75rem 0' }}>
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      {/* Number + Title row */}
                      <div className="flex items-baseline gap-6 mb-4">
                        <span className="text-teal font-bold flex-shrink-0"
                          style={{ fontSize: '0.65rem', letterSpacing: '0.25em', minWidth: '2rem' }}>
                          {s.num}
                        </span>
                        <h3 className="text-near-black font-black uppercase leading-tight tracking-tight group-hover:text-teal transition-colors duration-200"
                          style={{ fontSize: 'clamp(1.5rem,2.5vw,2.25rem)' }}>
                          {s.title}
                        </h3>
                      </div>
                      {/* Body below, indented to align with title */}
                      <div style={{ paddingLeft: 'calc(2rem + 1.5rem)' }}>
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
        </div>
      </section>

      {/* ─── IMAGE BREAK ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(18rem,35vw,28rem)' }}>
        <Image src={IMAGES.meeting} alt="Business meeting" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.5)' }} />
        <div className="absolute inset-0 flex items-center" style={{ paddingLeft: 'clamp(2rem,10vw,10rem)', paddingRight: 'clamp(2rem,10vw,10rem)' }}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight" style={{ fontSize: 'clamp(1.5rem,3vw,2.75rem)', maxWidth: '22ch' }}>
              Every decision we make is in your interest.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHY US ────────────────────────────────── near-black */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(6rem,11vw,10rem)', paddingBottom: 'clamp(6rem,11vw,10rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-5">Why us</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-16"
              style={{ fontSize: 'clamp(2rem,3.5vw,3.5rem)', maxWidth: '20ch' }}>
              We work for you.<br />Not the other side.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.07)' }}>
            {[
              { title: 'Tenant-side only', body: 'We never represent landlords or vendors. No split loyalty, no backdoor deals. Every decision is made in your interest.' },
              { title: '12+ years experience', body: 'Our team has delivered hundreds of commercial property projects across fitout, furniture, leasing and buyers agency. We know what goes wrong.' },
              { title: 'Start to finish', body: 'Lease, fitout, furniture, cleaning. One team, one relationship. Your business keeps moving while we manage the rest.' },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div className="bg-near-black" style={{ padding: '3.5rem 3rem' }}>
                  <div style={{ width: '2.5rem', height: '2px', background: '#00B5A5', marginBottom: '2rem' }} />
                  <h3 className="text-white font-black uppercase tracking-tight mb-5"
                    style={{ fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
                    {p.title}
                  </h3>
                  <p className="text-white/55 font-light leading-relaxed"
                    style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                    {p.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────── warm grey */}
      <section className="bg-warm-grey" style={{ paddingTop: 'clamp(6rem,11vw,10rem)', paddingBottom: 'clamp(6rem,11vw,10rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-5">What clients say</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-16"
              style={{ fontSize: 'clamp(2rem,3.5vw,3.5rem)' }}>
              Real people.<br />Real outcomes.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="bg-white flex flex-col h-full" style={{ padding: '3rem 2.5rem' }}>
                  <Stars />
                  <p className="text-near-black font-light leading-relaxed flex-1 mt-8 mb-10"
                    style={{ fontSize: '1.05rem', lineHeight: 1.85 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: '1px solid #efefef', paddingTop: '1.5rem' }}>
                    <p className="text-near-black font-bold mb-1" style={{ fontSize: '0.9rem' }}>{t.name}</p>
                    <p className="text-mid-grey font-light mb-2" style={{ fontSize: '0.78rem' }}>{t.company}</p>
                    <p className="text-teal font-semibold uppercase tracking-widest" style={{ fontSize: '0.62rem' }}>{t.service}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK ────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(18rem,35vw,28rem)' }}>
        <Image src={IMAGES.boardroom} alt="Modern office boardroom" fill className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.5)' }} />
        <div className="absolute inset-0 flex items-center justify-end" style={{ paddingLeft: 'clamp(2rem,10vw,10rem)', paddingRight: 'clamp(2rem,10vw,10rem)' }}>
          <FadeIn>
            <p className="text-white font-black uppercase leading-tight text-right" style={{ fontSize: 'clamp(1.5rem,3vw,2.75rem)', maxWidth: '20ch' }}>
              Spaces built around how your business works.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── LEASEINTEL ────────────────────────────── teal */}
      <section className="bg-teal" style={{ paddingTop: 'clamp(6rem,11vw,10rem)', paddingBottom: 'clamp(6rem,11vw,10rem)' }}>
        <div className={`${WRAP} text-center`} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <FadeIn>
            <div className="inline-flex items-center gap-2 border border-white/30 mb-10"
              style={{ padding: '0.5rem 1.25rem' }}>
              <span className="bg-white rounded-full" style={{ width: '0.4rem', height: '0.4rem', flexShrink: 0 }} />
              <span className="text-white font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>
                New — LeaseIntel™
              </span>
            </div>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-8 mx-auto"
              style={{ fontSize: 'clamp(2rem,3.5vw,3.5rem)', maxWidth: '22ch' }}>
              Is your lease costing you more than it should?
            </h2>
            <p className="text-white/80 font-light leading-relaxed mb-14 mx-auto"
              style={{ fontSize: '1.15rem', maxWidth: '34rem', lineHeight: 1.75 }}>
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

      {/* ─── CTA ───────────────────────────────────── dark, team-focused */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(6rem,11vw,10rem)', paddingBottom: 'clamp(6rem,11vw,10rem)' }}>
        <div className={WRAP} style={{ paddingLeft: PAD, paddingRight: PAD }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — workspace image */}
            <FadeIn>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={IMAGES.twoPersonMeet}
                  alt="Your Office Space team in consultation"
                  fill className="object-cover object-center"
                  style={{ filter: 'grayscale(15%)' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.5) 0%, transparent 60%)' }} />
              </div>
            </FadeIn>

            {/* Right — CTA text */}
            <FadeIn delay={120}>
              <div>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.3em', textTransform: 'uppercase' }} className="text-teal font-semibold mb-6">Get started</p>
                <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-8"
                  style={{ fontSize: 'clamp(2.5rem,5vw,5rem)' }}>
                  Let&apos;s talk about<br />your space.
                </h2>
                <p className="text-white/55 font-light leading-relaxed mb-12"
                  style={{ fontSize: '1.15rem', lineHeight: 1.8, maxWidth: '30rem' }}>
                  20 minutes. No pitch. Our team will give you a straight assessment of your situation and whether we can help.
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
