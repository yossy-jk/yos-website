import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'About | Your Office Space — Commercial Property Advisory',
  description: "Joe Kelley founded Your Office Space after a decade in commercial fitouts. Australia's tenant-side commercial property advisor. Licensed. Experienced. On your side."
}

export default function AboutPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="bg-near-black pt-20 pb-16 sm:pt-28 sm:pb-20 md:pt-44 md:pb-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className="relative max-w-screen-xl mx-auto">
          <FadeIn delay={0}>
            <SectionLabel>About</SectionLabel>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight mb-8 max-w-3xl"
              style={{ fontSize: 'clamp(2rem, 7vw, 6rem)' }}>
              One team.<br />
              <span className="text-teal">Genuinely on your side.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="text-white/60 font-light leading-relaxed max-w-xl"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)' }}>
              Your Office Space was built by someone who spent a decade watching business owners
              get taken advantage of during the most expensive moments of their growth.
              We exist to change that.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* THE STORY */}
      <section className="bg-white py-20 md:py-32 lg:py-40">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(2rem, 10vw, 10rem)', paddingRight: 'clamp(2rem, 10vw, 10rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn direction="left">
              <div>
                <SectionLabel>The story</SectionLabel>
                <h2 className="text-near-black font-black leading-tight tracking-tight mb-8"
                  style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
                  I built this because the industry needed someone on the other side of the table.
                </h2>
                <div className="w-full mt-8 overflow-hidden">
                  <Image
                    src="/team/joe-kelley.jpg"
                    alt="Joe Kelley — Managing Director, Your Office Space"
                    width={600}
                    height={600}
                    className="object-cover w-full"
                    style={{ aspectRatio: '1/1' }}
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div className="flex flex-col gap-6 text-charcoal font-light leading-relaxed"
                style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}>
                <p>
                  I spent over a decade in commercial office fitouts, furniture and workplace strategy.
                  In that time I watched too many good businesses get taken advantage of during one of the
                  most expensive and distracting moments in their journey — the office move, the fitout,
                  the lease negotiation.
                </p>
                <p>
                  Here&apos;s what most people don&apos;t see: an office project has a fixed budget.
                  Think of it as a pie. From the moment the project kicks off, up to 30 contractors,
                  suppliers and agents all need to eat from it. Some are fair. Some are not.
                  The greedy ones take more than their share early — and the business owner doesn&apos;t
                  notice until quality drops at the back end and the budget is gone.
                </p>
                <p>
                  Worse, leadership gets pulled away from the work that actually pays the bills to manage
                  a process they were never equipped for.
                </p>
                <div className="border-l-4 border-teal pl-6 py-2 my-2">
                  <p className="text-near-black font-medium">
                    I started Your Office Space because I believed business owners deserved someone
                    genuinely on their side — someone who gets in early, before the pie starts shrinking,
                    creates a realistic budget, finds the right space on the right terms, and manages the
                    whole thing from a position of trust and experience.
                  </p>
                </div>
                <p className="text-near-black font-black text-lg">
                  One Team. One relationship. One outcome.
                </p>
                <p className="text-mid-grey text-xs font-medium tracking-wide">
                  — Joe Kelley, Founder &amp; Managing Director
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-warm-grey py-20 md:py-32 lg:py-40">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(2rem, 10vw, 10rem)', paddingRight: 'clamp(2rem, 10vw, 10rem)' }}>
          <FadeIn>
            <SectionLabel>Meet the team</SectionLabel>
            <h2 className="text-near-black font-black leading-tight tracking-tight mb-10 sm:mb-16"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)' }}>
              The people behind every deal.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <FadeIn direction="left">
              <div className="bg-white rounded-sm p-7 sm:p-10 shadow-sm">
                <div className="flex items-start gap-6 mb-7">
                  <Image
                    src="/team/joe-kelley.jpg"
                    alt="Joe Kelley"
                    width={64} height={64}
                    className="rounded-full object-cover flex-shrink-0"
                    style={{ width: '4rem', height: '4rem' }}
                  />
                  <div>
                    <h3 className="text-near-black font-black text-xl">Joe Kelley</h3>
                    <p className="text-teal font-bold text-xs tracking-widest uppercase mt-1">Founder &amp; Managing Director</p>
                  </div>
                </div>
                <p className="text-charcoal font-light leading-relaxed mb-8" style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>
                  Over a decade in commercial fitouts, furniture and workplace strategy before founding
                  Your Office Space. Joe leads all tenant representation and buyers agency engagements —
                  personally handling every negotiation, every clause, every deal.
                </p>
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-7">
                  {[
                                                                                { label: 'Location', value: 'Cameron Park, NSW' },
                  ].map(item => (
                    <div key={item.label} className="flex gap-4 items-baseline">
                      <span className="text-mid-grey text-xs font-semibold tracking-wide uppercase w-20 flex-shrink-0">{item.label}</span>
                      <span className="text-near-black text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div className="bg-white rounded-sm p-7 sm:p-10 shadow-sm">
                <div className="flex items-start gap-6 mb-7">
                  <Image
                    src="/team/sarah-kelley.jpg"
                    alt="Sarah Kelley"
                    width={64} height={64}
                    className="rounded-full object-cover flex-shrink-0"
                    style={{ width: '4rem', height: '4rem' }}
                  />
                  <div>
                    <h3 className="text-near-black font-black text-xl">Sarah Kelley</h3>
                    <p className="text-teal font-bold text-xs tracking-widest uppercase mt-1">Cleaning Division Manager</p>
                  </div>
                </div>
                <p className="text-charcoal font-light leading-relaxed mb-8" style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>
                  Sarah runs the commercial cleaning division end to end — site audits, team management,
                  quality assurance, and client relationships. Every site gets a monthly personal audit
                  from Sarah. If something&apos;s wrong, you call her directly.
                </p>
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-7">
                  {[
                    { label: 'Focus', value: 'Commercial, medical, childcare & industrial' },
                    { label: 'Standard', value: 'Monthly audits on every site' },
                    { label: 'Location', value: 'Newcastle, NSW' },
                  ].map(item => (
                    <div key={item.label} className="flex gap-4 items-baseline">
                      <span className="text-mid-grey text-xs font-semibold tracking-wide uppercase w-20 flex-shrink-0">{item.label}</span>
                      <span className="text-near-black text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WHY TENANT-SIDE ONLY */}
      <section className="bg-near-black py-20 md:py-32 lg:py-40">
        <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(2rem, 10vw, 10rem)', paddingRight: 'clamp(2rem, 10vw, 10rem)' }}>
          <FadeIn>
            <SectionLabel>Our position</SectionLabel>
            <h2 className="text-white font-black leading-tight tracking-tight mb-8 sm:mb-12"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)' }}>
              Why we only work for tenants and buyers.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                heading: 'No landlord work. Ever.',
                body: "Most commercial property advisors represent both sides of the same deal. We don't. The moment you represent a landlord, your loyalty is split. We chose to eliminate that conflict entirely."
              },
              {
                heading: 'Local knowledge. Real relationships.',
                body: "We know which landlords negotiate in good faith, which agents play fair, and where the real opportunities are right now. That intelligence comes from a decade of doing real deals in real markets."
              },
              {
                heading: 'End-to-end accountability.',
                body: "Lease to clean. One team, one relationship, one point of contact from your first property decision through to the day your space is fully operational. Nothing falls through the cracks."
              },
              {
                heading: 'Skin in the game.',
                body: "Our reputation is everything. Every market we operate in, we're accountable to the businesses in it. Every outcome matters to us personally."
              },
            ].map((item, i) => (
              <FadeIn key={item.heading} delay={i * 70} direction="up">
                <div className="pl-6 border-l-4 border-teal py-1">
                  <p className="text-white font-bold text-base mb-2">{item.heading}</p>
                  <p className="text-white/55 font-light leading-relaxed" style={{ fontSize: "0.95rem", lineHeight: 1.75 }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal py-14 sm:py-20 lg:py-28 text-center">
        <FadeIn>
          <div className="max-w-screen-xl mx-auto" style={{ paddingLeft: 'clamp(2rem, 10vw, 10rem)', paddingRight: 'clamp(2rem, 10vw, 10rem)' }}>
            <h2 className="text-white font-black leading-tight mb-5"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              Ready to have someone genuinely on your side?
            </h2>
            <p className="text-white/80 font-light text-lg leading-relaxed mb-6 sm:mb-10">
              20 minutes. No pitch. Just a straight conversation about your space and what you&apos;re trying to achieve.
            </p>
            <Button href={HUBSPOT.bookingUrl} variant="dark" external size="lg">
              Book a Clarity Call with Joe
            </Button>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  )
}
