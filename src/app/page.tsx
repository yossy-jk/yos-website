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
    body: 'We represent the tenant — never the landlord. Pure negotiation in your interest. No conflicts, no compromise.',
    href: '/tenant-rep',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Furniture & Fitout',
    tagline: 'Spaces that perform.',
    body: 'From brief to fully delivered workspace — furniture specified, coordinated and installed end-to-end across Newcastle and the Hunter.',
    href: '/furniture',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Buyers Agency',
    tagline: 'Buy without getting burned.',
    body: 'Off-market access, hard negotiations, and due diligence — handled by specialists who do this every day in Newcastle.',
    href: '/buyers-agency',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Cleaning',
    tagline: 'Shows up. Every time.',
    body: 'Commercial cleaning for offices, childcare, medical and industrial facilities. Consistent, accountable, Newcastle-based.',
    href: '/cleaning',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
  },
]

export default function Home() {
  return (
    <>
      <Nav />

      {/* ─────────────────────────────────────────────────────────
          1. HERO  |  bg: dark image
      ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Newcastle commercial office space"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/75" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-8 md:px-12 lg:px-20 pt-36 pb-28 md:pt-52 md:pb-36">
          <FadeIn delay={0}>
            <p className="text-teal font-bold text-xs tracking-[0.3em] uppercase mb-8">
              Newcastle &amp; Hunter Valley
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1
              className="text-white font-black leading-[1.0] tracking-tight mb-8"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}
            >
              One team.<br />
              One relationship.<br />
              <span className="text-teal">One outcome.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p
              className="text-white/75 font-light leading-relaxed mb-12 max-w-lg"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
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
                className="bg-teal text-white font-black text-xs tracking-widest uppercase px-8 py-5 rounded-sm hover:bg-dark-teal transition-colors duration-200 no-underline text-center"
              >
                Book a Clarity Call
              </a>
              <Link
                href="/lease-review"
                className="border border-white/40 text-white font-black text-xs tracking-widest uppercase px-8 py-5 rounded-sm hover:border-teal hover:text-teal transition-colors duration-200 no-underline text-center"
              >
                Free Lease Review →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          2. PROOF BAR  |  bg: white
      ───────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-20 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
          {[
            { stat: '100+', label: 'Projects delivered' },
            { stat: 'Tenant-side only', label: 'Zero conflicts of interest' },
            { stat: 'Newcastle & Hunter', label: 'Exclusively local' },
            { stat: 'Lease to clean', label: 'One team, end-to-end' },
          ].map(item => (
            <div key={item.stat} className="py-8 px-6 text-center">
              <p className="text-near-black font-black text-sm md:text-base mb-1.5 tracking-tight">{item.stat}</p>
              <p className="text-mid-grey text-xs font-medium tracking-wide">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          3. SERVICES  |  bg: white
      ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-36">
        <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-20">
          <FadeIn>
            <p className="text-teal font-bold text-xs tracking-[0.3em] uppercase mb-5">What we do</p>
            <h2
              className="text-near-black font-black leading-tight tracking-tight mb-4 max-w-2xl"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              Every part of the workspace problem. One team.
            </h2>
            <p className="text-charcoal font-light text-sm leading-relaxed mb-14 max-w-lg">
              Tenant representation, fitout, buyers agency, and cleaning — all under one roof. You deal with one person, start to finish.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
            {SERVICES.map((service, i) => (
              <FadeIn key={service.title} delay={i * 60}>
                <Link
                  href={service.href}
                  className="group bg-white no-underline block p-8 md:p-10 hover:bg-warm-grey transition-colors duration-200"
                >
                  <div className="relative h-44 overflow-hidden bg-warm-grey mb-6">
                    <Image
                      src={service.img}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-near-black/15 group-hover:bg-near-black/5 transition-colors duration-300" />
                  </div>
                  <div className="border-t-2 border-teal pt-5">
                    <h3 className="text-near-black font-black text-xl mb-1.5 tracking-tight group-hover:text-teal transition-colors duration-200">{service.title}</h3>
                    <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">{service.tagline}</p>
                    <p className="text-charcoal text-sm leading-relaxed font-light mb-4">{service.body}</p>
                    <span className="text-teal font-bold text-xs tracking-widest uppercase">Learn more →</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          4. WHY YOS  |  bg: near-black — DARK BREAK
      ───────────────────────────────────────────────────────── */}
      <section className="bg-near-black py-24 md:py-36">
        <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-20">
          <FadeIn>
            <p className="text-teal font-bold text-xs tracking-[0.3em] uppercase mb-5">Why YOS</p>
            <h2
              className="text-white font-black leading-tight tracking-tight mb-6 max-w-2xl"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              One team. No conflicts. No shortcuts.
            </h2>
            <p className="text-white/55 font-light text-base leading-relaxed mb-16 max-w-xl">
              Most commercial property advisors work both sides of the deal. We don&apos;t.
              Every decision we make is in your interest — because that&apos;s the only interest we have.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {[
              { label: 'Tenant-side only', body: 'We never represent landlords or vendors. No split loyalty. No backdoor deals. When we negotiate, we negotiate for you.' },
              { label: 'Newcastle-first', body: "We live and work here. We know which landlords play fair and which ones don't. That knowledge is worth more than any Sydney firm's database." },
              { label: 'End-to-end', body: 'Lease to clean. One relationship, one accountable team from your first property decision through to the day your space is running.' },
            ].map((point, i) => (
              <FadeIn key={point.label} delay={i * 80}>
                <div className="bg-near-black px-8 py-10">
                  <div className="w-8 h-0.5 bg-teal mb-6" />
                  <p className="text-white font-bold text-base tracking-tight mb-3">{point.label}</p>
                  <p className="text-white/45 text-sm leading-relaxed font-light">{point.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          5. LEASEINTEL  |  bg: warm-grey — LIGHT BREAK
      ───────────────────────────────────────────────────────── */}
      <section className="bg-warm-grey py-24 md:py-36">
        <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 bg-near-black px-4 py-2 rounded-sm mb-8">
                <span className="w-1.5 h-1.5 bg-teal rounded-full" />
                <span className="text-teal font-bold text-[10px] tracking-[0.3em] uppercase">New — LeaseIntel™</span>
              </div>
              <h2
                className="text-near-black font-black leading-tight tracking-tight mb-6"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
              >
                Is your lease costing you more than it should?
              </h2>
              <p className="text-charcoal text-sm leading-relaxed mb-8 font-light max-w-md">
                Most business owners sign commercial leases they don&apos;t fully understand.
                LeaseIntel™ gives you a complete plain-English risk analysis — every clause rated
                Red, Amber, or Green — before you sign. Or after.
              </p>
              <div className="flex flex-col gap-3 mb-10">
                {[
                  'Free summary: overall risk rating + top 3 issues — instant',
                  'Full report: all 12 risk categories + negotiation roadmap — $97',
                  '24-hour turnaround · Reviewed by Joe personally',
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-teal font-black text-sm mt-0.5 flex-shrink-0">✓</span>
                    <p className="text-charcoal text-sm leading-relaxed font-light">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/lease-review"
                  className="bg-near-black text-white font-black text-xs tracking-widest uppercase px-7 py-4 rounded-sm hover:bg-teal transition-colors duration-200 no-underline text-center"
                >
                  Get Free Summary →
                </Link>
                <Link
                  href="/lease-review"
                  className="border border-near-black text-near-black font-black text-xs tracking-widest uppercase px-7 py-4 rounded-sm hover:border-teal hover:text-teal transition-colors duration-200 no-underline text-center"
                >
                  Full Report — $97
                </Link>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={120}>
              <div className="bg-near-black p-8">
                <p className="text-teal font-bold text-xs tracking-[0.25em] uppercase mb-6">Sample risk summary</p>
                <div className="flex flex-col gap-3 mb-6">
                  {[
                    { clause: 'Make good obligations', risk: 'RED', impact: 'Est. $45,000–$60,000 exposure on exit' },
                    { clause: 'Rent review mechanism', risk: 'RED', impact: 'CPI uncapped — no ceiling on increases' },
                    { clause: 'Assignment restrictions', risk: 'AMBER', impact: 'Landlord consent required, no timeframe' },
                    { clause: 'Option to renew', risk: 'GREEN', impact: 'Standard 5+5, market rent review' },
                  ].map((row) => (
                    <div key={row.clause} className="flex items-start gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                      <span className={`text-[10px] font-black tracking-wider flex-shrink-0 mt-0.5 w-12 ${
                        row.risk === 'RED' ? 'text-red-400' : row.risk === 'AMBER' ? 'text-yellow-400' : 'text-green-400'
                      }`}>{row.risk}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-xs mb-0.5">{row.clause}</p>
                        <p className="text-white/40 text-xs font-light">{row.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-5">
                  <p className="text-teal font-bold text-xs tracking-widest uppercase mb-1.5">Overall rating</p>
                  <p className="text-white font-black text-sm">HIGH RISK — Do not sign without negotiation</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          6. TESTIMONIALS  |  bg: near-black — DARK BREAK
      ───────────────────────────────────────────────────────── */}
      <section className="bg-near-black py-24 md:py-36">
        <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-20">
          <FadeIn>
            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-0.5 bg-teal" />
              <p className="text-white/40 text-xs font-semibold tracking-widest uppercase">Client reviews</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Liz Murray',
                tag: 'Edge of Possibilities',
                service: 'Workplace Strategy',
                quote: 'Joe stands out because he takes the time to really listen and understand what you need. He asks thoughtful questions and builds genuine, lasting relationships.',
              },
              {
                name: 'Nathan Franks',
                tag: 'Dynamic Business Technologies',
                service: 'Furniture & Fitout',
                quote: 'Joe was particularly instrumental in building out our boardroom — delivering a high-quality table, chairs and acoustic panelling that completely transformed the space.',
              },
              {
                name: 'Sophie',
                tag: 'Jirsch Sutherland',
                service: 'Commercial Cleaning',
                quote: 'We are very happy with the service provided by Sarah and Joe at Your Office Space. They are reliable and consistent, and go above and beyond to make sure all our cleaning needs are met.',
              },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="flex flex-col h-full border-t border-white/15 pt-8">
                  <div className="flex gap-0.5 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/65 font-light text-sm leading-relaxed flex-1 mb-8">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs font-light mt-0.5">{t.tag}</p>
                    <p className="text-teal font-bold text-[10px] tracking-widest uppercase mt-1">{t.service}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          7. HOW IT WORKS  |  bg: white — LIGHT BREAK
      ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-36">
        <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-20">
          <FadeIn>
            <p className="text-teal font-bold text-xs tracking-[0.3em] uppercase mb-5">How it works</p>
            <h2
              className="text-near-black font-black leading-tight tracking-tight mb-6 max-w-xl"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              One team. Start to finish.
            </h2>
            <p className="text-charcoal font-light text-sm leading-relaxed mb-16 max-w-lg">
              Most businesses deal with five different advisors across a single office move. We handle it all — one contact, one relationship, no gaps.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', label: 'Find the right space', detail: 'Tenant rep or buyers agency. We identify, shortlist, and negotiate your next commercial property in Newcastle.', service: 'Tenant Rep / Buyers Agency' },
              { step: '02', label: 'Fit it out', detail: 'Furniture, workstations, storage, collaboration spaces. Spec\u2019d, sourced, delivered and installed.', service: 'Furniture & Fitout' },
              { step: '03', label: 'Keep it clean', detail: 'Same team, every visit. Monthly audits. Direct line to Sarah. No call centres, no surprises.', service: 'Commercial Cleaning' },
              { step: '04', label: 'Run it smart', detail: 'LeaseIntel\u2122 tracks your lease obligations. We remind you when options are due. You focus on your business.', service: 'LeaseIntel\u2122' },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 80}>
                <div className="flex flex-col h-full pt-8 border-t-2 border-gray-100">
                  <p className="text-teal font-black text-3xl mb-5 leading-none">{item.step}</p>
                  <h3 className="text-near-black font-bold text-base mb-2 tracking-tight">{item.label}</h3>
                  <p className="text-charcoal font-light text-sm leading-relaxed flex-1 mb-4">{item.detail}</p>
                  <p className="text-teal font-bold text-[10px] tracking-widest uppercase">{item.service}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          8. FINAL CTA  |  bg: teal — COLOUR BREAK
      ───────────────────────────────────────────────────────── */}
      <section className="bg-teal py-24 md:py-32 text-center">
        <div className="max-w-2xl mx-auto px-8 md:px-12">
          <FadeIn>
            <h2
              className="text-white font-black leading-tight tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              Let&apos;s talk.
            </h2>
            <p className="text-white/80 text-base leading-relaxed mb-12 font-light max-w-sm mx-auto">
              20 minutes. No pitch. Just a straight conversation about what you&apos;re trying to build
              and whether we can help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={HUBSPOT.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-near-black text-white font-black text-xs tracking-widest uppercase px-10 py-5 rounded-sm hover:bg-white hover:text-near-black transition-colors duration-200 no-underline"
              >
                Book a Clarity Call
              </a>
              <a
                href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                className="border border-white/50 text-white font-black text-xs tracking-widest uppercase px-10 py-5 rounded-sm hover:border-white transition-colors duration-200 no-underline"
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
