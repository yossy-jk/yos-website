import { withPageSeo } from '@/lib/page-seo'
import type { Metadata } from 'next'

export const metadata: Metadata = withPageSeo({
  title: 'Office Fitout Cost Estimator | Your Office Space',
  description: 'Explore an indicative office fitout budget using planning assumptions. Confirm your project scope and quotes. Free results, with no email required.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/fitout-estimator' },
  openGraph: {
    title: 'Office Fitout Cost Estimator | Your Office Space',
    description: 'Explore an indicative office fitout budget using planning assumptions. Confirm your project scope and quotes. Free results, with no email required.',
    url: 'https://www.yourofficespace.au/resources/fitout-estimator',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Office Fitout Cost Estimator | Your Office Space', description: 'Explore an indicative office fitout budget using planning assumptions. Confirm your project scope and quotes. Free results, with no email required.' },
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
