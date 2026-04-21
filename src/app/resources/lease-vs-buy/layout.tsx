import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lease vs Buy Calculator — Commercial Property Cost Comparison | Your Office Space',
  description: 'Compare the true cost of leasing vs buying commercial property over your chosen term. Includes mortgage, capital growth, and equity modelling. Free tool.',
  alternates: { canonical: 'https://yourofficespace.au/resources/lease-vs-buy' },
  openGraph: {
    title: 'Lease vs Buy Calculator — Commercial Property Cost Comparison | Your Office Space',
    description: 'Compare the true cost of leasing vs buying commercial property over your chosen term. Includes mortgage, capital growth, and equity modelling. Free tool.',
    url: 'https://yourofficespace.au/resources/lease-vs-buy',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lease vs Buy Calculator | Your Office Space',
    description: 'Is it cheaper to lease or buy your commercial premises? Model it in seconds.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
