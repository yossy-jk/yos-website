import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Office Fitout Cost Estimator | Your Office Space',
  description: 'Estimate your commercial office fitout cost in seconds. Based on current 2025-26 NSW market rates. Free, no email required to see results.',
  alternates: { canonical: 'https://yourofficespace.au/resources/fitout-estimator' },
  openGraph: {
    title: 'Office Fitout Cost Estimator | Your Office Space',
    description: 'Estimate your commercial office fitout cost in seconds. Based on current 2025-26 NSW market rates. Free, no email required to see results.',
    url: 'https://yourofficespace.au/resources/fitout-estimator',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Office Fitout Cost Estimator | Your Office Space', description: 'Estimate your commercial office fitout cost in seconds. Based on current 2025-26 NSW market rates. Free, no email required to see results.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
