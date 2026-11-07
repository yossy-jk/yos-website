import styles from '../case-studies.module.css'
import Image from 'next/image'
import ContentBreadcrumbs from '@/components/ContentBreadcrumbs'
import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'
import { absoluteAssetUrl } from '@/lib/page-seo'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Button from '@/components/Button'
import Footer from '@/components/Footer'
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/case-studies'
import { DIVISION_LABELS, DIVISION_COLORS } from '@/lib/blog'
import { ENQUIRY } from '@/lib/constants'
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
    alternates: { canonical: `https://www.yourofficespace.au/case-studies/${cs.slug}` },
    openGraph: {

  images: [{ url: absoluteAssetUrl(cs.heroImage || '/og/og-case-studies.png'), alt: cs.title }],
title: cs.metaTitle || cs.title,
      description: cs.metaDescription || cs.excerpt,
      url: `https://www.yourofficespace.au/case-studies/${cs.slug}`,
      siteName: 'Your Office Space',
      locale: 'en_AU',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: cs.metaTitle || cs.title,
      description: cs.metaDescription || cs.excerpt,
      images: [absoluteAssetUrl(cs.heroImage || '/og/og-case-studies.png')],
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
    author: ORGANIZATION_SCHEMA,
    publisher: ORGANIZATION_SCHEMA,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.yourofficespace.au/case-studies/${cs.slug}` },
    datePublished: cs.date,
    ...(cs.heroImage ? { image: absoluteAssetUrl(cs.heroImage) } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      <main id="main-content" tabIndex={-1}>

      {/* HERO */}
      <section className="bg-near-black" style={{ paddingTop: 'clamp(5rem,10vw,8rem)' }}>
        {cs.heroImage && (
          <div className="relative h-72 lg:h-96 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cs.heroImage} alt={cs.title} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-near-black/60" />
          </div>
        )}
        <div className={`${styles.wrap} ${styles.intro}`}>
          {cs.logo && <div className={styles.logo}><Image src={cs.logo} alt={`${cs.client} logo`} width={294} height={165} className="max-w-full h-auto" /></div>}
          <ContentBreadcrumbs section="Case studies" sectionPath="/case-studies" title={cs.title} path={`/case-studies/${cs.slug}`} />
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs font-semibold px-3 py-1 rounded-sm ${DIVISION_COLORS[cs.division as Division]}`}>
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
        <section className={`bg-teal ${styles.metrics}`}>
          <div className={styles.wrap}>
            <div className={`${styles.metricsGrid} grid grid-cols-2 ${cs.metrics.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-6`}>
              {cs.metrics.map(m => (
                <div key={m.label} className="text-center">
                  <p className="text-near-black font-bold text-3xl lg:text-4xl mb-1">{m.value}</p>
                  <p className="text-near-black font-medium text-xs">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BODY */}
      <section className="bg-white" style={{ paddingTop: 'clamp(4rem,8vw,7rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div className={styles.wrap}>
          <div className={styles.bodyGrid}>
            <div className={styles.story}>
              {cs.sections ? <>
                <p className="text-charcoal font-light text-lg leading-relaxed">{cs.challenge}</p>
                <p className="text-charcoal font-light text-lg leading-relaxed">{cs.solution}</p>
                {cs.sections.map(section => <section key={section.heading}>
                  <h2 className="text-near-black font-bold text-2xl leading-snug mb-5">{section.heading}</h2>
                  {section.paragraphs.map(paragraph => <p key={paragraph} className="text-charcoal font-light text-lg leading-relaxed mb-5">{paragraph}</p>)}
                  {section.bullets && <ul className="list-disc pl-6 text-charcoal text-lg leading-relaxed space-y-2">{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
                </section>)}
              </> : <>
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

              </>}
              {cs.quote?.approvedForPublication === true && <section>
                <h2 className="text-near-black font-bold text-2xl mb-5">What {cs.client} said</h2>
                <figure className="border-l-4 border-teal pl-6">
                  <blockquote className="text-charcoal text-lg leading-relaxed space-y-5">{cs.quote.text.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}</blockquote>
                  <figcaption className="mt-6 text-near-black font-semibold">{cs.quote.attribution}</figcaption>
                </figure>
              </section>}
              {cs.closing && <section>
                <h2 className="text-near-black font-bold text-2xl mb-5">{cs.closing.heading}</h2>
                {cs.closing.paragraphs.map(paragraph => <p key={paragraph} className="text-charcoal text-lg leading-relaxed mb-5">{paragraph}</p>)}
                <Button href={cs.closing.href} variant="primary">{cs.closing.linkText}</Button>
              </section>}
              {/* Only explicitly approved quotations are displayed. */}
            </div>

            {/* SIDEBAR */}
            <div className={styles.sidebar}>
              <div className="bg-warm-grey rounded-sm p-8">
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
                          <span key={tag} className="bg-white border border-gray-200 text-charcoal text-xs px-3 py-1 rounded-sm">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-near-black rounded-sm p-8">
                <p className="text-white font-bold text-base mb-3">Want a similar outcome?</p>
                <p className="text-white/60 font-light text-sm mb-6">Talk to us about your situation. First conversation is always free.</p>
                <Button href={ENQUIRY.contactUrl} variant="primary">Request a call</Button>
              </div>
            </div>
          </div>

          <div className={`${styles.back} border-t border-gray-100`}>
            <Link href="/case-studies" className="text-teal font-semibold text-sm no-underline hover:text-dark-teal transition-colors">
              ← All case studies
            </Link>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </>
  )
}
