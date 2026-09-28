import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space',
  description: 'Request a scoped commercial lease risk review covering rent, make-good, relocation, options and other material obligations. Scope, timing and fees are confirmed before work begins.',
  alternates: { canonical: 'https://www.yourofficespace.au/lease-review' },
  twitter: { card: 'summary_large_image', title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space', description: 'Request a scoped commercial lease risk review. Scope, timing and fees are confirmed before work begins.' },
  openGraph: {
    title: 'LeaseIntel™ — Commercial Lease Risk Review | Your Office Space',
    description: 'Request a scoped commercial lease risk review. Scope, timing and fees are confirmed before work begins.',
    url: 'https://www.yourofficespace.au/lease-review',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function LeaseReviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
