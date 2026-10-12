import { ORGANIZATION_SCHEMA } from '@/lib/site-schema'
import { withPageSeo } from '@/lib/page-seo'
import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import MarketSnapshotPageContent from './MarketSnapshotPageContent'

export const metadata: Metadata = withPageSeo({
  title: 'Newcastle Office Market Snapshot, May 2026 | Your Office Space',
  description: 'Read the May 2026 Newcastle office market snapshot, with dated vacancy, rent and supply commentary. Ask YOS for a current, brief-specific assessment.',
  alternates: { canonical: 'https://www.yourofficespace.au/market-snapshot' },
  openGraph: {
    title: 'Newcastle Office Market Snapshot, May 2026 | Your Office Space',
    description: 'Read the May 2026 Newcastle office market snapshot, with dated vacancy, rent and supply commentary. Ask YOS for a current, brief-specific assessment.',
    url: 'https://www.yourofficespace.au/market-snapshot',
    images: [{ url: '/og/og-market-snapshot.png', width: 1200, height: 630, alt: 'Newcastle Office Market Snapshot, May 2026 | Your Office Space' }],
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newcastle Office Market Snapshot',
    description: 'Monthly office market intelligence from the tenant\'s side.',
  },
})

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
          ORGANIZATION_SCHEMA,
          {
            "@type": "Article",
            "headline": "Newcastle Office Market Snapshot, May 2026",
            "description": "Historical May 2026 office market commentary. Newcastle office vacancy rates, rent trends, supply pipeline and market analysis.",
            "author": { "@type": "Person", "name": "Joe Kelley", "worksFor": { "@id": "https://www.yourofficespace.au/#organization" } },
            "publisher": { "@id": "https://www.yourofficespace.au/#organization" },
            "datePublished": "2026-05-01",
            "dateModified": "2026-05-24",
            "url": "https://www.yourofficespace.au/market-snapshot",
            "about": { "@type": "Place", "name": "Newcastle Commercial Office Market", "address": { "@type": "PostalAddress", "addressLocality": "Newcastle", "addressRegion": "NSW", "addressCountry": "AU" } }
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
