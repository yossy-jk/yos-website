import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'Office Furniture Newcastle | Your Office Space',
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
        <div className="absolute inset-0 bg-near-black/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-[5%] pt-20">
          <SectionLabel>Office Furniture & Fitout</SectionLabel>
          <h1 className="text-white font-bold text-6xl lg:text-8xl leading-tight tracking-tight max-w-3xl mb-8">
            Spaces that work. Furniture that lasts.
          </h1>
          <p className="text-white/70 font-light text-xl lg:text-2xl leading-relaxed max-w-2xl mb-12">
            Government-approved supplier. Fitout project management, ergonomic workstations, full office solutions — delivered across Newcastle and the Hunter Valley.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
            Get a Furniture Quote
          </Button>
        </div>
      </section>

      {/* WHAT WE SUPPLY */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <SectionLabel>What we supply</SectionLabel>
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-20 max-w-2xl">
            Everything your workspace needs. Nothing it doesn&apos;t.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
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
              <div key={i} className="bg-warm-grey rounded-lg p-10">
                <h3 className="text-near-black font-bold text-2xl mb-6 border-b-2 border-teal pb-4">{cat.category}</h3>
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
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNMENT APPROVED */}
      <section className="bg-near-black py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionLabel>Government approved</SectionLabel>
            <h2 className="text-white font-bold text-4xl lg:text-5xl leading-tight mb-8">
              On the approved supplier list. So your procurement is straightforward.
            </h2>
            <p className="text-white/60 font-light text-lg leading-relaxed mb-8">
              Your Office Space is an approved government furniture supplier. For government departments, councils, schools, and public sector organisations in NSW — procurement is simple, compliant, and fast.
            </p>
            <p className="text-white/60 font-light text-lg leading-relaxed">
              Private sector clients get the same quality, the same service, and competitive pricing on everything we supply.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {[
              { label: 'NSW Government approved', body: 'On the State Government procurement panel. No additional approvals required for eligible entities.' },
              { label: 'Local councils', body: 'We supply councils across the Hunter and Mid-North Coast region with compliant, quality furniture.' },
              { label: 'Schools & education', body: 'Student furniture, staff workstations, staffrooms, and learning spaces — all compliant.' },
              { label: 'Health & community', body: 'NDIS-registered environments, medical practices, and community facilities supplied and fitted.' }
            ].map((item) => (
              <div key={item.label} className="pl-6 border-l-4 border-teal">
                <p className="text-white font-bold text-lg mb-1">{item.label}</p>
                <p className="text-white/55 font-light text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-warm-grey py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-20 max-w-2xl">
            From brief to delivered. No hassle.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Brief', body: "Tell us what you're trying to achieve. New fitout, partial refresh, or just some new chairs — we start with your needs, not a catalogue." },
              { step: '02', title: 'Spec & Quote', body: 'We prepare a specification and quote based on your space, your people, and your budget. No surprises.' },
              { step: '03', title: 'Manufacture', body: 'Products are manufactured or sourced to your specification. Lead times are confirmed upfront.' },
              { step: '04', title: 'Deliver & Install', body: "We deliver and install. Your team walks in to a ready workspace. We don't leave until it's right." }
            ].map((step) => (
              <div key={step.step}>
                <p className="text-teal font-bold text-4xl mb-4">{step.step}</p>
                <h3 className="text-near-black font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-charcoal font-light text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-near-black py-28 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto px-[5%]">
          <h2 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-6">
            Ready to kit out your space?
          </h2>
          <p className="text-white/55 font-light text-xl leading-relaxed mb-12">
            Send us your floor plan, tell us your headcount, and we&apos;ll put together a specification and quote.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
            Get a Furniture Quote
          </Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
