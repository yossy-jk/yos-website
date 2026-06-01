import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space',
  description: 'Submit your commercial lease for a full LeaseIntel report. Every clause rated Red, Amber, or Green — rent, make-good, relocation, options. Free for Newcastle businesses. 24-hour turnaround.',
  alternates: { canonical: 'https://www.yourofficespace.au/lease-review' },
  twitter: { card: 'summary_large_image', title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space', description: 'Full commercial lease review. Every clause rated Red, Amber, Green. Free for Newcastle businesses. 24-hour turnaround.' },
  openGraph: {
    title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space',
    description: 'Full commercial lease review. Every clause rated, every risk quantified. Free for Newcastle businesses. 24-hour turnaround.',
    url: 'https://yourofficespace.au/lease-review',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function LeaseReviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
