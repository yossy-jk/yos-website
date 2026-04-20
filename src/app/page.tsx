import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'

/* WRAP: Unispace-standard margins — content sits in ~65% of viewport on large screens */
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = { paddingLeft: 'clamp(2rem, 10vw, 10rem)', paddingRight: 'clamp(2rem, 10vw, 10rem)' }

const SERVICES = [
  { num: '01', title: 'Tenant Representation', tagline: 'Your lease. Your terms.', href: '/tenant-rep' },
  { num: '02', title: 'Furniture & Fitout',    tagline: 'Brief to delivered workspace.', href: '/furniture' },
  { num: '03', title: 'Buyers Agency',         tagline: 'Buy without getting burned.', href: '/buyers-agency' },
  { num: '04', title: 'Commercial Cleaning',   tagline: 'Shows up. Every time.', href: '/cleaning' },
]

const TESTIMONIALS = [
  {
    name: 'Liz Murray', company: 'Edge of Possibilities', service: 'Workplace Strategy',
    quote: 'Joe takes the time to really listen and understand what you need. He asks thoughtful questions, builds genuine relationships, and makes the whole process feel collaborative.',
  },
  {
    name: 'Nathan Franks', company: 'Dynamic Business Technologies', service: 'Furniture & Fitout',
    quote: 'Joe was instrumental in building out our boardroom — delivering a high-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent detail.',
  },
  {
    name: 'Sophie', company: 'Jirsch Sutherland', service: 'Commercial Cleaning',
    quote: 'We are very happy with the service provided by Sarah and Joe. They are reliable, consistent, and go above and beyond to make sure all our cleaning needs are met.',
  },
]

