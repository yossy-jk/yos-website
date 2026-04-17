import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { HUBSPOT, CONTACT } from '@/lib/constants'

const SERVICES = [
  {
    title: 'Tenant Rep',
    tagline: 'Your lease. Your terms.',
    body: 'We represent the tenant — never the landlord. Pure negotiation in your interest.',
    href: '/tenant-rep',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Buyers Agency',
    tagline: 'Buy without getting burned.',
    body: 'Off-market access, hard negotiations, and due diligence handled by specialists.',
    href: '/buyers-agency',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Furniture & Fitout',
    tagline: 'Spaces that work.',
    body: 'Government-approved supplier. Project management through to final delivery.',
    href: '/furniture',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Cleaning',
    tagline: 'Shows up. Every time.',
    body: 'Commercial cleaning for offices, childcare, medical and industrial facilities.',
    href: '/cleaning',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
  },
]

const TOOLS = [
  {
    icon: '📐',
    name: 'Fitout Estimator',
    desc: 'Real Newcastle market rates. Basic to premium.',
    href: '/resources/fitout-estimator',
  },
  {
    icon: '📄',
    name: 'Lease Review',
    desc: 'Flag the clauses that cost you.',
    href: '/resources/lease-review',
  },
  {
    icon: '⚖️',
    name: 'Lease Comparison',
    desc: 'True cost across 3 options side by side.',
    href: '/resources/lease-comparison',
  },
]

