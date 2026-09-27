import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Lease Review | Your Office Space',
  description: 'Tell us about the commercial lease decision you need to make. We confirm fit, scope, timing, fees and document handling before work begins.',
  alternates: { canonical: 'https://www.yourofficespace.au/lease-review' },
  openGraph: {
    title: 'Commercial Lease Review | Your Office Space',
    description: 'Understand the obligations, risks and decisions in a proposed commercial lease.',
    url: 'https://www.yourofficespace.au/lease-review',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
    images: [{ url: '/og/og-leaseintel.png', width: 1200, height: 630, alt: 'Commercial lease review by Your Office Space' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Lease Review | Your Office Space',
    description: 'Understand the obligations, risks and decisions in a proposed commercial lease.',
    images: ['/og/og-leaseintel.png'],
  },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Commercial Lease Review',
  provider: { '@id': 'https://www.yourofficespace.au/#business' },
  url: 'https://www.yourofficespace.au/lease-review',
  areaServed: { '@type': 'Country', name: 'Australia' },
  description: 'Commercial lease risk review with scope, timing and fees confirmed before the engagement begins.',
}

export default function LeaseReviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  )
}
