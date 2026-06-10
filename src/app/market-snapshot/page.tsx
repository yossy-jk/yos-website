import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import MarketSnapshotPageContent from './MarketSnapshotPageContent'

export const metadata: Metadata = {
  title: 'Newcastle Office Market Snapshot | Your Office Space',
  description: 'Monthly market intelligence from the tenant\'s side. Vacancy rates, rent trends, supply pipeline, and which way leverage is moving in the Newcastle office market.',
  alternates: { canonical: 'https://www.yourofficespace.au/market-snapshot' },
  openGraph: {
    
  images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Your Office Space' }],
title: 'Newcastle Office Market Snapshot | Your Office Space',
    description: 'Monthly market intelligence from the tenant\'s side. Vacancy rates, rent trends, supply pipeline — what landlords already know but tenants don\'t.',
    url: 'https://yourofficespace.au/market-snapshot',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newcastle Office Market Snapshot',
    description: 'Monthly office market intelligence from the tenant\'s side.',
  },
}

export default function MarketSnapshotPage() {
  // Read snapshot content at build/request time (server-side only)
  let snapshotContent = ''
  try {
    const mdPath = path.join(
      process.cwd(),
      'src',
      'content',
      'market-snapshot',
      'newcastle-office-snapshot-may-2026.md'
    )
    snapshotContent = readFileSync(mdPath, 'utf8')
  } catch (err) {
    console.warn('Could not read snapshot markdown:', err)
    snapshotContent = '# Newcastle Office Market Snapshot\n\nContent coming soon.'
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://www.yourofficespace.au/#organization",
            "name": "Your Office Space",
            "url": "https://www.yourofficespace.au",
            "logo": "https://www.yourofficespace.au/logo.png",
            "telephone": "+61434655511",
            "email": "jk@yourofficespace.au",
            "description": "Tenant-side commercial property advisory. Newcastle and NSW. Tenant rep, buyers agency, furniture, fitout and commercial cleaning.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Newcastle",
              "addressRegion": "NSW",
              "postalCode": "2300",
              "addressCountry": "AU"
            },
            "areaServed": [
              { "@type": "City", "name": "Newcastle" },
              { "@type": "City", "name": "Maitland" },
              { "@type": "State", "name": "New South Wales" }
            ]
          },
          {
            "@type": "Article",
            "headline": "Newcastle Office Market Snapshot — Q2 2026",
            "description": "Monthly market intelligence from the tenant's side. Newcastle office vacancy rates, rent trends, supply pipeline and market analysis.",
            "author": { "@type": "Person", "name": "Joe Kelley", "worksFor": { "@id": "https://www.yourofficespace.au/#organization" } },
            "publisher": { "@id": "https://www.yourofficespace.au/#organization" },
            "datePublished": "2026-05-01",
            "dateModified": "2026-05-24",
            "url": "https://www.yourofficespace.au/market-snapshot",
            "about": { "@type": "Place", "name": "Newcastle Commercial Office Market", "address": { "@type": "PostalAddress", "addressLocality": "Newcastle", "addressRegion": "NSW", "addressCountry": "AU" } }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Is the Newcastle office market tenant-friendly in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Newcastle office market in 2026 is broadly tenant-friendly, with vacancy rates providing negotiating leverage. Incentives remain competitive, particularly for quality A-grade space. Tenants who engage a tenant representative consistently achieve better outcomes than those who negotiate directly." } },
              { "@type": "Question", "name": "What are current vacancy rates in Newcastle CBD?", "acceptedAnswer": { "@type": "Answer", "text": "Vacancy rates in the Newcastle CBD have moderated from their 2022-23 highs. The market remains tenant-friendly at the upper end, with landlords offering extended rent-free periods and fitout contributions to attract quality tenants. Speak to Your Office Space for current market data specific to your requirements." } },
              { "@type": "Question", "name": "Should I renew my lease now or look at alternatives?", "acceptedAnswer": { "@type": "Answer", "text": "Most businesses should explore their options 12 months before lease expiry, regardless of whether they plan to stay. The Newcastle market in 2026 offers real negotiating leverage for tenants willing to use it. A tenant representative can assess your current position and identify whether a renewal, relocation, or renegotiation delivers the best outcome." } }
            ]
          }
        ]
      }) }} />
      <MarketSnapshotPageContent
        snapshotContent={snapshotContent}
        leaseIntelHref="/leaseintel"
      />
    </>
  )
}
