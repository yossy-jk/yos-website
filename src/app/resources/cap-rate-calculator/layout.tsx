import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cap Rate Calculator for Commercial Property | Your Office Space',
  description: 'Calculate capitalisation rate (cap rate) for commercial property valuation. Free tool for Australian commercial property investors.',
  alternates: { canonical: 'https://yourofficespace.au/resources/cap-rate-calculator' },
  openGraph: {
    title: 'Cap Rate Calculator for Commercial Property | Your Office Space',
    description: 'Calculate capitalisation rate (cap rate) for commercial property valuation. Free tool for Australian commercial property investors.',
    url: 'https://yourofficespace.au/resources/cap-rate-calculator',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Cap Rate Calculator for Commercial Property | Your Office Space', description: 'Calculate capitalisation rate (cap rate) for commercial property valuation. Free tool for Australian commercial property investors.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
