import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import QuickEstimator from '@/components/QuickEstimator'
import { HUBSPOT, CONTACT } from '@/lib/constants'

const SERVICES = [
  {
    title: 'Tenant Rep',
    tagline: 'Your lease. Your terms.',
    body: 'We represent the tenant — never the landlord. Pure negotiation in your interest. No conflicts, no compromise.',
    href: '/tenant-rep',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Buyers Agency',
    tagline: 'Buy without getting burned.',
    body: 'Off-market access, hard negotiations, and due diligence — handled by specialists who do this every day in Newcastle.',
    href: '/buyers-agency',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Furniture & Fitout',
    tagline: 'Spaces that perform.',
    body: 'From brief to fully delivered workspace — furniture specified, coordinated and installed end-to-end across Newcastle and the Hunter.',
    href: '/furniture',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Cleaning',
    tagline: 'Shows up. Every time.',
    body: 'Commercial cleaning for offices, childcare, medical and industrial facilities. Consistent, accountable, Newcastle-based.',
    href: '/cleaning',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
  },
]

const MARKET_PULSE = [
  { label: 'CBD office asking rate', value: '$420–$680', unit: '/sqm pa' },
  { label: 'Typical tenant incentive', value: '12–18%', unit: 'of gross rent' },
  { label: 'Make good exposure', value: '$200–$400', unit: '/sqm' },
  { label: 'Average negotiation saving', value: '8–15%', unit: 'off asking rent' },
]

