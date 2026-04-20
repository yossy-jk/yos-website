import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT, CONTACT } from '@/lib/constants'

const WRAP = 'max-w-6xl mx-auto px-6 md:px-12 lg:px-20'

export default function Home() {
  return (
    <>
      <Nav />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO — Full screen. One message. No clutter.
      ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-near-black">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Modern commercial office space Newcastle"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.65) 60%, rgba(26,26,26,0.3) 100%)' }} />

        <div className={`relative z-10 w-full ${WRAP} pt-32 pb-24 md:pt-48 md:pb-36`}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.3em] mb-8" style={{ fontSize: '0.7rem' }}>
              Newcastle &amp; Hunter Valley
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black uppercase tracking-tight leading-none mb-8"
              style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}>
              Your workspace.<br />
              Our responsibility.
            </h1>
          </FadeIn>
          <FadeIn delay={180}>
            <p className="text-white/70 font-light leading-relaxed mb-12"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', maxWidth: '38rem' }}>
              Newcastle&apos;s only commercial property advisor working exclusively
              for tenants and buyers. We never represent landlords.
            </p>
          </FadeIn>
          <FadeIn delay={260}>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={HUBSPOT.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors duration-200"
                style={{ padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
              >
                Book a Clarity Call
              </a>
              <Link
                href="/lease-review"
                className="text-white font-medium no-underline text-center hover:text-teal transition-colors duration-200"
                style={{ padding: '1rem 2.25rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                Free Lease Review →
              </Link>
            </div>
          </FadeIn>

          {/* Anchor stats — bottom of hero on desktop */}
          <FadeIn delay={350}>
            <div className="mt-20 md:mt-28 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { stat: '100+', label: 'Projects delivered' },
                { stat: 'Tenant-side only', label: 'Zero conflicts of interest' },
                { stat: '12+ years', label: 'Newcastle experience' },
                { stat: 'Lease to clean', label: 'One team, no handoffs' },
              ].map(item => (
                <div key={item.stat}>
                  <p className="text-white font-black mb-1"
                    style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)' }}>{item.stat}</p>
                  <p className="text-white/40 font-light"
                    style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SERVICES — Clean grid. Minimal copy. Let the page breathe.
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white py-28 md:py-40">
        <div className={WRAP}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.25em] mb-4" style={{ fontSize: '0.7rem' }}>What we do</p>
            <h2 className="text-near-black font-black uppercase tracking-tight leading-none mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)' }}>
              Everything your<br />business needs.<br />One team.
            </h2>
            <p className="text-charcoal font-light leading-relaxed mb-20"
              style={{ fontSize: '1.05rem', maxWidth: '40rem' }}>
              Tenant representation, furniture and fitout, buyers agency, and commercial cleaning.
              All connected. All accountable to you.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
            {[
              {
                num: '01',
                title: 'Tenant\nRepresentation',
                tagline: 'Your lease. Your terms.',
                body: 'We sit on your side of the table — never the landlord\'s. Every clause, every incentive, every negotiation handled to protect your business.',
                href: '/tenant-rep',
              },
              {
                num: '02',
                title: 'Furniture\n& Fitout',
                tagline: 'Spaces that perform.',
                body: 'Brief to delivered workspace. Specified, coordinated and installed. One contact, start to finish — no gaps, no surprises.',
                href: '/furniture',
              },
              {
                num: '03',
                title: 'Buyers\nAgency',
                tagline: 'Buy without getting burned.',
                body: 'Off-market access, rigorous due diligence, and hard negotiations for commercial buyers across Newcastle and the Hunter Valley.',
                href: '/buyers-agency',
              },
              {
                num: '04',
                title: 'Commercial\nCleaning',
                tagline: 'Shows up. Every time.',
                body: 'Offices, childcare, medical and industrial facilities. Consistent, accountable, and managed locally by Sarah Kelley.',
                href: '/cleaning',
              },
            ].map((service, i) => (
              <FadeIn key={service.title} delay={i * 60}>
                <Link
                  href={service.href}
                  className="group bg-white no-underline flex flex-col hover:bg-warm-grey transition-colors duration-300"
                  style={{ padding: '3rem 2.5rem 2.5rem', minHeight: '20rem' }}
                >
                  <span className="text-teal font-bold mb-6" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>{service.num}</span>
                  <h3 className="text-near-black font-black uppercase tracking-tight leading-none mb-4 group-hover:text-teal transition-colors duration-200"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', whiteSpace: 'pre-line' }}>
                    {service.title}
                  </h3>
                  <p className="text-teal font-semibold uppercase tracking-widest mb-4" style={{ fontSize: '0.6rem' }}>{service.tagline}</p>
                  <p className="text-charcoal font-light leading-relaxed mb-8 flex-1" style={{ fontSize: '0.875rem' }}>{service.body}</p>
                  <span className="text-mid-grey font-medium group-hover:text-teal transition-colors duration-200" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Learn more →
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. DIFFERENTIATION — Simple. Direct. Why us, not them.
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-near-black py-28 md:py-40">
        <div className={WRAP}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            <FadeIn>
              <div>
                <p className="text-teal font-semibold uppercase tracking-[0.25em] mb-6" style={{ fontSize: '0.7rem' }}>Why choose YOS</p>
                <h2 className="text-white font-black uppercase tracking-tight leading-none mb-8"
                  style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)' }}>
                  We work<br />for you.<br />
                  <span className="text-teal">Not the<br />other side.</span>
                </h2>
                <p className="text-white/55 font-light leading-relaxed mb-10"
                  style={{ fontSize: '1rem', maxWidth: '32rem' }}>
                  Most commercial advisors work both sides of the deal.
                  We don&apos;t. Our licence and structure means we answer to one party only — you.
                </p>
                <blockquote style={{ borderLeft: '2px solid #00B5A5', paddingLeft: '1.5rem' }}>
                  <p className="text-white/60 font-light leading-relaxed italic mb-3" style={{ fontSize: '0.95rem' }}>
                    &ldquo;The agent across the table does this every day.
                    Most business owners do it once.
                    That experience gap costs real money.&rdquo;
                  </p>
                  <cite className="text-teal font-semibold uppercase tracking-widest not-italic" style={{ fontSize: '0.6rem' }}>
                    Joe Kelley — Managing Director
                  </cite>
                </blockquote>
              </div>
            </FadeIn>

            <div className="flex flex-col justify-center">
              {[
                {
                  num: '01',
                  title: 'Tenant-side only',
                  body: 'We never represent landlords or vendors. No split loyalty. No backdoor deals. Pure representation.',
                },
                {
                  num: '02',
                  title: 'Newcastle embedded',
                  body: 'Twelve-plus years in this market. The relationships, the off-market access, the agent network — built here, not imported.',
                },
                {
                  num: '03',
                  title: 'Start to finish',
                  body: 'Lease, fitout, furniture, cleaning. One relationship from your first decision through to the day your space is running.',
                },
              ].map((point, i) => (
                <FadeIn key={point.title} delay={i * 100}>
                  <div className="flex gap-8 py-8 border-b border-white/8">
                    <span className="text-teal font-black flex-shrink-0 leading-none"
                      style={{ fontSize: '3.5rem', lineHeight: 1, opacity: 0.7, minWidth: '3.5rem' }}>
                      {point.num}
                    </span>
                    <div className="pt-1">
                      <p className="text-white font-bold mb-2" style={{ fontSize: '1rem' }}>{point.title}</p>
                      <p className="text-white/45 font-light leading-relaxed" style={{ fontSize: '0.85rem' }}>{point.body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SOCIAL PROOF — Real people. Real outcomes. Clean grid.
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-white py-28 md:py-40">
        <div className={WRAP}>
          <FadeIn>
            <p className="text-teal font-semibold uppercase tracking-[0.25em] mb-4" style={{ fontSize: '0.7rem' }}>Client outcomes</p>
            <h2 className="text-near-black font-black uppercase tracking-tight leading-none mb-20"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 5rem)' }}>
              Real people.<br />Real results.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                name: 'Liz Murray',
                company: 'Edge of Possibilities',
                service: 'Workplace Strategy',
                quote: 'Joe takes the time to really listen and understand what you need. He asks thoughtful questions, builds genuine relationships, and makes the whole process feel collaborative.',
              },
              {
                name: 'Nathan Franks',
                company: 'Dynamic Business Technologies',
                service: 'Furniture & Fitout',
                quote: 'Joe was instrumental in building out our boardroom — delivering a high-quality table, chairs and acoustic panelling that completely transformed the space. Practical advice, excellent detail.',
              },
              {
                name: 'Sophie',
                company: 'Jirsch Sutherland',
                service: 'Commercial Cleaning',
                quote: 'We are very happy with the service provided by Sarah and Joe. They are reliable, consistent, and go above and beyond to make sure all our cleaning needs are met.',
              },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 80}>
                <div className="flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} style={{ width: '0.85rem', height: '0.85rem', fill: '#EAB308' }} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-near-black font-light leading-relaxed flex-1 mb-8"
                    style={{ fontSize: '0.95rem' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-near-black font-bold" style={{ fontSize: '0.875rem' }}>{t.name}</p>
                    <p className="text-mid-grey font-light" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{t.company}</p>
                    <p className="text-teal font-semibold uppercase tracking-widest" style={{ fontSize: '0.6rem', marginTop: '0.35rem' }}>{t.service}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. LEASEINTEL — Product focus. Clean two-column.
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-near-black py-28 md:py-40">
        <div className={WRAP}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <div>
                <div className="inline-flex items-center gap-2 mb-10"
                  style={{ border: '1px solid rgba(0,181,165,0.35)', padding: '0.45rem 1rem' }}>
                  <span className="bg-teal rounded-full" style={{ width: '0.35rem', height: '0.35rem', flexShrink: 0 }} />
                  <span className="text-teal font-semibold uppercase tracking-[0.25em]" style={{ fontSize: '0.65rem' }}>
                    New — LeaseIntel™
                  </span>
                </div>
                <h2 className="text-white font-black uppercase tracking-tight leading-none mb-8"
                  style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
                  Is your lease<br />
                  <span className="text-teal">costing you<br />more than<br />it should?</span>
                </h2>
                <p className="text-white/55 font-light leading-relaxed"
                  style={{ fontSize: '1rem', maxWidth: '30rem' }}>
                  Most business owners sign commercial leases they don&apos;t fully understand.
                  LeaseIntel™ gives you a plain-English risk analysis of every clause — before you sign. Or after.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div>
                <div className="mb-10">
                  {[
                    { label: 'Free summary', detail: 'Risk rating + top 3 issues — delivered instantly' },
                    { label: 'Full report — $97', detail: '12 risk categories + negotiation roadmap' },
                    { label: '24-hour turnaround', detail: 'Reviewed by Joe personally — not outsourced' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-5 py-6 border-b border-white/8">
                      <span className="text-teal font-bold flex-shrink-0" style={{ fontSize: '1.1rem', lineHeight: 1.2 }}>✓</span>
                      <div>
                        <p className="text-white font-semibold mb-1" style={{ fontSize: '0.9rem' }}>{item.label}</p>
                        <p className="text-white/40 font-light" style={{ fontSize: '0.8rem' }}>{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/lease-review"
                    className="bg-teal text-white font-bold no-underline text-center hover:bg-dark-teal transition-colors duration-200 flex-1"
                    style={{ padding: '1rem 1.75rem', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Get Free Summary →
                  </Link>
                  <Link href="/lease-review"
                    className="text-white font-medium no-underline text-center hover:text-teal transition-colors duration-200 flex-1"
                    style={{ padding: '1rem 1.75rem', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.25)' }}>
                    Full Report — $97
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CTA — Simple. Human. Direct.
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-teal py-28 md:py-36">
        <div className={WRAP}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <h2 className="text-white font-black uppercase tracking-tight leading-none mb-6"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>
                  Speak to<br />Joe<br />directly.
                </h2>
                <p className="text-white/75 font-light leading-relaxed"
                  style={{ fontSize: '1.05rem', maxWidth: '28rem' }}>
                  20 minutes. No pitch. Just a straight conversation about your space and whether we can help.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="flex flex-col gap-4">
                <a
                  href={HUBSPOT.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-near-black text-white font-bold no-underline text-center hover:bg-near-black/80 transition-colors duration-200 block"
                  style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Book a Clarity Call
                </a>
                <a
                  href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
                  className="text-white font-medium no-underline text-center hover:bg-white/10 transition-colors duration-200 block"
                  style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.4)' }}>
                  {CONTACT.phone}
                </a>
                <p className="text-white/50 font-light text-center" style={{ fontSize: '0.8rem' }}>
                  or{' '}
                  <a href="mailto:jk@yourofficespace.au" className="text-white/70 hover:text-white no-underline transition-colors">
                    jk@yourofficespace.au
                  </a>
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
