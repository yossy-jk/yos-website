import { withPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import Nav from '@/components/Nav'
import SectionLabel from '@/components/SectionLabel'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { getAllCaseStudies, type CaseStudy } from '@/lib/case-studies'
import { DIVISION_LABELS, DIVISION_COLORS } from '@/lib/blog'
import type { Division } from '@/lib/blog'

const hasPublishedStudies = getAllCaseStudies().length > 0

export const metadata = withPageSeo({
  robots: hasPublishedStudies ? undefined : { index: false, follow: true },
  title: 'Case Studies | Your Office Space',
  description: 'Explore Your Office Space services and practical workplace planning guides. Approved project case studies will be added when available.',
  alternates: { canonical: 'https://www.yourofficespace.au/case-studies' },
  twitter: { card: 'summary_large_image', title: 'Case Studies | Your Office Space', description: 'Explore Your Office Space services and practical workplace planning guides. Approved project case studies will be added when available.' },
  openGraph: {
    title: 'Case Studies | Your Office Space',
    description: 'Explore Your Office Space services and practical workplace planning guides. Approved project case studies will be added when available.',
    url: 'https://www.yourofficespace.au/case-studies',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
    images: [{ url: '/og/og-case-studies.png', width: 1200, height: 630, alt: 'Case Studies, Your Office Space' }],
  },
})

const SEC  = { paddingTop: 'clamp(5rem,10vw,12rem)', paddingBottom: 'clamp(5rem,10vw,12rem)' }
const WRAP = 'max-w-screen-xl mx-auto'
const PAD  = { paddingLeft: 'clamp(1.5rem,8vw,10rem)', paddingRight: 'clamp(1.5rem,8vw,10rem)' }

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <Link href={`/case-studies/${cs.slug}`} className="no-underline group">
      <div className="border border-white/10 overflow-hidden hover:border-teal transition-colors duration-200 h-full flex flex-col">
        {cs.heroImage && (
          <div className="h-52 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cs.heroImage}
              alt={cs.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold px-3 py-1 rounded-sm ${DIVISION_COLORS[cs.division as Division]}`}>
              {DIVISION_LABELS[cs.division as Division]}
            </span>
            <span className="text-mid-grey text-xs">{cs.location}</span>
          </div>
          <h2 className="text-near-black font-bold text-xl leading-snug mb-3 group-hover:text-teal transition-colors">{cs.title}</h2>
          <p className="text-charcoal font-light text-sm leading-relaxed mb-6 flex-1">{cs.excerpt}</p>
          {cs.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {cs.metrics.slice(0, 2).map(m => (
                <div key={m.label} className="bg-warm-grey p-3">
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

      {all.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'YOS case studies', numberOfItems: all.length, itemListElement: all.map((study, index) => ({ '@type': 'ListItem', position: index + 1, url: `https://www.yourofficespace.au/case-studies/${study.slug}` })) }) }} />}
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(7rem,14vw,13rem)', paddingBottom: 'clamp(5rem,10vw,8rem)' }}>
        <div className={WRAP} style={PAD}>
          <SectionLabel>Case studies</SectionLabel>
          <h1 className="text-white font-bold leading-tight tracking-tight max-w-3xl mb-6"
            style={{ fontSize: 'clamp(2.25rem,6vw,5rem)' }}>
            {all.length > 0 ? <>Real projects.<br />Real outcomes.</> : <>Plan your next<br />workplace project.</>}
          </h1>
          <p className="text-white/60 font-light leading-relaxed max-w-2xl"
            style={{ fontSize: 'clamp(1rem,2vw,1.25rem)' }}>
            {all.length > 0 ? "Explore approved project briefs, YOS’s role and documented outcomes." : "Explore our services and practical planning guides while approved project case studies are being prepared."}
          </p>
        </div>
      </section>

      {/* ─── GRID ─────────────────────────────────────────── */}
      <section className="bg-white" style={SEC}>
        <div className={WRAP} style={PAD}>
          {all.length === 0 ? (
            <div><p className="text-charcoal text-lg" style={{ marginBottom: 24 }}>Approved case studies will be added when available. Start with a practical guide for your next decision.</p><Button href="/blog" variant="primary">Explore articles &amp; guides</Button></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {all.map(cs => <CaseStudyCard key={cs.slug} cs={cs} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section className="bg-near-black" style={SEC}>
        <div className={WRAP} style={PAD}>
          <div className="flex flex-col items-center text-center" style={{ maxWidth: '44rem', margin: '0 auto' }}>
            <h2 className="text-white font-bold leading-tight mb-4 w-full" style={{ fontSize: 'clamp(1.75rem,4vw,3rem)' }}>
              Tell us what you want to achieve.
            </h2>
            <p className="text-white/60 font-light text-lg mb-10 w-full">
              Tell us what you&apos;re trying to achieve. We&apos;ll tell you honestly whether we can help.
            </p>
            <Button href="/contact#contact-enquiry" variant="primary" size="lg">Enquire</Button>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </>
  )
}
