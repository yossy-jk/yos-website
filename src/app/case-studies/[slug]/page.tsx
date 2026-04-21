import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/case-studies'
import { DIVISION_LABELS, DIVISION_COLORS } from '@/lib/blog'
import { HUBSPOT } from '@/lib/constants'
import type { Division } from '@/lib/blog'

export async function generateStaticParams() {
  return getAllCaseStudies().map(cs => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudyBySlug(slug)
  if (!cs) return {}
  return {
    title: cs.metaTitle || `${cs.title} | Your Office Space`,
    description: cs.metaDescription || cs.excerpt,
    alternates: { canonical: `https://yourofficespace.au/case-studies/${cs.slug}` },
    openGraph: {
      title: cs.metaTitle || cs.title,
      description: cs.metaDescription || cs.excerpt,
      url: `https://yourofficespace.au/case-studies/${cs.slug}`,
      siteName: 'Your Office Space',
      locale: 'en_AU',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: cs.metaTitle || cs.title,
      description: cs.metaDescription || cs.excerpt,
    },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudyBySlug(slug)
  if (!cs) notFound()


  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cs.title,
    description: cs.metaDescription || cs.excerpt,
    author: { '@type': 'Organization', name: 'Your Office Space', url: 'https://yourofficespace.au' },
    publisher: { '@type': 'Organization', name: 'Your Office Space', url: 'https://yourofficespace.au' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://yourofficespace.au/case-studies/${cs.slug}` },
    ...(cs.heroImage ? { image: `https://yourofficespace.au${cs.heroImage}` } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      {/* HERO */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(5rem,10vw,8rem)' }}>
        {cs.heroImage && (
          <div className="relative h-72 lg:h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cs.heroImage} alt={cs.title} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-near-black/60" />
          </div>
        )}
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DIVISION_COLORS[cs.division as Division]}`}>
              {DIVISION_LABELS[cs.division as Division]}
            </span>
            <span className="text-white/40 text-xs">{cs.location}</span>
          </div>
          <h1 className="text-white font-bold text-4xl lg:text-5xl leading-tight mb-6">{cs.title}</h1>
          <p className="text-white/60 font-light text-xl leading-relaxed">{cs.excerpt}</p>
        </div>
      </section>

      {/* METRICS BAR */}
      {cs.metrics.length > 0 && (
        <section className="bg-teal py-10">
          <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
            <div className={`grid grid-cols-2 md:grid-cols-${Math.min(cs.metrics.length, 4)} gap-6`}>
              {cs.metrics.map(m => (
                <div key={m.label} className="text-center">
                  <p className="text-white font-bold text-3xl lg:text-4xl mb-1">{m.value}</p>
                  <p className="text-white/70 font-light text-xs">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BODY */}
      <section className="bg-white" style={{ paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">The challenge</p>
                <p className="text-charcoal font-light text-lg leading-relaxed">{cs.challenge}</p>
              </div>
              <div>
                <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">What we did</p>
                <p className="text-charcoal font-light text-lg leading-relaxed">{cs.solution}</p>
              </div>
              <div>
                <p className="text-teal font-semibold text-xs tracking-widest uppercase mb-4">The outcome</p>
                <p className="text-charcoal font-light text-lg leading-relaxed">{cs.outcome}</p>
              </div>

              {cs.quote && (
                <blockquote className="border-l-4 border-teal pl-8 py-2">
                  <p className="text-near-black font-light text-xl leading-relaxed mb-4">
                    &ldquo;{cs.quote.text}&rdquo;
                  </p>
                  <p className="text-mid-grey font-semibold text-xs tracking-widest uppercase">{cs.quote.attribution}</p>
                </blockquote>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="space-y-8">
              <div className="bg-warm-grey rounded-xl p-8">
                <p className="text-near-black font-bold text-sm mb-6">Project details</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-mid-grey font-light text-xs uppercase tracking-widest mb-1">Division</p>
                    <p className="text-near-black font-semibold text-sm">{DIVISION_LABELS[cs.division as Division]}</p>
                  </div>
                  <div>
                    <p className="text-mid-grey font-light text-xs uppercase tracking-widest mb-1">Location</p>
                    <p className="text-near-black font-semibold text-sm">{cs.location}</p>
                  </div>
                  <div>
                    <p className="text-mid-grey font-light text-xs uppercase tracking-widest mb-1">Client</p>
                    <p className="text-near-black font-semibold text-sm">{cs.client}</p>
                  </div>
                  {cs.tags.length > 0 && (
                    <div>
                      <p className="text-mid-grey font-light text-xs uppercase tracking-widest mb-2">Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {cs.tags.map(tag => (
                          <span key={tag} className="bg-white border border-gray-200 text-charcoal text-xs px-3 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-near-black rounded-xl p-8">
                <p className="text-white font-bold text-base mb-3">Want a similar outcome?</p>
                <p className="text-white/60 font-light text-sm mb-6">Talk to us about your situation. First conversation is always free.</p>
                <Button href={HUBSPOT.bookingUrl} variant="primary" external>Book a call</Button>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-gray-100">
            <Link href="/case-studies" className="text-teal font-semibold text-sm no-underline hover:text-dark-teal transition-colors">
              ← All case studies
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
