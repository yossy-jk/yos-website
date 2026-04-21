import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Land Tax Calculator Australia 2025-26 | Your Office Space',
  description: 'Estimate your land tax liability across NSW, VIC, QLD, WA and SA for 2025-26. Includes individual, company and trust rates.',
  alternates: { canonical: 'https://yourofficespace.au/resources/land-tax-calculator' },
  openGraph: {
    title: 'Land Tax Calculator Australia 2025-26 | Your Office Space',
    description: 'Estimate your land tax liability across NSW, VIC, QLD, WA and SA for 2025-26. Includes individual, company and trust rates.',
    url: 'https://yourofficespace.au/resources/land-tax-calculator',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Land Tax Calculator Australia 2025-26 | Your Office Space', description: 'Estimate your land tax liability across NSW, VIC, QLD, WA and SA for 2025-26. Includes individual, company and trust rates.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
