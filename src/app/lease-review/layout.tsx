import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space',
  description: 'Upload your commercial lease for a free risk summary. Every clause rated Red, Amber, or Green — rent, make-good, relocation, options. Free summary or full report for $97.',
  alternates: { canonical: 'https://yourofficespace.au/lease-review' },
  twitter: { card: 'summary_large_image', title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space', description: 'Free commercial lease risk review. Every clause rated Red, Amber, Green. Free summary or full report for $97.' },
  openGraph: {
    title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space',
    description: 'Free commercial lease risk review. Every clause rated, every risk quantified. Free summary or full 12-category report for $97.',
    url: 'https://yourofficespace.au/lease-review',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function LeaseReviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
