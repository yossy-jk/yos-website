import Image from 'next/image'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'Commercial Buyers Agency Newcastle | Your Office Space',
  description: 'Off-market access, rigorous due diligence, and hard negotiations for commercial property buyers in Newcastle and the Hunter Valley.'
}

export default function BuyersAgencyPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-[72px] bg-near-black">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          alt="Newcastle commercial building"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-near-black/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-[5%] pt-20">
          <SectionLabel>Commercial Buyers Agency</SectionLabel>
          <h1 className="text-white font-bold text-6xl lg:text-8xl leading-tight tracking-tight max-w-3xl mb-8">
            Buy commercial in Newcastle without getting burned.
          </h1>
          <p className="text-white/70 font-light text-xl lg:text-2xl leading-relaxed max-w-2xl mb-12">
            Off-market access, rigorous due diligence, and hard negotiations — handled by someone who does this every day.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
            Book a Buyer Consultation
          </Button>
        </div>
      </section>

      {/* WHO WE HELP */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <SectionLabel>Who we help</SectionLabel>
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-20 max-w-2xl">
            First-time commercial buyers to seasoned investors.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Business owners',
                body: "Buying your own premises is one of the best moves a business can make. We help you find the right property, at the right price, in the right location — and structure the deal to protect you long-term."
              },
              {
                title: 'Property investors',
                body: "Commercial yields beat residential in most Newcastle submarkets right now. We find the properties that don't make it to the listing portals and negotiate from a position of genuine market knowledge."
              },
              {
                title: 'SMSF buyers',
                body: "Buying commercial property inside a self-managed super fund is increasingly popular in the Hunter. We work alongside your accountant to source and acquire the right asset within the right structure."
              }
            ].map((item) => (
              <div key={item.title} className="border-t-4 border-teal pt-6">
                <h3 className="text-near-black font-bold text-2xl mb-4">{item.title}</h3>
                <p className="text-charcoal font-light text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="bg-near-black py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <SectionLabel>What we do</SectionLabel>
          <h2 className="text-white font-bold text-4xl lg:text-5xl leading-tight mb-20 max-w-2xl">
            Every step of the acquisition. Done properly.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[
              { label: 'Market analysis', body: 'We map the Newcastle and Hunter Valley commercial market — active listings, recent sales, off-market opportunities, and emerging precincts you should know about.' },
              { label: 'Off-market sourcing', body: "Most good commercial properties never hit the portals. Our network of local agents, owners, and developers gives us access to stock that other buyers don't see." },
              { label: 'Due diligence', body: 'Zoning, DA history, tenancy review, building condition, contamination risk — we go through every layer before you commit a dollar.' },
              { label: 'Price negotiation', body: "We know what things are worth in this market. We negotiate hard on price, terms, and conditions — without emotion, without ego, without compromise." },
              { label: 'Contract review coordination', body: 'We coordinate with your solicitor and conveyancer to ensure the contract protects your interests and that nothing slips through.' },
              { label: 'Settlement support', body: "We stay involved through to settlement. If issues arise — and they sometimes do — we're in your corner to resolve them quickly." }
            ].map((item) => (
              <div key={item.label} className="pl-6 border-l-4 border-teal">
                <p className="text-white font-bold text-lg mb-2">{item.label}</p>
                <p className="text-white/55 font-light text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY YOS */}
      <section className="bg-warm-grey py-28 lg:py-32">
        <div className="max-w-4xl mx-auto px-[5%]">
          <SectionLabel>Why YOS</SectionLabel>
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-16">
            Local knowledge. No conflicts.
          </h2>
          <p className="text-charcoal font-light text-xl leading-relaxed mb-10">
            Most buyers agents claim to know your market. We actually live and operate in it. We've done deals across the Newcastle CBD, Broadmeadow, Kotara, Maitland, and the broader Hunter Valley. We know which vendors are motivated, which agents play fair, and where the real opportunities sit right now.
          </p>
          <p className="text-charcoal font-light text-xl leading-relaxed">
            We are never paid by vendors. Never paid by agents. Our fee comes from you, which means our job — our only job — is to get you the best possible outcome.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-near-black py-28 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto px-[5%]">
          <h2 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-6">
            Ready to buy smart?
          </h2>
          <p className="text-white/55 font-light text-xl leading-relaxed mb-12">
            Tell us what you're looking for. We'll tell you what's out there and what it would take to get it.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
            Book a Buyer Consultation
          </Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
