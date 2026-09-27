import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Office Fitout Cost Estimator | Your Office Space',
  description: 'Create an indicative commercial office fit out planning range from project size and scope. Confirm current pricing before making a commitment.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/fitout-estimator' },
  openGraph: {
    title: 'Office Fitout Cost Estimator | Your Office Space',
    description: 'Create an indicative office fit out planning range and confirm current pricing before making a commitment.',
    url: 'https://www.yourofficespace.au/resources/fitout-estimator',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Your Office Space fit out estimator' }],
  },
  twitter: { card: 'summary_large_image', title: 'Office Fitout Cost Estimator | Your Office Space', description: 'Create an indicative planning range and confirm current pricing before making a commitment.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
