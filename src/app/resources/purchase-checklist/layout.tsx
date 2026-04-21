import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Property Purchase Checklist | Your Office Space',
  description: 'Interactive due diligence checklist for buying commercial property in Australia. 40+ items covering legal, financial, physical and compliance checks.',
  alternates: { canonical: 'https://yourofficespace.au/resources/purchase-checklist' },
  openGraph: {
    title: 'Commercial Property Purchase Checklist | Your Office Space',
    description: 'Interactive due diligence checklist for buying commercial property in Australia. 40+ items covering legal, financial, physical and compliance checks.',
    url: 'https://yourofficespace.au/resources/purchase-checklist',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Property Purchase Checklist | Your Office Space', description: 'Interactive due diligence checklist for buying commercial property in Australia. 40+ items covering legal, financial, physical and compliance checks.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
