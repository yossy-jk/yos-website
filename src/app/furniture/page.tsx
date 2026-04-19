import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'Office Furniture & Fitout Newcastle | Your Office Space',
  description: 'Office furniture and fitout project management in Newcastle. Workstations, seating, storage, collaboration spaces — specified, delivered and installed across the Hunter Valley.'
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
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-20 pb-24 w-full">
          <FadeIn delay={0}>
            <SectionLabel>Office Furniture &amp; Fitout</SectionLabel>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-white font-black leading-[0.95] tracking-tight max-w-4xl mb-8"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}>
              Your office is a business decision.{' '}
              <span className="text-teal">Treat it like one.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-white/65 font-light leading-relaxed max-w-2xl mb-12"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.375rem)' }}>
              We manage your furniture and fitout end to end — brief, specification, supplier coordination, delivery and install. You walk into a finished workspace. One team, no gaps.
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
      <section className="bg-warm-grey border-b border-gray-200 py-14 lg:py-16">
        <FadeIn>
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200">
              {[
                { stat: '200+', label: 'Projects delivered in the Hunter' },
                { stat: '4–6 weeks', label: 'Typical delivery & install' },
                { stat: '$0', label: 'Hidden charges or surprises' },
                { stat: '1', label: 'Point of contact, start to finish' }
              ].map((item) => (
                <div key={item.label} className="py-8 px-6 text-center">
                  <p className="text-near-black font-black text-2xl lg:text-3xl mb-2 leading-tight">{item.stat}</p>
                  <p className="text-mid-grey font-light text-sm leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* WHAT WE SUPPLY */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <FadeIn>
            <SectionLabel>What we supply</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mb-20 max-w-2xl"
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
                <div className="bg-warm-grey rounded-sm p-10 h-full">
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

      {/* WHO WE WORK WITH */}
      <section className="bg-near-black py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <FadeIn direction="left">
            <div>
              <SectionLabel>Who we work with</SectionLabel>
              <h2 className="text-white font-bold leading-tight mb-8"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
                Private businesses, councils, schools, and health facilities across the Hunter.
              </h2>
              <p className="text-white/60 font-light text-lg leading-relaxed mb-8 max-w-2xl">
                We work with organisations of all sizes — from 5-person professional services firms to multi-site government and health sector clients. The spec, the process, and the standard of work is the same regardless of project size.
              </p>
              <p className="text-white/60 font-light text-lg leading-relaxed max-w-2xl">
                Every project is managed by us from start to finish. You deal with one person. We coordinate the rest.
              </p>
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <div className="flex flex-col gap-6">
              {[
                { label: 'Commercial offices', body: 'Private sector businesses across Newcastle, Maitland, Lake Macquarie and the broader Hunter region.' },
                { label: 'Councils & government', body: 'Local government and public sector organisations across the Hunter and Mid-North Coast.' },
                { label: 'Schools & education', body: 'Student furniture, staff workstations, staffrooms and learning spaces across the region.' },
                { label: 'Health & community', body: 'Medical practices, NDIS environments, allied health and community facilities.' }
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
      <section className="bg-warm-grey py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <FadeIn>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-near-black font-bold leading-tight tracking-tight mb-20 max-w-2xl"
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
          <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
            <div className="bg-near-black rounded-sm p-10 lg:p-16 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
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
      <section className="bg-near-black py-24 lg:py-32 text-center">
        <FadeIn>
          <div className="max-w-2xl mx-auto px-6 md:px-12 lg:px-20">
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
