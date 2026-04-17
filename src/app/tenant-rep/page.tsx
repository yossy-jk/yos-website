import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import { HUBSPOT, CONTACT } from '@/lib/constants'

export default function TenantRepPage() {
  return (
    <>
      <Nav />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-72px bg-near-black">
        <div className="max-w-7xl mx-auto px-5% w-full pt-20">
          <SectionLabel>Tenant Representation</SectionLabel>
          <h1 className="text-white font-bold text-6xl lg:text-8xl leading-tight tracking-tight max-w-3xl mb-8">
            We negotiate leases for tenants. Never landlords.
          </h1>
          <p className="text-white/70 font-light text-xl lg:text-2xl leading-relaxed max-w-2xl mb-12">
            Your interests first. No split loyalty. No backdoor deals. Every negotiation is structured to protect you and position your business for growth.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">
            Book a Clarity Call
          </Button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5%">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-20 max-w-2xl">
            Four clear steps to your next lease.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Briefing',
                body: 'We understand your business. Space requirements, budget, timeline, non-negotiables. Nothing goes unsigned until you are completely clear on what it means.'
              },
              {
                step: '02',
                title: 'Market Search',
                body: 'We canvass the market — on-market, off-market, pre-release. Newcastle commercial inside out. We find options your broker missed.'
              },
              {
                step: '03',
                title: 'Negotiation',
                body: 'We handle every clause, every rate, every timeline. Legal review included. Your seat at the table is secured from day one.'
              },
              {
                step: '04',
                title: 'Handover',
                body: 'Signed. Settled. We coordinate the fitout, furniture, and cleaning. You focus on running your business, not managing contractors.'
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col">
                <p className="text-teal font-bold text-5xl mb-4 leading-none">{item.step}</p>
                <h3 className="text-near-black font-bold text-2xl mb-4">{item.title}</h3>
                <p className="text-charcoal font-light text-sm leading-relaxed flex-1">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-warm-grey py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-5%">
          <SectionLabel>What's included</SectionLabel>
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-20 max-w-2xl">
            Everything you need to make the right call.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: 'Lease Review',
                items: [
                  'Full clause-by-clause analysis',
                  'Risk flagging and explanation',
                  'Negotiation strategy',
                  'Legal review (included)'
                ]
              },
              {
                title: 'Market Comparison',
                items: [
                  'Rate benchmarking across Newcastle',
                  'Comparable properties',
                  'Market trends',
                  'Negotiating leverage data'
                ]
              },
              {
                title: 'Negotiation Support',
                items: [
                  'Direct landlord contact',
                  'Counter-offer strategy',
                  'Timeline management',
                  'Deal closure coordination'
                ]
              },
              {
                title: 'Fitout Coordination',
                items: [
                  'Furniture and design brief',
                  'Contractor quotes',
                  'Timeline management',
                  'Quality assurance'
                ]
              },
              {
                title: 'Cleaning Handover',
                items: [
                  'Cleaning provider setup',
                  'Initial deep clean',
                  'Ongoing maintenance plan',
                  'Team training'
                ]
              },
              {
                title: 'Ongoing Support',
                items: [
                  'Lease milestone reminders',
                  'Renewal negotiation prep',
                  'Dispute resolution',
                  'Direct line to Joe'
                ]
              }
            ].map((category, i) => (
              <div key={i} className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-near-black font-bold text-xl mb-6 border-b-2 border-teal pb-4">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0 mt-1.5" />
                      <span className="text-charcoal font-light text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="bg-near-black py-28 lg:py-32">
        <div className="max-w-4xl mx-auto px-5%">
          <SectionLabel>Why conflict of interest matters</SectionLabel>
          <h2 className="text-white font-bold text-4xl lg:text-5xl leading-tight mb-12">
            The problem with standard practice.
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-bold text-2xl mb-4">Most brokers work both sides</h3>
              <p className="text-white/70 font-light text-lg leading-relaxed">
                The majority of commercial property advisors make money from both tenants and landlords. It's impossible to be fully on your side when someone is also representing the person across the table from you. The incentives are split. The leverage is negotiated away.
              </p>
            </div>

            <div className="border-l-4 border-teal pl-8 py-4">
              <p className="text-white font-light text-lg leading-relaxed">
                We only represent tenants. We will never represent a landlord. That means every word of every lease is read through one lens: does this protect the tenant? Every negotiation has one outcome: the best deal for the business signing the lease.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-2xl mb-4">What you get from this</h3>
              <ul className="space-y-3">
                {[
                  'Harder negotiation on rent, fit-out contributions, lease length',
                  'Protective clauses most tenants never get',
                  'Real market intelligence about which landlords negotiate in good faith',
                  'A second pair of eyes on the fine print',
                  'Someone in the room whose job it is to stop you from signing a bad deal'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0 mt-2" />
                    <span className="text-white/70 font-light text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-teal py-28 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto px-5%">
          <h2 className="text-white font-bold text-5xl lg:text-6xl leading-tight mb-6">
            Let's talk about your next lease.
          </h2>
          <p className="text-white/80 font-light text-xl leading-relaxed mb-12">
            20 minutes. No pitch. Just a conversation about your space and what you're trying to achieve.
          </p>
          <Button href={HUBSPOT.bookingUrl} variant="dark" external size="lg">
            Book a Clarity Call
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-5%">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <p className="text-white font-bold text-sm tracking-widest mb-3 uppercase">Your Office Space</p>
              <p className="text-mid-grey font-light text-sm leading-relaxed">
                Newcastle's commercial property team. Lease, fitout, furniture, cleaning.
              </p>
            </div>
            
            <div>
              <p className="text-white font-semibold text-xs tracking-widest mb-4 uppercase">Services</p>
              <nav className="flex flex-col gap-2">
                {[
                  { label: 'Tenant Rep', href: '/tenant-rep' },
                  { label: 'Buyers Agency', href: '/buyers-agency' },
                  { label: 'Furniture', href: '/furniture' },
                  { label: 'Cleaning', href: '/cleaning' }
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-mid-grey text-sm no-underline hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div>
              <p className="text-white font-semibold text-xs tracking-widest mb-4 uppercase">Contact</p>
              <div className="flex flex-col gap-2">
                <a href={`mailto:${CONTACT.email}`} className="text-mid-grey text-sm no-underline hover:text-white transition-colors">
                  {CONTACT.email}
                </a>
                <a href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`} className="text-mid-grey text-sm no-underline hover:text-white transition-colors">
                  {CONTACT.phone}
                </a>
                <p className="text-mid-grey text-sm">{CONTACT.location}</p>
              </div>
            </div>

            <div>
              <p className="text-white font-semibold text-xs tracking-widest mb-4 uppercase">More</p>
              <Link href="/" className="text-mid-grey text-sm no-underline hover:text-white transition-colors block">
                Home
              </Link>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-4">
            <p className="text-mid-grey text-xs">{CONTACT.license}</p>
            <p className="text-mid-grey text-xs">© {new Date().getFullYear()} Your Office Space Pty Ltd</p>
          </div>
        </div>
      </footer>
    </>
  )
}
