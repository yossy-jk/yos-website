import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space',
  description: 'Submit your commercial lease for a full LeaseIntel report. Every clause rated Red, Amber, or Green — rent, make-good, relocation, options. $297 ex GST, 24-hour turnaround. Newcastle businesses: free until 21 July 2026.',
  alternates: { canonical: 'https://yourofficespace.au/lease-review' },
  twitter: { card: 'summary_large_image', title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space', description: 'Full commercial lease review. Every clause rated Red, Amber, Green. $297 ex GST, 24-hour turnaround. Newcastle businesses: free until 21 July 2026.' },
  openGraph: {
    title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space',
    description: 'Full commercial lease review. Every clause rated, every risk quantified. $297 ex GST, 24-hour turnaround. Newcastle businesses: free until 21 July 2026.',
    url: 'https://yourofficespace.au/lease-review',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function LeaseReviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
