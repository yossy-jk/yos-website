import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'

export default function Home() {
  return (
    <>
      <Nav />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-72px">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          alt="Premium Newcastle commercial office space"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-near-black/78" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5% pt-20">
          <SectionLabel>Newcastle Commercial Property</SectionLabel>
          <h1 className="text-white font-bold text-6xl lg:text-8xl leading-tight tracking-tight max-w-2xl mb-7">
            Your space is your competitive advantage.
          </h1>
          <p className="text-white/70 font-light text-xl lg:text-2xl leading-relaxed max-w-2xl mb-12">
            We handle the lease, the fitout, the furniture, and the cleaning. One team. Your interests first. Newcastle through and through.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button href={HUBSPOT.bookingUrl} variant="primary" external>
              Book a Clarity Call
            </Button>
            <Button href="/resources" variant="secondary">
              Explore free tools →
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/40 text-sm tracking-widest text-center">
          <div className="w-px h-12 bg-white/20 mx-auto mb-2" />
          SCROLL
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="bg-white border-b border-gray-100 py-8 lg:py-8">
        <div className="max-w-7xl mx-auto px-5% grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {[
            { stat: '100+', label: 'Fitouts delivered' },
            { stat: 'Newcastle & Hunter', label: 'Exclusively local' },
            { stat: 'Tenant-side only', label: 'No conflicts of interest' },
            { stat: 'Lease to clean', label: 'End-to-end service' }
          ].map((item, i) => (
            <div key={i} className="py-4 md:py-0 px-0 md:px-8 text-center">
              <p className="text-near-black font-bold text-xl mb-1">{item.stat}</p>
              <p className="text-mid-grey text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5%">
          <SectionLabel>What we do</SectionLabel>
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-20 max-w-xl">
            Every part of the workspace problem. One team.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {[
              {
                title: "Tenant Rep",
                tagline: "Your lease. Your terms. Your call.",
                body: "We represent the tenant — never the landlord. Every negotiation, every clause, every deal is done purely in your interest. Most businesses sign without anyone in their corner. Ours don't.",
                href: "/tenant-rep",
                img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Buyers Agency",
                tagline: "Buy commercial in Newcastle without getting burned.",
                body: "Off-market access, rigorous due diligence, and hard negotiations — handled by someone who does this every day. Not just when your lease expires.",
                href: "/buyers-agency",
                img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Furniture",
                tagline: "Spaces that work. Furniture that lasts.",
                body: "Government-approved supplier. Fitout project management, ergonomic workstations, full office solutions — delivered across Newcastle and the Hunter Valley.",
                href: "/furniture",
                img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
              },
              {
                title: "Cleaning",
                tagline: "Shows up. Does the job. Every time.",
                body: "Commercial cleaning for offices, childcare centres, medical practices, and industrial facilities. Consistent, accountable, and Newcastle-based.",
                href: "/cleaning",
                img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
              }
            ].map((service) => (
              <div key={service.title} className="flex flex-col">
                <div className="relative h-60 overflow-hidden mb-0">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="border-t-4 border-teal pt-6 flex-1 flex flex-col">
                  <h3 className="text-near-black font-bold text-2xl mb-2">{service.title}</h3>
                  <p className="text-teal font-semibold text-sm mb-3">{service.tagline}</p>
                  <p className="text-charcoal font-normal text-sm leading-relaxed mb-5 flex-1">
                    {service.body}
                  </p>
                  <Link href={service.href} className="text-teal font-semibold text-sm no-underline hover:text-dark-teal transition-colors">
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY YOS — DARK SECTION */}
      <section className="bg-near-black py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5% grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          <div>
            <SectionLabel>Why YOS</SectionLabel>
            <h2 className="text-white font-bold text-4xl lg:text-5xl leading-tight mb-8">
              One team.<br />
              No conflicts.<br />
              No shortcuts.
            </h2>
            <p className="text-white/50 font-light text-lg leading-relaxed">
              Most commercial property advisors work both sides of the deal. We don't. Every decision we make is in your interest — because that's the only interest we have.
            </p>
          </div>
          
          <div className="flex flex-col gap-10">
            {[
              {
                label: "Tenant-side only",
                body: "We never represent landlords or vendors. No split loyalty. No backdoor deals. When we negotiate, we are negotiating for you."
              },
              {
                label: "Newcastle-first",
                body: "We live and work here. We know which landlords play fair and which ones don't. That knowledge is worth more than any Sydney firm's database."
              },
              {
                label: "End-to-end",
                body: "Lease to clean. One relationship, one accountable team from your first property decision through to the day your space is running properly."
              }
            ].map((point) => (
              <div key={point.label} className="pl-6 border-l-4 border-teal">
                <p className="text-white font-bold text-xl mb-2">{point.label}</p>
                <p className="text-white/55 font-light text-sm leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCE HUB — TEAL SECTION */}
      <section className="bg-teal py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5% grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionLabel>Free tools</SectionLabel>
            <h2 className="text-white font-bold text-4xl lg:text-5xl leading-tight mb-6">
              Built for Newcastle businesses. Free to use.
            </h2>
            <p className="text-white/80 font-light text-xl leading-relaxed mb-10">
              Lease review analysis. Fitout cost estimator. Cap rate calculator. Commercial lease comparison. No signup required to start.
            </p>
            <Button href="/resources" variant="dark">
              Explore the Resource Hub →
            </Button>
          </div>
          
          <div className="flex flex-col gap-3">
            {[
              'Lease Review Analysis — free basic report, $150 detailed',
              'Fitout Cost Estimator — Newcastle market rates',
              'Cap Rate Calculator — for commercial investors',
              'Lease Comparison Tool — true cost across 3 options',
              'Commercial Purchase Checklist — 25-point due diligence'
            ].map((tool, i) => (
              <div key={i} className="bg-white/15 rounded px-5 py-4 flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <p className="text-white font-normal text-sm">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-warm-grey py-28 lg:py-32">
        <div className="max-w-2xl mx-auto px-5% text-center">
          <p className="text-teal font-bold text-7xl mb-6 leading-none">"</p>
          <p className="text-near-black font-light text-2xl lg:text-3xl leading-relaxed mb-8">
            Thanks to Joe and the YOS team, we now have a state-of-the-art facility that not only meets but exceeds our expectations. I wholeheartedly recommend them to anyone seeking a dedicated and knowledgeable commercial property advisor in Newcastle.
          </p>
          <p className="text-mid-grey font-semibold text-xs tracking-widest uppercase">
            Newcastle Business Owner
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-near-black py-28 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto px-5%">
          <h2 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-6">
            Ready to talk?
          </h2>
          <p className="text-white/55 font-light text-xl leading-relaxed mb-12">
            20 minutes. No pitch. Just a conversation about what you are trying to build and whether we can help.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
            Book a Clarity Call
          </Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
