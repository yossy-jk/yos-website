import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'

/* ─── Layout system ──────────────────────────────────────────────
   WRAP: full-width section background
   INNER: max-w-5xl centered content with responsive side padding
   ─────────────────────────────────────────────────────────────── */
const INNER = 'max-w-5xl mx-auto px-6 md:px-10 lg:px-16'

const SERVICES = [
  {
    num: '01',
    title: 'Tenant Rep',
    tagline: 'Your lease. Your terms.',
    body: 'We sit on your side of the negotiating table — not the landlord\'s. Every clause, every incentive, every make-good obligation reviewed to protect your business.',
    href: '/tenant-rep',
  },
  {
    num: '02',
    title: 'Furniture & Fitout',
    tagline: 'Spaces that perform.',
    body: 'From brief to delivered workspace — specified, sourced, coordinated and installed. One point of contact from first conversation to final chair.',
    href: '/furniture',
  },
  {
    num: '03',
    title: 'Buyers Agency',
    tagline: 'Buy without getting burned.',
    body: 'Off-market access, rigorous due diligence, and hard negotiations for commercial property buyers in Newcastle and the Hunter Valley.',
    href: '/buyers-agency',
  },
  {
    num: '04',
    title: 'Cleaning',
    tagline: 'Shows up. Every time.',
    body: 'Commercial cleaning for offices, childcare centres, medical and industrial facilities. Consistent, accountable, and locally managed.',
    href: '/cleaning',
  },
]