export default function Home() {
  return (
    <>
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Newcastle commercial office space"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/80" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 pt-24 pb-24 md:pt-36 md:pb-36">
          <div
            className="text-teal font-bold text-xs tracking-[0.28em] uppercase mb-6"
            style={{ opacity: 1 }}
          >
            Newcastle &amp; Hunter Valley
          </div>
          <h1
            className="text-white font-black leading-[1.04] tracking-tight mb-7 max-w-4xl"
            style={{ fontSize: 'clamp(2.4rem, 6.5vw, 6rem)' }}
          >
            One team.<br className="hidden sm:block" />
            One relationship.<br className="hidden sm:block" />
            <span className="text-teal">One outcome.</span>
          </h1>
          <p
            className="text-white/85 font-light leading-relaxed mb-10 max-w-xl"
            style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)' }}
          >
            Newcastle&apos;s only commercial property advisor working exclusively for tenants and buyers.
            We never work for landlords — not once, not ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={HUBSPOT.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal text-white font-black text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-dark-teal transition-colors duration-200 no-underline text-center"
            >
              Book a Clarity Call
            </a>
            <Link
              href="/lease-review"
              className="border border-white/30 text-white font-black text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:border-teal hover:text-teal transition-colors duration-200 no-underline text-center"
            >
              Free Lease Review →
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-white/20 animate-pulse" />
          <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Scroll</p>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
          {[
            { stat: '100+', label: 'Fitouts delivered' },
            { stat: 'Tenant-side only', label: 'Zero conflicts of interest' },
            { stat: 'Newcastle & Hunter', label: 'Exclusively local' },
            { stat: 'Lease to clean', label: 'One team, end-to-end' },
          ].map(item => (
            <div key={item.stat} className="py-7 px-5 md:px-8 text-center">
              <p className="text-near-black font-black text-base md:text-lg mb-1 tracking-tight">{item.stat}</p>
              <p className="text-mid-grey text-xs font-medium tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARKET PULSE ─────────────────────────────────────── */}
      <section className="bg-near-black border-b border-white/5 py-14">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
              <p className="text-white/50 font-bold text-xs tracking-[0.25em] uppercase">Newcastle CRE Market Pulse — April 2026</p>
            </div>
            <Link href="/resources" className="text-teal font-bold text-xs tracking-widest uppercase no-underline hover:text-dark-teal transition-colors">
              Free tools & resources →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {MARKET_PULSE.map((item, i) => (
              <FadeIn key={item.label} delay={i * 80} direction="up">
                <div className="bg-near-black px-6 py-5">
                  <p className="text-white font-black text-xl md:text-2xl mb-1 tracking-tight">{item.value}</p>
                  <p className="text-teal font-bold text-xs mb-1">{item.unit}</p>
                  <p className="text-white/35 text-xs font-light">{item.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-white/18 text-[10px] font-light mt-4">
            Indicative market intelligence based on YOS transaction data. Actual rates vary by precinct, grade, and lease terms.
          </p>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <FadeIn>
            <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">What we do</p>
            <h2
              className="text-near-black font-black leading-tight tracking-tight mb-14"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              Every part of the<br className="hidden md:block" /> workspace problem. One team.
            </h2>
          </FadeIn>

          {/* Swipe hint mask on mobile only */}
          <div className="md:hidden mb-3 flex items-center gap-2">
            <span className="text-mid-grey text-xs font-medium tracking-wide">Swipe to explore</span>
            <span className="text-teal text-xs">→</span>
          </div>
          <div className="swipe-hint md:[mask-image:none] flex md:grid md:grid-cols-2 gap-6 overflow-x-auto md:overflow-x-visible -mx-5 md:mx-0 px-5 md:px-0 pb-4 md:pb-0 scroll-snap-x no-scrollbar">
            {SERVICES.map((service, i) => (
              <FadeIn key={service.title} delay={i * 80}>
                <Link
                  href={service.href}
                  className="group flex-shrink-0 w-[82vw] sm:w-[55vw] md:w-auto no-underline block"
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
                    <p className="text-charcoal text-sm leading-relaxed mb-4 font-light">{service.body}</p>
                    <span className="text-teal font-bold text-xs tracking-wider uppercase group-hover:text-dark-teal transition-colors">
                      Learn more →
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY YOS ──────────────────────────────────────────── */}
      <section className="bg-near-black py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          <FadeIn direction="left">
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
          </FadeIn>

          <div className="flex flex-col gap-8">
            {[
              { label: 'Tenant-side only', body: 'We never represent landlords or vendors. No split loyalty. No backdoor deals. When we negotiate, we negotiate for you.' },
              { label: 'Newcastle-first', body: "We live and work here. We know which landlords play fair and which ones don't. That knowledge is worth more than any Sydney firm's database." },
              { label: 'End-to-end', body: 'Lease to clean. One relationship, one accountable team from your first property decision through to the day your space is running.' },
            ].map((point, i) => (
              <FadeIn key={point.label} delay={i * 100} direction="right">
                <div className="pl-5 border-l-2 border-teal">
                  <p className="text-white font-black text-base mb-2 tracking-tight">{point.label}</p>
                  <p className="text-white/45 text-sm leading-relaxed font-light">{point.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEASEINTEL™ FEATURE ──────────────────────────────── */}
      <section className="bg-warm-grey py-20 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 bg-near-black px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                <span className="text-teal font-bold text-[10px] tracking-[0.3em] uppercase">New — LeaseIntel™</span>
              </div>
              <h2
                className="text-near-black font-black leading-tight tracking-tight mb-5"
                style={{ fontSize: 'clamp(1.7rem, 3.8vw, 2.8rem)' }}
              >
                Is your lease<br />costing you more<br />than it should?
              </h2>
              <p className="text-charcoal text-sm md:text-base leading-relaxed mb-6 font-light">
                Most business owners sign commercial leases they don&apos;t fully understand.
                LeaseIntel™ gives you a complete plain-English risk analysis — every clause rated
                Red, Amber, or Green — before you sign. Or after.
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {[
                  'Free summary: overall risk rating + top 3 issues — instant',
                  'Full report: all 12 risk categories + negotiation roadmap — $97',
                  '24-hour turnaround · Reviewed by Joe personally',
                ].map(line => (
                  <div key={line} className="flex items-start gap-3">
                    <span className="text-teal font-black text-sm mt-0.5">✓</span>
                    <p className="text-charcoal text-sm font-light">{line}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/lease-review"
                  className="inline-flex items-center justify-center gap-2 bg-near-black text-white font-black text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-teal transition-colors duration-200 no-underline"
                >
                  Get Free Summary →
                </Link>
                <Link
                  href="/lease-review#full-report"
                  className="inline-flex items-center justify-center gap-2 border border-near-black text-near-black font-black text-xs tracking-widest uppercase px-8 py-4 rounded-sm hover:border-teal hover:text-teal transition-colors duration-200 no-underline"
                >
                  Full Report — $97
                </Link>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={150}>
              <div className="bg-near-black p-8 rounded-sm">
                <p className="text-white/40 font-bold text-[10px] tracking-[0.3em] uppercase mb-6">Sample report — Risk dashboard</p>
                <div className="flex flex-col gap-3 mb-6">
                  {[
                    { risk: '🔴 HIGH', clause: 'Make good to base building', impact: 'Estimated $85k liability' },
                    { risk: '🔴 HIGH', clause: 'Uncapped CPI rent review', impact: 'No ceiling on annual increases' },
                    { risk: '🟡 AMBER', clause: 'Assignment — absolute discretion', impact: 'Blocks business sale' },
                    { risk: '🟡 AMBER', clause: 'Option notice — 3 months only', impact: 'Risk of losing option' },
                    { risk: '🟢 LOW', clause: '5-year term with 5+5 options', impact: 'Market standard' },
                  ].map(row => (
                    <div key={row.clause} className="flex items-start gap-3 border-b border-white/8 pb-3">
                      <span className="text-sm flex-shrink-0 mt-0.5">{row.risk}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-xs truncate">{row.clause}</p>
                        <p className="text-white/40 text-xs font-light">{row.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-sm px-5 py-4">
                  <p className="text-teal font-bold text-xs tracking-widest uppercase mb-1">Overall rating</p>
                  <p className="text-white font-black text-lg">🔴 HIGH RISK — Do not sign without negotiation</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TOOLS + ESTIMATOR ────────────────────────────────── */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            <FadeIn direction="left">
              <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">Market intelligence</p>
              <h2
                className="text-near-black font-black leading-tight tracking-tight mb-5"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
              >
                Know your numbers<br />before you commit.
              </h2>
              <p className="text-charcoal text-sm md:text-base leading-relaxed mb-8 font-light">
                Real market data for Newcastle commercial property decisions. No sign-up to start.
              </p>
              <div className="flex flex-col gap-4 mb-8">
                {[
                  { icon: '📄', name: 'Lease Review', href: '/lease-review', desc: 'Flag the clauses that cost you' },
                  { icon: '⚖️', name: 'Lease Comparison', href: '/resources/lease-comparison', desc: 'True cost across 3 options' },
                  { icon: '📈', name: 'Cap Rate Calculator', href: '/resources/cap-rate-calculator', desc: 'Investment return analysis' },
                  { icon: '✅', name: 'Purchase Checklist', href: '/resources/purchase-checklist', desc: '25-point due diligence' },
                ].map(tool => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="group flex items-center gap-4 border border-gray-100 p-4 rounded-sm hover:border-teal hover:shadow-sm transition-all duration-200 no-underline"
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <div className="flex-1">
                      <p className="text-near-black font-black text-sm group-hover:text-teal transition-colors">{tool.name}</p>
                      <p className="text-mid-grey text-xs font-light">{tool.desc}</p>
                    </div>
                    <span className="text-teal font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={120}>
              <QuickEstimator />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="bg-near-black py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <FadeIn>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-1 bg-teal" />
              <p className="text-white/50 text-xs font-semibold tracking-widest uppercase">From Google Reviews</p>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Liz Murray',
                tag: 'Workplace Strategy',
                quote: 'Joe stands out because he takes the time to really listen and understand what you need. He asks thoughtful questions and builds genuine, lasting relationships. His approach makes the entire process seamless, collaborative, and enjoyable.',
              },
              {
                name: 'Nathan Franks',
                tag: 'Furniture & Fitout',
                quote: 'Joe was particularly instrumental in building out our boardroom — delivering a high-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent attention to detail, and a result that was both functional and professional.',
              },
              {
                name: 'Sophie',
                tag: 'Commercial Cleaning',
                quote: 'We are very happy with the service provided by Sarah and Joe at Your Office Space. They are reliable and consistent, and go above and beyond to make sure all our cleaning needs are met. We highly recommend.',
              },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 80} direction="up">
                <div className="bg-white/[0.04] border border-white/10 rounded-sm p-8 flex flex-col h-full hover:bg-white/[0.06] transition-colors duration-200">
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-white/75 font-light text-sm leading-relaxed flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-teal font-medium text-xs tracking-wide mt-0.5">{t.tag}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── END-TO-END JOURNEY ───────────────────────────────── */}
      <section className="bg-warm-grey py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <FadeIn>
            <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">How it works</p>
            <h2
              className="text-near-black font-black leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            >
              One team. Start to finish.
            </h2>
            <p className="text-charcoal font-light text-sm md:text-base leading-relaxed mb-16 max-w-xl">
              Most businesses deal with five different advisors across a single office move. We handle it all — one contact, one relationship, no gaps.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', label: 'Find the right space', detail: 'Tenant rep or buyers agency. We identify, shortlist, and negotiate your next commercial property in Newcastle.', service: 'Tenant Rep / Buyers Agency' },
              { step: '02', label: 'Fit it out', detail: 'Furniture, workstations, storage, collaboration spaces. Spec’d, sourced, delivered and installed. End to end, no gaps.', service: 'Furniture & Fitout' },
              { step: '03', label: 'Keep it clean', detail: 'Same team, every visit. Monthly audits. Direct line to Sarah. No call centres, no surprises.', service: 'Commercial Cleaning' },
              { step: '04', label: 'Run it smart', detail: 'LeaseIntel™ tracks your lease obligations. We remind you when options are due. You focus on your business.', service: 'LeaseIntel™' },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 80} direction="up">
                <div className="flex flex-col h-full">
                  <p className="text-teal font-black text-5xl mb-4 leading-none">{item.step}</p>
                  <h3 className="text-near-black font-bold text-lg mb-3 tracking-tight">{item.label}</h3>
                  <p className="text-charcoal font-light text-sm leading-relaxed flex-1 mb-4">{item.detail}</p>
                  <p className="text-teal font-bold text-[10px] tracking-widest uppercase">{item.service}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-4">Results</p>
                <h2
                  className="text-near-black font-black leading-tight tracking-tight"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
                >
                  Real outcomes.<br className="hidden md:block" /> Real clients.
                </h2>
              </div>
              <Link
                href="/case-studies"
                className="text-near-black font-bold text-xs tracking-widest uppercase border-b-2 border-near-black hover:text-teal hover:border-teal transition-colors no-underline pb-0.5 flex-shrink-0"
              >
                All case studies →
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { division: 'Tenant Rep', headline: '$180k saved over 5 years', detail: 'Newcastle CBD lease — incentive negotiation & rent reduction', href: '/case-studies/newcastle-cbd-lease-negotiation' },
              { division: 'Furniture', headline: '35-person fitout in 6 weeks', detail: 'Hunter Valley office — full project management, on budget', href: '/case-studies/hunter-valley-office-fitout-furniture' },
              { division: 'Cleaning', headline: '12+ months. Zero compliance issues.', detail: 'Edgeworth childcare — daily cleaning, regulatory standard maintained', href: '/case-studies/edgeworth-childcare-cleaning' },
            ].map((cs, i) => (
              <FadeIn key={cs.headline} delay={i * 100}>
                <Link
                  href={cs.href}
                  className="group border border-gray-100 p-7 hover:border-teal hover:shadow-lg transition-all duration-200 no-underline block rounded-sm h-full"
                >
                  <p className="text-teal font-bold text-xs tracking-widest uppercase mb-4">{cs.division}</p>
                  <h3 className="text-near-black font-black text-lg leading-tight mb-3 tracking-tight group-hover:text-teal transition-colors">
                    {cs.headline}
                  </h3>
                  <p className="text-mid-grey text-sm leading-relaxed font-light">{cs.detail}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="bg-teal py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto px-5 md:px-10">
          <FadeIn>
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
