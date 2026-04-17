import Link from 'next/link'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { HUBSPOT } from '@/lib/constants'

export const metadata = {
  title: 'Free Commercial Property Tools | Your Office Space',
  description: 'Free commercial property tools for Newcastle businesses. Lease review analysis, fitout cost estimator, cap rate calculator, and more.'
}

const tools = [
  {
    title: 'Lease Risk Checker',
    description: 'Answer 10 questions about your lease and get an instant risk report. We flag the clauses that need attention — and tell you what to negotiate before you sign.',
    tag: 'Free',
    tagColor: 'bg-teal',
    href: '/resources/lease-review',
    features: ['10-question risk assessment', 'Clause-by-clause flags', 'Plain-English advice', 'Instant results']
  },
  {
    title: 'Fitout Cost Estimator',
    description: 'Estimate your fitout cost using the YOS Cost Guide — Newcastle and Hunter Region market rates. Full breakdown by category across Basic, Mid-Range and Premium tiers.',
    tag: 'Free',
    tagColor: 'bg-teal',
    href: '/resources/fitout-estimator',
    features: ['April 2026 market rates', 'Three quality tiers', 'Category-by-category breakdown', 'Contingency included']
  },
  {
    title: 'Cap Rate Calculator',
    description: 'Calculate the capitalisation rate on any commercial property investment. Understand yield, net income, implied value at multiple cap rates, and how it compares to Newcastle market benchmarks.',
    tag: 'Free',
    tagColor: 'bg-teal',
    href: '/resources/cap-rate-calculator',
    features: ['Net income calculation', 'Implied value at 5%, 6%, 7%', 'Newcastle market benchmarks', 'Vacancy + outgoings included']
  },
  {
    title: 'Lease Comparison Tool',
    description: 'Compare up to three lease options side-by-side on true occupancy cost — not just face rent. Factor in rent-free periods, outgoings, make-good, and get a net present value comparison.',
    tag: 'Free',
    tagColor: 'bg-teal',
    href: '/resources/lease-comparison',
    features: ['3-way side-by-side comparison', 'Effective rent after incentives', 'Net Present Value (7% discount)', 'Lowest true cost highlighted']
  },
  {
    title: 'Commercial Purchase Checklist',
    description: 'An interactive 25-point due diligence checklist for commercial property buyers in NSW. Tick each item off as you complete it and track your progress to exchange.',
    tag: 'Free',
    tagColor: 'bg-teal',
    href: '/resources/purchase-checklist',
    features: ['25 due diligence checks', 'Tick-off as you go', 'Zoning, title, building & tenancy', 'NSW-specific']
  }
]

export default function ResourcesPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center pt-[72px] bg-near-black">
        <div className="max-w-7xl mx-auto px-[5%] w-full pt-20 pb-20">
          <SectionLabel>Free tools</SectionLabel>
          <h1 className="text-white font-bold text-6xl lg:text-7xl leading-tight tracking-tight max-w-3xl mb-8">
            Built for Newcastle businesses. Free to use.
          </h1>
          <p className="text-white/70 font-light text-xl lg:text-2xl leading-relaxed max-w-2xl">
            Real tools that help you make better commercial property decisions — no signup required to start.
          </p>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="bg-white py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {tools.map((tool) => (
              <div key={tool.title} className="border border-gray-200 rounded-lg p-10 flex flex-col hover:border-teal transition-colors duration-200">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-near-black font-bold text-2xl max-w-xs">{tool.title}</h2>
                  <span className={`${tool.tagColor} text-white font-semibold text-xs px-3 py-1 rounded-full flex-shrink-0 ml-4`}>
                    {tool.tag}
                  </span>
                </div>
                <p className="text-charcoal font-light text-sm leading-relaxed mb-6 flex-1">{tool.description}</p>
                <ul className="grid grid-cols-2 gap-2 mb-8">
                  {tool.features.map((f, i) => (
                    <li key={i} className="flex gap-2 items-center">
                      <div className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0" />
                      <span className="text-mid-grey text-xs">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tool.href}
                  className="text-teal font-semibold text-sm no-underline hover:text-dark-teal transition-colors"
                >
                  Open tool →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEED MORE HELP */}
      <section className="bg-warm-grey py-28 lg:py-32">
        <div className="max-w-4xl mx-auto px-[5%] text-center">
          <SectionLabel>Need more?</SectionLabel>
          <h2 className="text-near-black font-bold text-4xl lg:text-5xl leading-tight mb-8">
            Tools are a starting point. Advice is what moves the needle.
          </h2>
          <p className="text-charcoal font-light text-xl leading-relaxed mb-12">
            Use our free tools to build your understanding. Then talk to us when you&apos;re ready to make a move. We don&apos;t charge for the first conversation.
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
