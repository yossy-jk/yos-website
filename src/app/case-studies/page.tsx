import Link from 'next/link'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { getAllCaseStudies, type CaseStudy } from '@/lib/case-studies'
import { DIVISION_LABELS, DIVISION_COLORS } from '@/lib/blog'
import { HUBSPOT } from '@/lib/constants'
import type { Division } from '@/lib/blog'

export const metadata = {
  title: 'Case Studies | Your Office Space Newcastle',
  description: 'Real projects, real outcomes. See how Your Office Space has helped Newcastle and Hunter Valley businesses with leasing, fitout, furniture and cleaning.'
}

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <Link href={`/case-studies/${cs.slug}`} className="no-underline group">
      <div className="border border-gray-200 rounded-sm overflow-hidden hover:border-teal transition-colors duration-200 h-full flex flex-col">
        {cs.heroImage && (
          <div className="h-52 overflow-hidden">
            <img
              src={cs.heroImage}
              alt={cs.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIVISION_COLORS[cs.division as Division]}`}>
              {DIVISION_LABELS[cs.division as Division]}
            </span>
            <span className="text-mid-grey text-xs">{cs.location}</span>
          </div>
          <h2 className="text-near-black font-bold text-xl leading-snug mb-3 group-hover:text-teal transition-colors">{cs.title}</h2>
          <p className="text-charcoal font-light text-sm leading-relaxed mb-6 flex-1">{cs.excerpt}</p>
          {cs.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {cs.metrics.slice(0, 2).map(m => (
                <div key={m.label} className="bg-warm-grey rounded p-3">
                  <p className="text-teal font-bold text-lg leading-none mb-1">{m.value}</p>
                  <p className="text-mid-grey font-light text-xs">{m.label}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-teal font-semibold text-sm group-hover:text-dark-teal transition-colors">Read case study →</p>
        </div>
      </div>
    </Link>
  )
}

export default function CaseStudiesPage() {
  const all = getAllCaseStudies()

  return (
    <>
      <Nav />

      <section className="bg-near-black pt-[72px] pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16">
          <SectionLabel>Case studies</SectionLabel>
          <h1 className="text-white font-bold text-6xl lg:text-7xl leading-tight tracking-tight max-w-3xl mb-8">
            Real projects. Real outcomes.
          </h1>
          <p className="text-white/60 font-light text-xl leading-relaxed max-w-2xl">
            Our next clients come from our past work. Here&apos;s the evidence — what we were asked to do, what we did, and what it delivered.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {all.length === 0 ? (
            <p className="text-mid-grey font-light text-lg">Case studies coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {all.map(cs => <CaseStudyCard key={cs.slug} cs={cs} />)}
            </div>
          )}
        </div>
      </section>

      <section className="bg-near-black py-20 text-center">
        <div className="max-w-2xl mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-white font-bold text-4xl leading-tight mb-4">Want results like these?</h2>
          <p className="text-white/60 font-light text-lg mb-8">Tell us what you&apos;re trying to achieve. We&apos;ll tell you honestly whether we can help.</p>
          <Button href={HUBSPOT.bookingUrl} variant="primary" external size="lg">Book a Clarity Call</Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