export default function Home() {
  return (
    <>
      <Nav />

      {/* ── 1. HERO ─────────────────────────────────── dark image */}
      <section className="relative min-h-screen flex items-end bg-near-black">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Newcastle commercial office space"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/75" />

        <div className={`relative z-10 w-full ${INNER} pt-28 pb-20 md:pt-40 md:pb-32`}>
          <FadeIn>
            <p className="text-teal font-bold tracking-[0.3em] uppercase mb-8" style={{ fontSize: '0.65rem' }}>
              Newcastle &amp; Hunter Valley
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black uppercase leading-[1.05] tracking-tight mb-8 max-w-3xl"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
              Your workspace.<br />
              Our responsibility.<br />
              <span className="text-teal">From lease to clean.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/65 font-light leading-relaxed mb-12 max-w-xl"
              style={{ fontSize: '1.05rem' }}>
              Newcastle&apos;s only commercial property advisor working exclusively for tenants and buyers.
              We never work for landlords — not once, not ever.
            </p>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={HUBSPOT.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal text-white font-black rounded-sm hover:bg-dark-teal transition-colors duration-200 no-underline text-center"
                style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.1rem 2rem' }}
              >
                Book a Clarity Call
              </a>
              <Link
                href="/lease-review"
                className="text-white font-bold rounded-sm hover:text-teal transition-colors duration-200 no-underline text-center"
                style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.1rem 2rem', border: '1px solid rgba(255,255,255,0.35)' }}
              >
                Free Lease Review →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. PROOF BAR ────────────────────────────── white */}
      <section className="bg-white border-b border-gray-100">
        <div className={INNER}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
            {[
              { stat: '100+', label: 'Projects delivered across\nNewcastle & Hunter' },
              { stat: 'Tenant-side only', label: 'We never represent\nlandlords or vendors' },
              { stat: '12+ years', label: 'Newcastle commercial\nproperty experience' },
              { stat: 'Lease to clean', label: 'One team, one relationship,\nno handoffs' },
            ].map(item => (
              <div key={item.stat} className="text-center py-10 px-6">
                <p className="text-near-black font-black tracking-tight mb-2"
                  style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}>{item.stat}</p>
                <p className="text-mid-grey font-medium leading-snug"
                  style={{ fontSize: '0.7rem', whiteSpace: 'pre-line' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SERVICES ─────────────────────────────── near-black */}
      <section className="bg-near-black py-20 md:py-28">
        <div className={INNER}>
          <FadeIn>
            <p className="text-teal font-bold tracking-[0.3em] uppercase mb-5" style={{ fontSize: '0.65rem' }}>What we do</p>
            <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}>
              Everything your business needs.<br />One team.
            </h2>
            <p className="text-white/50 font-light leading-relaxed mb-12 max-w-xl" style={{ fontSize: '0.95rem' }}>
              Most businesses deal with five advisors across a single office move. We handle it all — one contact, no gaps, no handoffs.
            </p>
          </FadeIn>

          {/* Services grid — 2 col desktop, 1 col mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {SERVICES.map((service, i) => (
              <FadeIn key={service.title} delay={i * 60}>
                <Link
                  href={service.href}
                  className="group no-underline flex flex-col bg-near-black hover:bg-white/4 transition-colors duration-200 h-full"
                  style={{ padding: '2.25rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '0' }}
                >
                  <span className="text-teal font-black mb-4" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>{service.num}</span>
                  <p className="text-white font-black tracking-tight group-hover:text-teal transition-colors duration-200 mb-2"
                    style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)' }}>{service.title}</p>
                  <p className="text-teal font-bold tracking-widest uppercase mb-4" style={{ fontSize: '0.6rem' }}>{service.tagline}</p>
                  <p className="text-white/40 font-light leading-relaxed mb-6" style={{ fontSize: '0.85rem', flex: 1 }}>{service.body}</p>
                  <span className="text-teal/50 font-bold group-hover:text-teal transition-colors duration-200" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Learn more →</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY YOS ──────────────────────────────── white */}
      <section className="bg-white py-20 md:py-28">
        <div className={INNER}>
          {/* Two-column desktop layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left — heading + context + quote */}
            <FadeIn>
              <div>
                <p className="text-teal font-bold tracking-[0.3em] uppercase mb-5" style={{ fontSize: '0.65rem' }}>Why YOS</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-6"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                  We work for you.<br />Not the<br />other side.
                </h2>
                <p className="text-charcoal font-light leading-relaxed mb-10" style={{ fontSize: '0.95rem', maxWidth: '32rem' }}>
                  Most commercial property advisors work both sides of the deal. We don&apos;t. Our licence, our structure,
                  and our fee arrangement means we answer to one party only — you.
                </p>
                <blockquote className="border-l-4 border-teal pl-6" style={{ margin: 0 }}>
                  <p className="text-near-black font-light leading-relaxed italic mb-3" style={{ fontSize: '0.95rem' }}>
                    &ldquo;The agent across the table does this every day.
                    Most business owners do it once.
                    That experience gap costs real money.&rdquo;
                  </p>
                  <cite className="text-teal font-bold tracking-widest uppercase not-italic" style={{ fontSize: '0.6rem' }}>
                    Joe Kelley — Managing Director
                  </cite>
                </blockquote>
              </div>
            </FadeIn>

            {/* Right — three numbered points */}
            <div>
              {[
                {
                  num: '01',
                  label: 'Tenant-side only',
                  body: 'We never represent landlords or vendors. No split loyalty. No backdoor deals. When we negotiate, we negotiate for you — full stop.',
                },
                {
                  num: '02',
                  label: 'Newcastle embedded',
                  body: "Joe has spent his entire career in this market. The relationships, the off-market access, the agent network — built over a decade of real deals in Newcastle.",
                },
                {
                  num: '03',
                  label: 'Start to finish',
                  body: 'Lease to clean. One relationship from your first property decision through to the day your space is running — and beyond.',
                },
              ].map((point, i) => (
                <FadeIn key={point.label} delay={i * 100}>
                  <div className="flex gap-6 py-8 border-b border-gray-100">
                    <span className="text-teal font-black flex-shrink-0 leading-none"
                      style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1, opacity: 0.9 }}>
                      {point.num}
                    </span>
                    <div className="pt-1">
                      <p className="text-near-black font-black tracking-tight mb-3"
                        style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>{point.label}</p>
                      <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.875rem' }}>{point.body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. THE PIE ──────────────────────────────── warm-grey */}
      <section className="bg-warm-grey py-20 md:py-28">
        <div className={INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn>
              <div>
                <p className="text-teal font-bold tracking-[0.3em] uppercase mb-5" style={{ fontSize: '0.65rem' }}>The problem</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-6"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                  Every office move<br />has a budget.<br />Everyone wants a slice.
                </h2>
                <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.95rem' }}>
                  From the moment a relocation starts, up to 30 contractors, suppliers and agents all need to eat from the same pie.
                  The greedy ones take more than their share early — before you have a clear picture of where everything is going.
                  By the time quality drops at the back end, the budget is already gone.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div>
                <p className="text-charcoal font-light leading-relaxed mb-8" style={{ fontSize: '0.95rem' }}>
                  But the bigger problem isn&apos;t the money. It&apos;s you. Because someone had to step out of the business
                  to manage a process they were never built for. Sales meetings missed. Decisions made under pressure.
                  The thing funding the whole project — neglected.
                </p>
                <div className="border-l-4 border-teal pl-6">
                  <p className="text-near-black font-black leading-snug mb-4" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
                    We get in early — before the pie starts shrinking.
                  </p>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.875rem' }}>
                    Right space. Right terms. Right contractors. Managed from a position of trust, experience, and
                    zero conflict of interest. You stay focused on your business.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 6. LEASEINTEL ───────────────────────────── near-black */}
      <section className="bg-near-black py-20 md:py-28">
        <div className={INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <div>
                <div className="inline-flex items-center gap-2 mb-8"
                  style={{ border: '1px solid rgba(0,181,165,0.3)', padding: '0.4rem 0.85rem' }}>
                  <span className="bg-teal rounded-full flex-shrink-0" style={{ width: '0.4rem', height: '0.4rem' }} />
                  <span className="text-teal font-bold tracking-[0.3em] uppercase" style={{ fontSize: '0.6rem' }}>New — LeaseIntel™</span>
                </div>
                <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-5"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', borderLeft: '3px solid #00B5A5', paddingLeft: '1.25rem' }}>
                  Is your lease<br />costing you more<br />than it should?
                </h2>
                <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.95rem', maxWidth: '32rem' }}>
                  Most business owners sign commercial leases they don&apos;t fully understand.
                  LeaseIntel™ gives you a plain-English risk analysis of every clause — Red, Amber, or Green — before you sign. Or after.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <div>
                <div className="mb-8">
                  {[
                    { label: 'Free summary', detail: 'Overall risk rating + top 3 issues — instant' },
                    { label: 'Full report — $97', detail: 'All 12 risk categories + negotiation roadmap' },
                    { label: '24-hour turnaround', detail: 'Reviewed by Joe personally — not outsourced' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-4 py-5 border-b border-white/8">
                      <span className="text-teal font-black flex-shrink-0" style={{ fontSize: '1rem' }}>✓</span>
                      <div>
                        <p className="text-white font-bold mb-1" style={{ fontSize: '0.875rem' }}>{item.label}</p>
                        <p className="text-white/45 font-light" style={{ fontSize: '0.8rem' }}>{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/lease-review"
                    className="bg-teal text-white font-black rounded-sm hover:bg-dark-teal transition-colors no-underline text-center flex-1"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.1rem 2rem' }}>
                    Get Free Summary →
                  </Link>
                  <Link href="/lease-review"
                    className="text-white font-bold rounded-sm hover:text-teal transition-colors no-underline text-center flex-1"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.1rem 2rem', border: '1px solid rgba(255,255,255,0.3)' }}>
                    Full Report — $97
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ─────────────────────────── white */}
      <section className="bg-white py-20 md:py-28">
        <div className={INNER}>
          <FadeIn>
            <p className="text-teal font-bold tracking-[0.3em] uppercase mb-5" style={{ fontSize: '0.65rem' }}>What clients say</p>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-16"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}>
              Real people.<br />Real outcomes.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                name: 'Liz Murray',
                tag: 'Edge of Possibilities',
                service: 'Workplace Strategy',
                quote: 'Joe stands out because he takes the time to really listen and understand what you need. He asks thoughtful questions and builds genuine, lasting relationships. His approach makes the entire process collaborative and enjoyable.',
              },
              {
                name: 'Nathan Franks',
                tag: 'Dynamic Business Technologies',
                service: 'Furniture & Fitout',
                quote: 'Joe was particularly instrumental in building out our boardroom — delivering a high-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent attention to detail.',
              },
              {
                name: 'Sophie',
                tag: 'Jirsch Sutherland',
                service: 'Commercial Cleaning',
                quote: 'We are very happy with the service provided by Sarah and Joe. They are reliable and consistent, and go above and beyond to make sure all our cleaning needs are met.',
              },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="flex flex-col h-full">
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} style={{ width: '0.9rem', height: '0.9rem', color: '#EAB308', fill: 'currentColor' }} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-near-black font-light leading-relaxed mb-6 flex-1"
                    style={{ fontSize: '0.925rem' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-near-black font-black" style={{ fontSize: '0.875rem' }}>{t.name}</p>
                    <p className="text-mid-grey font-light" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{t.tag}</p>
                    <p className="text-teal font-bold tracking-widest uppercase" style={{ fontSize: '0.6rem', marginTop: '0.25rem' }}>{t.service}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. TOOLS TEASER ─────────────────────────── warm-grey */}
      <section className="bg-warm-grey py-16 md:py-20 border-t border-gray-200">
        <div className={INNER}>
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <p className="text-teal font-bold tracking-[0.3em] uppercase mb-4" style={{ fontSize: '0.65rem' }}>Free resources</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-3"
                  style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}>
                  Free tools. Better decisions.
                </h2>
                <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.875rem', maxWidth: '36rem' }}>
                  Cap rate calculator, lease comparison, purchase checklist and more. No sign-up required.
                </p>
              </div>
              <Link href="/resources"
                className="text-near-black font-black rounded-sm hover:text-teal hover:border-teal transition-colors no-underline text-center whitespace-nowrap flex-shrink-0"
                style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0.9rem 1.75rem', border: '1px solid #1A1A1A' }}>
                View all tools →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 9. CTA ──────────────────────────────────── near-black */}
      <section className="bg-near-black py-20 md:py-28">
        <div className={INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <FadeIn>
              <div>
                <h2 className="text-white font-black uppercase leading-tight tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', borderLeft: '3px solid #00B5A5', paddingLeft: '1.25rem' }}>
                  Speak to<br />Joe directly.
                </h2>
                <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.95rem', maxWidth: '28rem' }}>
                  20 minutes. No pitch. Just a straight conversation about your space and whether we can help.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="flex flex-col gap-4 lg:pt-4">
                <a
                  href={HUBSPOT.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal text-white font-black rounded-sm hover:bg-dark-teal transition-colors no-underline text-center block"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.25rem 2rem' }}>
                  Book a Clarity Call
                </a>
                <a
                  href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                  className="text-white font-bold rounded-sm hover:text-teal transition-colors no-underline text-center block"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.25rem 2rem', border: '1px solid rgba(255,255,255,0.3)' }}>
                  {CONTACT.phone}
                </a>
                <p className="text-white/30 font-light text-center" style={{ fontSize: '0.75rem' }}>
                  Or email <a href="mailto:jk@yourofficespace.au" className="text-white/50 hover:text-teal transition-colors no-underline">jk@yourofficespace.au</a>
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
