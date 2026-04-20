import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'

/* ─── Shared wrapper — consistent padding across all sections ─── */
/* Uses inline style to guarantee padding renders on all devices   */
const INNER = "max-w-3xl mx-auto w-full"
const SECTION_PAD = { padding: '0 clamp(2.5rem, 8vw, 6rem)' }

const SERVICES = [
  { title: 'Tenant Rep', tagline: 'Your lease. Your terms.', body: 'We represent the tenant — never the landlord. Pure negotiation in your interest.', href: '/tenant-rep' },
  { title: 'Furniture & Fitout', tagline: 'Spaces that perform.', body: 'From brief to fully delivered workspace — specified, coordinated and installed end-to-end.', href: '/furniture' },
  { title: 'Buyers Agency', tagline: 'Buy without getting burned.', body: 'Off-market access, hard negotiations, and due diligence handled by Newcastle specialists.', href: '/buyers-agency' },
  { title: 'Cleaning', tagline: 'Shows up. Every time.', body: 'Commercial cleaning for offices and facilities. Consistent, accountable, Newcastle-based.', href: '/cleaning' },
]

export default function Home() {
  return (
    <>
      <Nav />

      {/* ── 1. HERO ─────────────────────────── dark image */}
      <section className="relative min-h-screen flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Newcastle commercial office space"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/78" />

        <div className="relative z-10 w-full" style={{ padding: '0 clamp(2.5rem, 8vw, 6rem) clamp(4rem, 12vw, 9rem)' }}>
          <div className="max-w-3xl">
            <FadeIn delay={0}>
              <p className="text-teal font-bold tracking-[0.3em] uppercase mb-8"
                style={{ fontSize: '0.65rem' }}>
                Newcastle &amp; Hunter Valley
              </p>
            </FadeIn>
            <FadeIn delay={100}>
              <h1
                className="text-white font-black uppercase leading-[1.05] tracking-tight mb-8"
                style={{ fontSize: 'clamp(2.2rem, 6vw, 5.5rem)' }}
              >
                One team.<br />
                One relationship.<br />
                <span className="text-teal">One outcome.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-white/65 font-light leading-relaxed mb-10"
                style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', maxWidth: '38rem' }}>
                Newcastle&apos;s only commercial property advisor working exclusively for tenants and buyers.
                We never work for landlords.
              </p>
            </FadeIn>
            <FadeIn delay={300}>
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
        </div>
      </section>

      {/* ── 2. PROOF BAR ────────────────────── white */}
      <section className="bg-white" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className={INNER} style={SECTION_PAD}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {[
              { stat: '100+', label: 'Projects delivered' },
              { stat: 'Tenant-side only', label: 'Zero conflicts' },
              { stat: 'Newcastle & Hunter', label: 'Exclusively local' },
              { stat: 'Lease to clean', label: 'One team end-to-end' },
            ].map(item => (
              <div key={item.stat} className="bg-white text-center" style={{ padding: '1.75rem 1rem' }}>
                <p className="text-near-black font-black tracking-tight" style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1rem)', marginBottom: '0.35rem' }}>{item.stat}</p>
                <p className="text-mid-grey font-medium tracking-wide" style={{ fontSize: '0.65rem' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SERVICES ─────────────────────── near-black */}
      <section className="bg-near-black" style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 0' }}>
        <div className={INNER} style={SECTION_PAD}>
          <FadeIn>
            <p className="text-teal font-bold tracking-[0.3em] uppercase mb-5" style={{ fontSize: '0.65rem' }}>What we do</p>
            <h2
              className="text-white font-black uppercase leading-tight tracking-tight"
              style={{ fontSize: 'clamp(1.7rem, 5vw, 3.2rem)', marginBottom: '0.75rem' }}
            >
              Every part of the<br />workspace problem.<br />One team.
            </h2>
            <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.9rem', maxWidth: '32rem', marginBottom: '2rem' }}>
              Tenant representation, fitout, buyers agency, and cleaning — all under one roof.
            </p>
          </FadeIn>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {SERVICES.map((service, i) => (
              <FadeIn key={service.title} delay={i * 60}>
                <Link
                  href={service.href}
                  className="group no-underline flex items-start justify-between gap-6"
                  style={{ padding: '1.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex gap-5 items-start flex-1">
                    <span className="text-teal font-black flex-shrink-0" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', marginTop: '0.25rem', width: '1.5rem' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-white font-black tracking-tight group-hover:text-teal transition-colors duration-200" style={{ fontSize: 'clamp(1.05rem, 3vw, 1.4rem)', marginBottom: '0.3rem' }}>{service.title}</p>
                      <p className="text-teal font-bold tracking-widest uppercase" style={{ fontSize: '0.6rem', marginBottom: '0.5rem' }}>{service.tagline}</p>
                      <p className="text-white/40 font-light leading-relaxed" style={{ fontSize: '0.82rem' }}>{service.body}</p>
                    </div>
                  </div>
                  <span className="text-teal/40 font-bold flex-shrink-0 group-hover:text-teal transition-colors duration-200" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>→</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY YOS ──────────────────────── white */}
      <section className="bg-white" style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 0' }}>
        <div className={INNER} style={SECTION_PAD}>
          <FadeIn>
            <p className="text-teal font-bold tracking-[0.3em] uppercase mb-5" style={{ fontSize: '0.65rem' }}>Why YOS</p>
            <h2
              className="text-near-black font-black uppercase leading-tight tracking-tight"
              style={{ fontSize: 'clamp(1.7rem, 5vw, 3.2rem)', marginBottom: '0.75rem' }}
            >
              No conflicts.<br />No shortcuts.<br />No split loyalty.
            </h2>
            <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.9rem', maxWidth: '32rem', marginBottom: '2rem' }}>
              Most commercial property advisors work both sides of the deal. We don&apos;t.
              Every decision we make is in your interest.
            </p>
          </FadeIn>

          {[
            { num: '01', label: 'Tenant-side only', body: 'We never represent landlords or vendors. No split loyalty. No backdoor deals. When we negotiate, we negotiate for you.' },
            { num: '02', label: 'Newcastle-first', body: "We live and work here. We know which landlords play fair and which ones don't. That knowledge is worth more than any Sydney firm's database." },
            { num: '03', label: 'End-to-end', body: 'Lease to clean. One relationship, one accountable team from your first property decision through to the day your space is running.' },
          ].map((point, i) => (
            <FadeIn key={point.label} delay={i * 80}>
              <div className="flex gap-6" style={{ padding: '1.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <span className="text-teal font-black flex-shrink-0" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', lineHeight: 1, width: '3rem' }}>{point.num}</span>
                <div style={{ paddingTop: '0.25rem' }}>
                  <p className="text-near-black font-black tracking-tight" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', marginBottom: '0.5rem' }}>{point.label}</p>
                  <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.85rem', maxWidth: '28rem' }}>{point.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── 5. LEASEINTEL ───────────────────── near-black */}
      <section className="bg-near-black" style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 0' }}>
        <div className={INNER} style={SECTION_PAD}>
          <FadeIn>
            <div className="inline-flex items-center gap-2 mb-8" style={{ border: '1px solid rgba(0,181,165,0.3)', padding: '0.4rem 0.85rem' }}>
              <span className="bg-teal rounded-full flex-shrink-0" style={{ width: '0.4rem', height: '0.4rem' }} />
              <span className="text-teal font-bold tracking-[0.3em] uppercase" style={{ fontSize: '0.6rem' }}>New — LeaseIntel™</span>
            </div>
            <h2
              className="text-white font-black uppercase leading-tight tracking-tight"
              style={{ fontSize: 'clamp(1.7rem, 5vw, 3.2rem)', marginBottom: '0.75rem', borderLeft: '3px solid #00B5A5', paddingLeft: '1.25rem' }}
            >
              Is your lease costing<br />you more than<br />it should?
            </h2>
            <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.9rem', maxWidth: '32rem', marginBottom: '2.5rem' }}>
              LeaseIntel™ gives you a complete plain-English risk analysis — every clause rated Red, Amber, or Green — before you sign. Or after.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ marginBottom: '1.75rem' }}>
              {[
                'Free summary: overall risk rating + top 3 issues — instant',
                'Full report: all 12 risk categories + negotiation roadmap — $97',
                '24-hour turnaround · Reviewed by Joe personally',
              ].map(item => (
                <div key={item} className="flex items-start gap-3" style={{ marginBottom: '0.85rem' }}>
                  <span className="text-teal font-black flex-shrink-0" style={{ fontSize: '0.9rem', marginTop: '0.1rem' }}>✓</span>
                  <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: '0.85rem' }}>{item}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="flex flex-col gap-3">
              <Link href="/lease-review" className="bg-teal text-white font-black rounded-sm hover:bg-dark-teal transition-colors no-underline text-center block" style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.1rem 2rem' }}>
                Get Free Summary →
              </Link>
              <Link href="/lease-review" className="text-white font-bold rounded-sm hover:text-teal transition-colors no-underline text-center block" style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.1rem 2rem', border: '1px solid rgba(255,255,255,0.3)' }}>
                Full Report — $97
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. TOOLS TEASER ─────────────────── white */}
      <section className="bg-white" style={{ padding: 'clamp(3rem, 7vw, 5rem) 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
        <div className={INNER} style={SECTION_PAD}>
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
              <div>
                <p className="text-teal font-bold tracking-[0.3em] uppercase mb-4" style={{ fontSize: '0.65rem' }}>Market intelligence</p>
                <h2 className="text-near-black font-black uppercase leading-tight tracking-tight mb-3"
                  style={{ fontSize: 'clamp(1.3rem, 4vw, 2.2rem)' }}>
                  Free tools.<br />Better decisions.
                </h2>
                <p className="text-charcoal font-light leading-relaxed" style={{ fontSize: '0.85rem', maxWidth: '28rem' }}>
                  Cap rate calculator, lease comparison, purchase checklist and more. No sign-up.
                </p>
              </div>
              <Link href="/resources" className="text-near-black font-black rounded-sm hover:text-teal hover:border-teal transition-colors no-underline text-center block"
                style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0.9rem 1.75rem', border: '1px solid #1A1A1A' }}>
                View all tools →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ─────────────────── warm-grey */}
      <section className="bg-warm-grey" style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 0' }}>
        <div className={INNER} style={SECTION_PAD}>
          <FadeIn>
            <h2 className="text-near-black font-black uppercase leading-tight tracking-tight text-center mb-16"
              style={{ fontSize: 'clamp(1.7rem, 5vw, 3.2rem)' }}>
              What our clients say
            </h2>
          </FadeIn>
          {[
            { name: 'Liz Murray', tag: 'Edge of Possibilities', service: 'Workplace Strategy', quote: 'Joe stands out because he takes the time to really listen and understand what you need. He asks thoughtful questions and builds genuine, lasting relationships. His approach makes the entire process seamless, collaborative, and enjoyable.' },
            { name: 'Nathan Franks', tag: 'Dynamic Business Technologies', service: 'Furniture & Fitout', quote: 'Joe was particularly instrumental in building out our boardroom — delivering a high-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent attention to detail.' },
            { name: 'Sophie', tag: 'Jirsch Sutherland', service: 'Commercial Cleaning', quote: 'We are very happy with the service provided by Sarah and Joe at Your Office Space. They are reliable and consistent, and go above and beyond to make sure all our cleaning needs are met.' },
          ].map((t, i) => (
            <FadeIn key={t.name} delay={i * 80}>
              <div style={{ borderTop: '1px solid #e5e7eb', padding: '1.75rem 0' }}>
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} style={{ width: '0.9rem', height: '0.9rem', color: '#EAB308', fill: 'currentColor' }} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-near-black font-light leading-relaxed mb-6" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', maxWidth: '36rem' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-near-black font-black" style={{ fontSize: '0.85rem' }}>{t.name}</p>
                <p className="text-mid-grey font-light" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{t.tag}</p>
                <p className="text-teal font-bold tracking-widest uppercase" style={{ fontSize: '0.6rem', marginTop: '0.25rem' }}>{t.service}</p>
              </div>
            </FadeIn>
          ))}
          <div style={{ borderTop: '1px solid #e5e7eb' }} />
        </div>
      </section>

      {/* ── 8. CTA ──────────────────────────── near-black */}
      <section className="bg-near-black" style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 0' }}>
        <div className={INNER} style={SECTION_PAD}>
          <FadeIn>
            <h2
              className="text-white font-black uppercase leading-tight tracking-tight"
              style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', marginBottom: '1.5rem', borderLeft: '3px solid #00B5A5', paddingLeft: '1.25rem' }}
            >
              Speak to<br />Joe directly.
            </h2>
            <p className="text-white/50 font-light leading-relaxed" style={{ fontSize: '0.9rem', maxWidth: '28rem', marginBottom: '2.5rem' }}>
              20 minutes. No pitch. Just a straight conversation about your space and whether we can help.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={HUBSPOT.bookingUrl} target="_blank" rel="noopener noreferrer"
                className="bg-teal text-white font-black rounded-sm hover:bg-dark-teal transition-colors no-underline text-center"
                style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.1rem 2rem' }}>
                Book a Clarity Call
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                className="text-white font-bold rounded-sm hover:text-teal transition-colors no-underline text-center"
                style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '1.1rem 2rem', border: '1px solid rgba(255,255,255,0.3)' }}>
                {CONTACT.phone}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  )
}
