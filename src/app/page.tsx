import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'

const SERVICES = [
  {
    title: 'Tenant Rep',
    tagline: 'Your lease. Your terms.',
    body: 'We represent the tenant — never the landlord. Pure negotiation in your interest.',
    href: '/tenant-rep',
  },
  {
    title: 'Furniture & Fitout',
    tagline: 'Spaces that perform.',
    body: 'From brief to fully delivered workspace — specified, coordinated and installed end-to-end.',
    href: '/furniture',
  },
  {
    title: 'Buyers Agency',
    tagline: 'Buy without getting burned.',
    body: 'Off-market access, hard negotiations, and due diligence handled by Newcastle specialists.',
    href: '/buyers-agency',
  },
  {
    title: 'Cleaning',
    tagline: 'Shows up. Every time.',
    body: 'Commercial cleaning for offices and facilities. Consistent, accountable, Newcastle-based.',
    href: '/cleaning',
  },
]

export default function Home() {
  return (
    <>
      <Nav />

      {/* ─────────────────────────────────────────────
          1. HERO
          bg: dark image — full height
      ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Newcastle commercial office space"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/80" />

        <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 pt-40 pb-32 md:pt-52 md:pb-40 max-w-4xl">
          <FadeIn delay={0}>
            <p className="text-teal font-bold text-xs tracking-[0.35em] uppercase mb-10">
              Newcastle &amp; Hunter Valley
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1
              className="text-white font-black uppercase leading-[1.0] tracking-tight mb-10"
              style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)' }}
            >
              One team.<br />
              One relationship.<br />
              <span className="text-teal">One outcome.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p
              className="text-white/70 font-light leading-relaxed mb-14 max-w-md"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}
            >
              Newcastle&apos;s only commercial property advisor working exclusively for tenants and buyers.
              We never work for landlords — not once, not ever.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={HUBSPOT.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal text-white font-black text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm hover:bg-dark-teal transition-colors duration-200 no-underline text-center"
              >
                Book a Clarity Call
              </a>
              <Link
                href="/lease-review"
                className="border border-white/40 text-white font-bold text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm hover:border-teal hover:text-teal transition-colors duration-200 no-underline text-center"
              >
                Free Lease Review →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          2. PROOF BAR
          bg: white — compact
      ──────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
          {[
            { stat: '100+', label: 'Projects delivered' },
            { stat: 'Tenant-side only', label: 'Zero conflicts of interest' },
            { stat: 'Newcastle & Hunter', label: 'Exclusively local' },
            { stat: 'Lease to clean', label: 'One team, end-to-end' },
          ].map(item => (
            <div key={item.stat} className="py-8 px-8 text-center">
              <p className="text-near-black font-black text-sm md:text-base mb-1.5 tracking-tight">{item.stat}</p>
              <p className="text-mid-grey text-xs font-medium tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          3. WHAT WE DO
          bg: near-black — DARK
      ──────────────────────────────────────────── */}
      <section className="bg-near-black py-24 md:py-36">
        <div className="max-w-4xl mx-auto px-8 md:px-16 lg:px-24">
          <FadeIn>
            <p className="text-teal font-bold text-xs tracking-[0.35em] uppercase mb-6">What we do</p>
            <h2
              className="text-white font-black uppercase leading-tight tracking-tight mb-8 border-l-4 border-teal pl-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
            >
              Commercial property advisory.<br />
              One team.<br />
              Every part of the problem.
            </h2>
            <p className="text-white/55 font-light text-base leading-relaxed mb-20 max-w-lg pl-6 border-l-4 border-transparent">
              Tenant representation, fitout, buyers agency, and cleaning — all under one roof. You deal with Joe, start to finish.
            </p>
          </FadeIn>

          <div className="flex flex-col divide-y divide-white/[0.08]">
            {SERVICES.map((service, i) => (
              <FadeIn key={service.title} delay={i * 60}>
                <Link
                  href={service.href}
                  className="group flex items-baseline justify-between gap-8 py-8 no-underline hover:pl-2 transition-all duration-200"
                >
                  <div className="flex items-baseline gap-6 flex-1">
                    <span className="text-teal font-black text-xs tracking-widest flex-shrink-0 w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-white font-black text-xl md:text-2xl tracking-tight mb-1.5 group-hover:text-teal transition-colors duration-200">{service.title}</h3>
                      <p className="text-teal font-bold text-xs tracking-widest uppercase mb-2">{service.tagline}</p>
                      <p className="text-white/40 text-sm leading-relaxed font-light">{service.body}</p>
                    </div>
                  </div>
                  <span className="text-white/20 font-bold text-lg group-hover:text-teal group-hover:translate-x-1 transition-all duration-200 flex-shrink-0">→</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          4. WHY YOS
          bg: white — LIGHT BREAK
      ──────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-36">
        <div className="max-w-4xl mx-auto px-8 md:px-16 lg:px-24">
          <FadeIn>
            <p className="text-teal font-bold text-xs tracking-[0.35em] uppercase mb-6">Why YOS</p>
            <h2
              className="text-near-black font-black uppercase leading-tight tracking-tight mb-8"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
            >
              No conflicts.<br />No shortcuts.<br />No split loyalty.
            </h2>
            <p className="text-charcoal font-light text-base leading-relaxed mb-20 max-w-lg">
              Most commercial property advisors work both sides of the deal. We don&apos;t.
              Every decision we make is in your interest — because that&apos;s the only interest we have.
            </p>
          </FadeIn>

          <div className="flex flex-col gap-0">
            {[
              { num: '01', label: 'Tenant-side only', body: 'We never represent landlords or vendors. No split loyalty. No backdoor deals. When we negotiate, we negotiate for you.' },
              { num: '02', label: 'Newcastle-first', body: "We live and work here. We know which landlords play fair and which ones don't. That knowledge is worth more than any Sydney firm's database." },
              { num: '03', label: 'End-to-end', body: 'Lease to clean. One relationship, one accountable team from your first property decision through to the day your space is running.' },
            ].map((point, i) => (
              <FadeIn key={point.label} delay={i * 80}>
                <div className="flex gap-8 py-10 border-b border-gray-100 last:border-0">
                  <span className="text-teal font-black text-4xl md:text-5xl leading-none flex-shrink-0 w-16">{point.num}</span>
                  <div className="pt-1">
                    <p className="text-near-black font-black text-lg tracking-tight mb-3">{point.label}</p>
                    <p className="text-charcoal font-light text-sm leading-relaxed max-w-md">{point.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          5. LEASEINTEL
          bg: near-black — DARK BREAK
      ──────────────────────────────────────────── */}
      <section className="bg-near-black py-24 md:py-36">
        <div className="max-w-4xl mx-auto px-8 md:px-16 lg:px-24">
          <FadeIn>
            <div className="inline-flex items-center gap-2 border border-teal/30 px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 bg-teal rounded-full" />
              <span className="text-teal font-bold text-[10px] tracking-[0.35em] uppercase">New — LeaseIntel™</span>
            </div>
            <h2
              className="text-white font-black uppercase leading-tight tracking-tight mb-8 border-l-4 border-teal pl-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
            >
              Is your lease costing you<br />more than it should?
            </h2>
            <p className="text-white/55 font-light text-base leading-relaxed mb-12 max-w-lg">
              Most business owners sign commercial leases they don&apos;t fully understand.
              LeaseIntel™ gives you a complete plain-English risk analysis — every clause rated
              Red, Amber, or Green — before you sign. Or after.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="flex flex-col gap-4 mb-14 max-w-lg">
              {[
                'Free summary: overall risk rating + top 3 issues — instant',
                'Full report: all 12 risk categories + negotiation roadmap — $97',
                '24-hour turnaround · Reviewed by Joe personally',
              ].map(item => (
                <div key={item} className="flex items-start gap-4">
                  <span className="text-teal font-black text-base flex-shrink-0 mt-0.5">✓</span>
                  <p className="text-white/60 text-sm leading-relaxed font-light">{item}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/lease-review"
                className="bg-teal text-white font-black text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm hover:bg-dark-teal transition-colors duration-200 no-underline text-center"
              >
                Get Free Summary →
              </Link>
              <Link
                href="/lease-review"
                className="border border-white/30 text-white font-bold text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm hover:border-teal hover:text-teal transition-colors duration-200 no-underline text-center"
              >
                Full Report — $97
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          6. TESTIMONIALS
          bg: warm-grey — LIGHT BREAK
      ──────────────────────────────────────────── */}
      <section className="bg-warm-grey py-24 md:py-36">
        <div className="max-w-4xl mx-auto px-8 md:px-16 lg:px-24">
          <FadeIn>
            <h2
              className="text-near-black font-black uppercase leading-tight tracking-tight mb-20 text-center"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
            >
              What our clients say
            </h2>
          </FadeIn>

          <div className="flex flex-col gap-0">
            {[
              {
                name: 'Liz Murray',
                tag: 'Edge of Possibilities',
                service: 'Workplace Strategy',
                quote: 'Joe stands out because he takes the time to really listen and understand what you need. He asks thoughtful questions and builds genuine, lasting relationships. His approach makes the entire process seamless, collaborative, and enjoyable.',
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
                quote: 'We are very happy with the service provided by Sarah and Joe at Your Office Space. They are reliable and consistent, and go above and beyond to make sure all our cleaning needs are met.',
              },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="border-t border-gray-200 py-12 last:border-b">
                  <div className="flex gap-0.5 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-near-black font-light text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-near-black font-black text-sm">{t.name}</p>
                    <p className="text-mid-grey text-xs font-light mt-0.5">{t.tag}</p>
                    <p className="text-teal font-bold text-[10px] tracking-widest uppercase mt-1">{t.service}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          7. FINAL CTA
          bg: near-black — DARK BREAK + CLOSE
      ──────────────────────────────────────────── */}
      <section className="bg-near-black py-24 md:py-36">
        <div className="max-w-4xl mx-auto px-8 md:px-16 lg:px-24">
          <FadeIn>
            <h2
              className="text-white font-black uppercase leading-tight tracking-tight mb-8 border-l-4 border-teal pl-6"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              Speak to<br />Joe directly.
            </h2>
            <p className="text-white/55 font-light text-base leading-relaxed mb-14 max-w-md">
              20 minutes. No pitch. Just a straight conversation about your space and whether we can help.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={HUBSPOT.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal text-white font-black text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm hover:bg-dark-teal transition-colors duration-200 no-underline text-center"
              >
                Book a Clarity Call
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                className="border border-white/30 text-white font-bold text-xs tracking-[0.2em] uppercase px-10 py-5 rounded-sm hover:border-teal hover:text-teal transition-colors duration-200 no-underline text-center"
              >
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