export default function Home() {
  return (
    <>
      <Nav />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Newcastle commercial office space"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay — darker at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-near-black/80 via-near-black/75 to-near-black/90" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 pt-24 pb-20 md:pt-32 md:pb-32">
          <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-6">
            Newcastle &amp; Hunter Valley
          </p>
          <h1
            className="text-white font-black leading-[1.05] tracking-tight mb-7"
            style={{ fontSize: 'clamp(2.4rem, 7vw, 6rem)' }}
          >
            Your space is your<br />
            competitive advantage.
          </h1>
          <p
            className="text-white/65 font-light leading-relaxed mb-10 max-w-xl"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
          >
            Lease. Fitout. Furniture. Cleaning. One team, your interests first — Newcastle through and through.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={HUBSPOT.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal text-white font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-dark-teal transition-colors duration-200 no-underline text-center"
            >
              Book a Clarity Call
            </a>
            <Link
              href="/resources"
              className="border border-white/30 text-white font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:border-white/70 transition-colors duration-200 no-underline text-center"
            >
              Free Tools →
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-white/20" />
          <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase">Scroll</p>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
          {[
            { stat: '100+', label: 'Fitouts delivered' },
            { stat: 'Tenant-side only', label: 'Zero conflicts of interest' },
            { stat: 'Newcastle & Hunter', label: 'Exclusively local' },
            { stat: 'Lease to clean', label: 'One team, end-to-end' },
          ].map((item) => (
            <div key={item.stat} className="py-7 px-5 md:px-8 text-center">
              <p className="text-near-black font-black text-base md:text-lg mb-1 tracking-tight">{item.stat}</p>
              <p className="text-mid-grey text-xs font-medium tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">What we do</p>
          <h2
            className="text-near-black font-black leading-tight tracking-tight mb-14"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Every part of the<br className="hidden md:block" /> workspace problem. One team.
          </h2>

          {/* Mobile: horizontal scroll. Desktop: 2-col grid */}
          <div className="flex md:grid md:grid-cols-2 gap-6 overflow-x-auto md:overflow-x-visible -mx-5 md:mx-0 px-5 md:px-0 pb-4 md:pb-0 scroll-snap-x no-scrollbar">
            {SERVICES.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group flex-shrink-0 w-[78vw] sm:w-[55vw] md:w-auto no-underline block"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative h-52 md:h-64 overflow-hidden bg-warm-grey">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-near-black/20 group-hover:bg-near-black/10 transition-colors duration-300" />
                </div>
                <div className="border-t-2 border-teal pt-5 pb-6 pr-2">
                  <h3 className="text-near-black font-black text-xl mb-1 tracking-tight">{service.title}</h3>
                  <p className="text-teal font-bold text-xs tracking-wider uppercase mb-3">{service.tagline}</p>
                  <p className="text-charcoal text-sm leading-relaxed mb-4">{service.body}</p>
                  <span className="text-teal font-bold text-xs tracking-wider uppercase group-hover:text-dark-teal transition-colors">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY YOS ─────────────────────────────────────────── */}
      <section className="bg-near-black py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          <div>
            <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-5">Why YOS</p>
            <h2
              className="text-white font-black leading-tight tracking-tight mb-6"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}
            >
              One team.<br />No conflicts.<br />No shortcuts.
            </h2>
            <p className="text-white/45 text-sm md:text-base leading-relaxed font-light">
              Most commercial property advisors work both sides of the deal. We don&apos;t.
              Every decision we make is in your interest — because that&apos;s the only interest we have.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {[
              {
                label: 'Tenant-side only',
                body: 'We never represent landlords or vendors. No split loyalty. No backdoor deals. When we negotiate, we negotiate for you.',
              },
              {
                label: 'Newcastle-first',
                body: "We live and work here. We know which landlords play fair and which ones don't. That knowledge is worth more than any Sydney firm's database.",
              },
              {
                label: 'End-to-end',
                body: 'Lease to clean. One relationship, one accountable team from your first property decision through to the day your space is running.',
              },
            ].map((point) => (
              <div key={point.label} className="pl-5 border-l-2 border-teal">
                <p className="text-white font-black text-base mb-2 tracking-tight">{point.label}</p>
                <p className="text-white/45 text-sm leading-relaxed font-light">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE TOOLS ──────────────────────────────────────── */}
      <section className="bg-warm-grey py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="max-w-xl mb-14">
            <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">Free tools</p>
            <h2
              className="text-near-black font-black leading-tight tracking-tight mb-5"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              Know your numbers before you commit.
            </h2>
            <p className="text-charcoal text-sm md:text-base leading-relaxed font-light">
              Built for Newcastle businesses. Real market rates. No sign-up to start — just answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {TOOLS.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group bg-white border border-gray-100 p-7 hover:border-teal hover:shadow-lg transition-all duration-200 no-underline block rounded-sm"
              >
                <div className="text-3xl mb-4">{tool.icon}</div>
                <h3 className="text-near-black font-black text-base mb-2 tracking-tight group-hover:text-teal transition-colors">
                  {tool.name}
                </h3>
                <p className="text-mid-grey text-sm leading-relaxed mb-5 font-light">{tool.desc}</p>
                <span className="text-teal font-bold text-xs tracking-widest uppercase">
                  Try free →
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/resources"
            className="text-near-black font-bold text-xs tracking-widest uppercase border-b-2 border-near-black hover:text-teal hover:border-teal transition-colors no-underline pb-0.5"
          >
            View all tools →
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIAL ─────────────────────────────────────── */}
      <section className="bg-near-black py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-5 md:px-10 text-center">
          <div className="w-10 h-1 bg-teal mx-auto mb-8" />
          <p
            className="text-white font-light leading-relaxed mb-8"
            style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)' }}
          >
            &ldquo;Thanks to Joe and the YOS team, we now have a state-of-the-art facility that not only meets but
            exceeds our expectations. I wholeheartedly recommend them to anyone seeking a dedicated
            and knowledgeable commercial property advisor in Newcastle.&rdquo;
          </p>
          <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase">Newcastle Business Owner</p>
        </div>
      </section>

      {/* ── CASE STUDIES TEASER ─────────────────────────────── */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">Results</p>
              <h2
                className="text-near-black font-black leading-tight tracking-tight"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
              >
                Our next jobs come<br className="hidden md:block" /> from our past jobs.
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="text-near-black font-bold text-xs tracking-widest uppercase border-b-2 border-near-black hover:text-teal hover:border-teal transition-colors no-underline pb-0.5 flex-shrink-0"
            >
              All case studies →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                division: 'Tenant Rep',
                headline: '$180k saved over 5 years',
                detail: 'Newcastle CBD lease — incentive negotiation & rent reduction',
                href: '/case-studies/newcastle-cbd-lease-negotiation',
              },
              {
                division: 'Furniture',
                headline: '35-person fitout in 6 weeks',
                detail: 'Hunter Valley office — full project management, on budget',
                href: '/case-studies/hunter-valley-office-fitout-furniture',
              },
              {
                division: 'Cleaning',
                headline: '12+ months. Zero compliance issues.',
                detail: 'Edgeworth childcare — daily cleaning, regulatory standard maintained',
                href: '/case-studies/edgeworth-childcare-cleaning',
              },
            ].map((cs) => (
              <Link
                key={cs.headline}
                href={cs.href}
                className="group border border-gray-100 p-7 hover:border-teal hover:shadow-lg transition-all duration-200 no-underline block rounded-sm"
              >
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">{cs.division}</p>
                <h3 className="text-near-black font-black text-lg leading-tight mb-3 tracking-tight group-hover:text-teal transition-colors">
                  {cs.headline}
                </h3>
                <p className="text-mid-grey text-sm leading-relaxed font-light">{cs.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="bg-teal py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto px-5 md:px-10">
          <h2
            className="text-white font-black leading-tight tracking-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Let&apos;s talk.
          </h2>
          <p className="text-white/75 text-sm md:text-base leading-relaxed mb-10 font-light">
            20 minutes. No pitch. Just a straight conversation about what you&apos;re trying to build
            and whether we can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={HUBSPOT.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-near-black text-white font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-black transition-colors duration-200 no-underline text-center"
            >
              Book a Clarity Call
            </a>
            <a
              href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
              className="border-2 border-white/40 text-white font-bold text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:border-white transition-colors duration-200 no-underline text-center"
            >
              Call Us Directly
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