function Stars() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} style={{ width: '0.8rem', height: '0.8rem', fill: '#EAB308' }} viewBox="0 0 20 20">
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

      {/* ── 1. HERO ─── dark · full screen */}
      <section className="relative min-h-screen flex items-center bg-near-black">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Modern commercial workspace"
          fill className="object-cover object-center" priority
        />
        <div className="absolute inset-0 bg-near-black/58" />

        <div className={`relative z-10 w-full ${WRAP}`} style={{ paddingTop: 'clamp(8rem,18vw,14rem)', paddingBottom: 'clamp(6rem,14vw,10rem)', paddingLeft: 'clamp(2rem, 10vw, 10rem)', paddingRight: 'clamp(2rem, 10vw, 10rem)' }}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-6" style={{ fontSize: '0.7rem' }}>
              Commercial Property Advisors — Australia
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black uppercase leading-none tracking-tight mb-8"
              style={{ fontSize: 'clamp(3rem, 6vw, 6.5rem)', maxWidth: '16ch' }}>
              Your workspace.<br />Our responsibility.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/65 font-light leading-relaxed mb-12"
              style={{ fontSize: '1.15rem', maxWidth: '36rem' }}>
              Working exclusively for tenants and buyers.
              We never represent landlords — not once, not ever.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors duration-200"
                style={{ padding: '1.05rem 2.25rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Book a Clarity Call
              </a>
              <Link href="/lease-review"
                className="text-white font-medium no-underline text-center hover:border-teal hover:text-teal transition-colors duration-200"
                style={{ padding: '1.05rem 2.25rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.3)' }}>
                Free Lease Review →
              </Link>
            </div>
          </FadeIn>

          {/* Proof stats — anchored bottom of hero */}
          <FadeIn delay={340}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 md:mt-32 pt-10 border-t border-white/10">
              {[
                { stat: '100+',           label: 'Projects delivered' },
                { stat: 'Tenant-only',    label: 'Zero conflicts of interest' },
                { stat: '12+ years',      label: 'Industry experience' },
                { stat: 'Lease to clean', label: 'One team, no handoffs' },
              ].map(item => (
                <div key={item.stat}>
                  <p className="text-white font-black mb-1" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)' }}>{item.stat}</p>
                  <p className="text-white/35 font-light" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. SERVICES ─── white · numbered list (zimple.digital style) */}
      <section className="bg-white" style={{ paddingTop: 'clamp(6rem, 11vw, 10rem)', paddingBottom: 'clamp(6rem, 11vw, 10rem)' }}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.7rem' }}>What we do</p>
            <h2 className="text-near-black font-black uppercase leading-none tracking-tight mb-10"
              style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.75rem)' }}>
              One team. Everything covered.
            </h2>
          </FadeIn>

          <div style={{ borderTop: '1px solid #f3f4f6' }}>
            {SERVICES.map((s, i) => (
              <FadeIn key={s.href} delay={i * 60}>
                <Link href={s.href}
                  className="group flex items-center justify-between no-underline transition-colors duration-200"
                  style={{ padding: '1.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div className="flex items-center gap-6 md:gap-10">
                    <span className="text-teal font-bold flex-shrink-0"
                      style={{ fontSize: '0.68rem', letterSpacing: '0.2em', minWidth: '1.75rem' }}>
                      {s.num}
                    </span>
                    <span className="text-near-black font-black uppercase leading-none tracking-tight group-hover:text-teal transition-colors duration-200"
                      style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.75rem)' }}>
                      {s.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0 ml-4">
                    <span className="text-mid-grey font-light hidden md:block" style={{ fontSize: '0.85rem' }}>
                      {s.tagline}
                    </span>
                    <span className="text-teal font-bold group-hover:translate-x-2 transition-transform duration-200"
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

      {/* ── 3. WHY US ─── near-black · clean 3-column cards */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(6rem, 11vw, 10rem)', paddingBottom: 'clamp(6rem, 11vw, 10rem)' }}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.7rem' }}>Why us</p>
            <h2 className="text-white font-black uppercase leading-none tracking-tight mb-12"
              style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.75rem)' }}>
              We work for you. Not the other side.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {[
              { title: 'Tenant-side only', body: 'We never represent landlords or vendors. No split loyalty. No backdoor deals. Pure representation in your interest.' },
              { title: '12+ years experience', body: 'Real deals across commercial property, fitout and workplace strategy. On the ground wherever you need us.' },
              { title: 'Start to finish', body: 'Lease, fitout, furniture, cleaning. One relationship, one team, no gaps and no handoffs.' },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 80}>
                <div className="bg-near-black" style={{ padding: '2.5rem 2.5rem' }}>
                  <div className="w-8 h-px bg-teal mb-6" />
                  <h3 className="text-white font-black uppercase tracking-tight mb-4" style={{ fontSize: '1rem' }}>{p.title}</h3>
                  <p className="text-white/45 font-light leading-relaxed" style={{ fontSize: '0.85rem' }}>{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={200}>
            <div className="mt-16 md:mt-20 pt-10 border-t border-white/8">
              <p className="text-white/50 font-light leading-relaxed italic" style={{ fontSize: '1rem', maxWidth: '44rem' }}>
                &ldquo;The agent across the table does this every day. Most business owners do it once. That experience gap costs real money.&rdquo;
              </p>
              <p className="text-teal font-semibold uppercase tracking-[0.25em] mt-4" style={{ fontSize: '0.62rem' }}>
                Joe Kelley — Managing Director
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 4. TESTIMONIALS ─── warm-grey */}
      <section className="bg-warm-grey" style={{ paddingTop: 'clamp(6rem, 11vw, 10rem)', paddingBottom: 'clamp(6rem, 11vw, 10rem)' }}>
        <div className={WRAP} style={PAD}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-4" style={{ fontSize: '0.7rem' }}>What clients say</p>
            <h2 className="text-near-black font-black uppercase leading-none tracking-tight mb-12"
              style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.75rem)' }}>
              Real people. Real outcomes.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="bg-white flex flex-col" style={{ padding: '2.5rem 2.25rem' }}>
                  <Stars />
                  <p className="text-near-black font-light leading-relaxed flex-1 mt-6 mb-8"
                    style={{ fontSize: '0.95rem' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem' }}>
                    <p className="text-near-black font-bold" style={{ fontSize: '0.875rem' }}>{t.name}</p>
                    <p className="text-mid-grey font-light mt-0.5" style={{ fontSize: '0.75rem' }}>{t.company}</p>
                    <p className="text-teal font-semibold uppercase tracking-widest mt-1" style={{ fontSize: '0.6rem' }}>{t.service}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. LEASEINTEL ─── teal · single accent section */}
      <section className="bg-teal" style={{ paddingTop: 'clamp(6rem, 11vw, 10rem)', paddingBottom: 'clamp(6rem, 11vw, 10rem)' }}>
        <div className={`${WRAP} text-center`} style={PAD}>
          <FadeIn>
            <div className="inline-flex items-center gap-2 border border-white/30 mb-10"
              style={{ padding: '0.45rem 1rem' }}>
              <span className="bg-white rounded-full flex-shrink-0" style={{ width: '0.35rem', height: '0.35rem' }} />
              <span className="text-white font-semibold uppercase tracking-[0.3em]" style={{ fontSize: '0.65rem' }}>
                New — LeaseIntel™
              </span>
            </div>
            <h2 className="text-white font-black uppercase leading-none tracking-tight mb-6 mx-auto"
              style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.75rem)', maxWidth: '26ch' }}>
              Is your lease costing you more than it should?
            </h2>
            <p className="text-white/75 font-light leading-relaxed mb-12 mx-auto"
              style={{ fontSize: '1.1rem', maxWidth: '36rem' }}>
              Plain-English risk analysis. Every clause rated Red, Amber, or Green.
              Free summary — or full report for $97.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/lease-review"
                className="bg-white text-teal font-bold no-underline text-center hover:bg-light-teal transition-colors duration-200"
                style={{ padding: '1.05rem 2.25rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Get Free Summary →
              </Link>
              <Link href="/lease-review"
                className="text-white font-medium no-underline text-center hover:bg-white/10 transition-colors duration-200"
                style={{ padding: '1.05rem 2.25rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.4)' }}>
                Full Report — $97
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. CTA ─── dark · centered · simple */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(7rem, 13vw, 12rem)', paddingBottom: 'clamp(7rem, 13vw, 12rem)' }}>
        <div className={`${WRAP} text-center`} style={PAD}>
          <FadeIn>
            <h2 className="text-white font-black uppercase leading-none tracking-tight mb-8 mx-auto"
              style={{ fontSize: 'clamp(4rem, 9vw, 10rem)' }}>
              Talk to us.
            </h2>
            <p className="text-white/45 font-light leading-relaxed mb-12 mx-auto"
              style={{ fontSize: '1.15rem', maxWidth: '24rem' }}>
              20 minutes. No pitch.<br />Just a straight conversation.
            </p>
            <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-teal text-white font-bold no-underline hover:bg-dark-teal transition-colors duration-200"
              style={{ padding: '1.15rem 2.75rem', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Book a Clarity Call
            </a>
            <p className="text-white/20 font-light mt-10" style={{ fontSize: '0.8rem' }}>
              <a href={`tel:${CONTACT.phone.replace(/\s/g,'')}`} className="text-white/30 no-underline hover:text-white/60 transition-colors">{CONTACT.phone}</a>
              {' · '}
              <a href="mailto:jk@yourofficespace.au" className="text-white/30 no-underline hover:text-white/60 transition-colors">jk@yourofficespace.au</a>
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  )
}
