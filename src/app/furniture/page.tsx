import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'Office Furniture & Fitout Newcastle | Your Office Space',
  description: 'Government-approved office furniture supplier in Newcastle. Fitout project management, ergonomic workstations, full office solutions across the Hunter Valley.'
}

export default function FurniturePage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-[72px] bg-near-black">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1920&q=80"
          alt="Modern office furniture Newcastle"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/82" />
        <div className="relative z-10 max-w-7xl mx-auto px-[5%] pt-20 pb-24 w-full">
          <FadeIn delay={0}>
            <SectionLabel>Office Furniture &amp; Fitout</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-8"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}>
              Spaces that work.{' '}
              <span className="text-teal">Furniture that lasts.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/65 font-light leading-relaxed max-w-2xl mb-12"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              Government-approved supplier. Fitout project management, ergonomic workstations, full office solutions — delivered across Newcastle and the Hunter Valley.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
              Get a Furniture Quote
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* GOVT APPROVED BANNER */}
      <section className="bg-teal py-14 lg:py-16">
        <FadeIn>
          <div className="max-w-7xl mx-auto px-[5%]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { stat: 'NSW Gov', label: 'Approved supplier panel' },
                { stat: '200+', label: 'Offices fitted out' },
                { stat: '4–6wk', label: 'Typical delivery & install' },
                { stat: '$0', label: 'Hidden charges or surprises' }
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-white font-black text-4xl lg:text-5xl mb-2 leading-none">{item.stat}</p>
                  <p className="text-white/75 font-light text-sm leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHAT WE SUPPLY */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <FadeIn>
            <SectionLabel>What we supply</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight mb-20 max-w-2xl"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
              Everything your workspace needs. Nothing it doesn&apos;t.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {[
              {
                category: 'Workstations & Desks',
                items: ['Sit-stand desks', 'Benching systems', 'Single and back-to-back workstations', 'Custom desk configurations', 'Cable management solutions'],
                note: 'Designed for the way your team actually works.'
              },
              {
                category: 'Seating',
                items: ['Ergonomic task chairs', 'Executive seating', 'Meeting and boardroom chairs', 'Visitor and reception seating', 'Breakout and lounge seating'],
                note: 'The right chair makes a measurable difference.'
              },
              {
                category: 'Storage & Filing',
                items: ['Pedestal and mobile storage', 'Overhead lockers', 'Tall storage and shelving', 'Shared filing systems', 'Personal lockers'],
                note: 'Clean spaces start with proper storage.'
              },
              {
                category: 'Collaboration & Meeting',
                items: ['Boardroom and meeting tables', 'Collaborative workbenches', 'Breakout furniture', 'Phone booths and quiet pods', 'Whiteboard and presentation walls'],
                note: 'Spaces that make meetings worth having.'
              }
            ].map((cat, i) => (
              <FadeIn key={i} delay={i * 70} direction="up">
                <div className="bg-warm-grey rounded-lg p-10 h-full">
                  <h3 className="text-near-black font-bold text-xl mb-6 border-b-2 border-teal pb-4">{cat.category}</h3>
                  <ul className="space-y-3 mb-6">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0 mt-2" />
                        <span className="text-charcoal font-light text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-mid-grey font-light text-sm italic border-t border-gray-300 pt-4">{cat.note}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNMENT APPROVED */}
      <section className="bg-near-black py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <FadeIn direction="left">
            <div>
              <SectionLabel>Government approved</SectionLabel>
              <h2 className="text-white font-bold leading-tight mb-8"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
                On the approved supplier list. So your procurement is straightforward.
              </h2>
              <p className="text-white/60 font-light text-lg leading-relaxed mb-8">
                Your Office Space is an approved government furniture supplier. For government departments, councils, schools, and public sector organisations in NSW — procurement is simple, compliant, and fast.
              </p>
              <p className="text-white/60 font-light text-lg leading-relaxed">
                Private sector clients get the same quality, the same service, and competitive pricing on everything we supply.
              </p>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="flex flex-col gap-6">
              {[
                { label: 'NSW Government approved', body: 'On the State Government procurement panel. No additional approvals required for eligible entities.' },
                { label: 'Local councils', body: 'We supply councils across the Hunter and Mid-North Coast region with compliant, quality furniture.' },
                { label: 'Schools & education', body: 'Student furniture, staff workstations, staffrooms, and learning spaces — all compliant.' },
                { label: 'Health & community', body: 'NDIS-registered environments, medical practices, and community facilities supplied and fitted.' }
              ].map((item) => (
                <div key={item.label} className="pl-6 border-l-4 border-teal">
                  <p className="text-white font-bold text-base mb-1">{item.label}</p>
                  <p className="text-white/55 font-light text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-warm-grey py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <FadeIn>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight mb-20 max-w-2xl"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
              From brief to delivered. No hassle.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Brief', body: "Tell us what you're trying to achieve. New fitout, partial refresh, or just some new chairs — we start with your needs, not a catalogue." },
              { step: '02', title: 'Spec & Quote', body: 'We prepare a specification and quote based on your space, your people, and your budget. No surprises.' },
              { step: '03', title: 'Manufacture', body: 'Products are manufactured or sourced to your specification. Lead times are confirmed upfront.' },
              { step: '04', title: 'Deliver & Install', body: "We deliver and install. Your team walks in to a ready workspace. We don't leave until it's right." }
            ].map((step, i) => (
              <FadeIn key={step.step} delay={i * 80} direction="up">
                <div>
                  <p className="text-teal font-black text-5xl mb-4 leading-none">{step.step}</p>
                  <h3 className="text-near-black font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-charcoal font-light text-sm leading-relaxed">{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BUNDLE CALLOUT — cross-sell to cleaning */}
      <section className="bg-white py-20 lg:py-24">
        <FadeIn>
          <div className="max-w-5xl mx-auto px-[5%]">
            <div className="bg-near-black rounded-2xl p-10 lg:p-16 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
              <div className="flex-1">
                <p className="text-teal font-bold text-xs tracking-widest uppercase mb-3">Bundle &amp; Save</p>
                <h3 className="text-white font-bold text-2xl lg:text-3xl leading-tight mb-4">
                  Fitout + cleaning. One team. Zero gaps.
                </h3>
                <p className="text-white/60 font-light text-base leading-relaxed">
                  Our cleaning division handles the post-construction deep clean and ongoing maintenance after every fitout. You don&apos;t coordinate two contractors — we handle it end to end.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button href="/cleaning" variant="primary" size="lg">
                  Learn about Cleaning →
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="bg-near-black py-28 lg:py-32 text-center">
        <FadeIn>
          <div className="max-w-2xl mx-auto px-[5%]">
            <h2 className="text-white font-bold leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}>
              Ready to kit out your space?
            </h2>
            <p className="text-white/55 font-light text-xl leading-relaxed mb-12">
              Send us your floor plan, tell us your headcount, and we&apos;ll put together a specification and quote.
            </p>
            <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
              Get a Furniture Quote
            </Button>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </>
  )
}
