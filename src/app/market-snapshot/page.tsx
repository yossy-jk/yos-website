import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import path from 'path'
import MarketSnapshotPageContent from './MarketSnapshotPageContent'

export const metadata: Metadata = {
  title: 'Newcastle Office Market Snapshot | Your Office Space',
  description: 'Monthly market intelligence from the tenant\'s side. Vacancy rates, rent trends, supply pipeline, and which way leverage is moving in the Newcastle office market.',
  alternates: { canonical: 'https://yourofficespace.au/market-snapshot' },
  openGraph: {
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
    <MarketSnapshotPageContent
      snapshotContent={snapshotContent}
      leaseIntelHref="/leaseintel"
    />
  )
}
