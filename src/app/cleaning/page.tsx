import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'Commercial Cleaning Newcastle | Your Office Space',
  description: 'Consistent, accountable commercial cleaning for offices, medical practices, and childcare centres across Newcastle and the Hunter Valley.'
}

export default function CleaningPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-[72px] bg-near-black overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className="relative z-10 max-w-7xl mx-auto px-[5%] w-full pt-20 pb-24">
          <FadeIn delay={0}>
            <SectionLabel>Commercial Cleaning</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-8"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}>
              Your space reflects<br />
              <span className="text-teal">your business.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/65 font-light leading-relaxed max-w-2xl mb-12"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              Consistent. Accountable. Newcastle-based. We clean offices that can&apos;t afford a bad first impression — and neither can yours.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
              Book a Site Visit
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-teal py-14 lg:py-16">
        <FadeIn>
          <div className="max-w-7xl mx-auto px-[5%]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { stat: 'Same', label: 'Team every visit — no surprises' },
                { stat: 'Monthly', label: 'Quality audits on every site' },
                { stat: 'Direct', label: 'Line to Sarah, not a call centre' },
                { stat: '100%', label: 'Newcastle-owned and operated' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-white font-black text-4xl lg:text-5xl mb-2 leading-none">{item.stat}</p>
                  <p className="text-white/75 font-light text-sm leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHAT WE CLEAN */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <FadeIn>
            <SectionLabel>What we clean</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight mb-20 max-w-2xl"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
              Every property type. Same standard.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                type: 'Commercial Offices',
                services: [
                  'Daily office cleaning',
                  'Kitchen and break room',
                  'Washroom maintenance',
                  'Carpet and hard floor care',
                  'Glass and window cleaning',
                ],
                note: 'Professional environments demand professional cleaning.'
              },
              {
                type: 'Medical Practices',
                services: [
                  'Clinical-grade disinfection',
                  'Infection control protocols',
                  'Medical waste handling',
                  'Biohazard-compliant procedures',
                  'NDIS and privacy compliance',
                ],
                note: 'We understand the standards medical facilities must meet.'
              },
              {
                type: 'Childcare Centres',
                services: [
                  'Child-safe cleaning protocols',
                  'Toy and equipment sanitising',
                  'Play area deep cleaning',
                  'Cot and bedding care',
                  'Non-toxic product use',
                ],
                note: 'Safety and health come first, every single time.'
              },
              {
                type: 'Post-Construction',
                services: [
                  'Deep site cleanup',
                  'Dust removal and disposal',
                  'Debris extraction',
                  'Equipment and surface cleaning',
                  'Final readiness preparation',
                ],
                note: 'We coordinate closely with your fitout and building teams.'
              },
            ].map((category, i) => (
              <FadeIn key={category.type} delay={i * 70} direction="up">
                <div className="bg-warm-grey rounded-sm p-10 h-full">
                  <h3 className="text-near-black font-bold text-xl mb-6 border-b-2 border-teal pb-4">
                    {category.type}
                  </h3>
                  <ul className="space-y-3 mb-6">
                    {category.services.map(service => (
                      <li key={service} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0 mt-2" />
                        <span className="text-charcoal font-light text-sm">{service}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-mid-grey font-light text-sm italic border-t border-gray-200 pt-4">
                    {category.note}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* THE YOS DIFFERENCE */}
      <section className="bg-near-black py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <FadeIn>
            <SectionLabel>The YOS difference</SectionLabel>
            <h2 className="text-white font-bold leading-tight mb-20 max-w-2xl"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
              Why clients don&apos;t leave.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Same team, every time',
                body: 'No rotating cast of contractors. The same people clean your space every visit. They learn your building. They know what matters. Consistency builds trust.',
                aside: 'Familiarity = fewer mistakes.'
              },
              {
                title: 'Monthly quality audits',
                body: 'Sarah personally audits every site each month. Standards are checked. Issues are flagged before they become problems. You get a report, not an excuse.',
                aside: 'Accountability built into the contract.'
              },
              {
                title: 'Direct line to Sarah',
                body: "If something's wrong, you call Sarah. Not a call centre. Not an email queue. The person who runs the division — directly accountable for your result.",
                aside: 'Real problems, real solutions.'
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 80} direction="up">
                <div className="bg-white/[0.04] border border-white/10 rounded-sm p-10 h-full hover:bg-white/[0.07] transition-colors duration-200">
                  <h3 className="text-white font-bold text-xl mb-5">{item.title}</h3>
                  <p className="text-white/65 font-light text-sm leading-relaxed mb-5">{item.body}</p>
                  <p className="text-white/35 font-light text-xs italic border-t border-white/10 pt-4">{item.aside}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="border-l-4 border-teal pl-8 py-6 bg-teal/[0.06] rounded-r-sm">
              <p className="text-white font-light leading-relaxed"
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)' }}>
                We&apos;re Newcastle-based, Newcastle-owned. We show up because we have skin in the game.
                Your space matters to us because your space is in our city. That changes how we work.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* BUNDLE — cross-sell to fitout */}
      <section className="bg-warm-grey py-20 lg:py-24">
        <FadeIn>
          <div className="max-w-5xl mx-auto px-[5%]">
            <div className="bg-near-black rounded-sm p-10 lg:p-16 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
              <div className="flex-1">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">Bundle &amp; Save</p>
                <h3 className="text-white font-bold text-2xl lg:text-3xl leading-tight mb-4">
                  Moving into a new fitout?
                </h3>
                <p className="text-white/60 font-light text-base leading-relaxed">
                  Our furniture and fitout division works hand-in-hand with our cleaning team. We handle
                  the post-construction deep clean after every fitout — one team, zero gaps, one call.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button href="/furniture" variant="primary" size="lg">
                  View Furniture &amp; Fitout →
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="bg-teal py-28 lg:py-32 text-center">
        <FadeIn>
          <div className="max-w-2xl mx-auto px-[5%]">
            <h2 className="text-white font-bold leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
              Ready to move to a better standard?
            </h2>
            <p className="text-white/80 font-light text-xl leading-relaxed mb-12">
              We&apos;ll visit your site, understand your needs, and give you a clear proposal.
              No pressure. No surprises.
            </p>
            <Button href={HUBSPOT.bookingUrl} variant="dark" external size="lg">
              Book a Site Visit
            </Button>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  )
}
