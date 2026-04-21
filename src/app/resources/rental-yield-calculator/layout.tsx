import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Rental Yield Calculator | Your Office Space',
  description: 'Calculate gross and net rental yield on commercial property investments. Free calculator for Australian investors.',
  alternates: { canonical: 'https://yourofficespace.au/resources/rental-yield-calculator' },
  openGraph: {
    title: 'Commercial Rental Yield Calculator | Your Office Space',
    description: 'Calculate gross and net rental yield on commercial property investments. Free calculator for Australian investors.',
    url: 'https://yourofficespace.au/resources/rental-yield-calculator',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Rental Yield Calculator | Your Office Space', description: 'Calculate gross and net rental yield on commercial property investments. Free calculator for Australian investors.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
