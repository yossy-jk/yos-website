import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Stamp Duty Calculator NSW & Australia | Your Office Space',
  description: 'Calculate stamp duty on commercial property purchases across NSW, VIC, QLD, WA and SA. 2025-26 rates. Free online calculator.',
  alternates: { canonical: 'https://yourofficespace.au/resources/stamp-duty-calculator' },
  openGraph: {
    title: 'Commercial Stamp Duty Calculator NSW & Australia | Your Office Space',
    description: 'Calculate stamp duty on commercial property purchases across NSW, VIC, QLD, WA and SA. 2025-26 rates. Free online calculator.',
    url: 'https://yourofficespace.au/resources/stamp-duty-calculator',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Stamp Duty Calculator NSW & Australia | Your Office Space', description: 'Calculate stamp duty on commercial property purchases across NSW, VIC, QLD, WA and SA. 2025-26 rates. Free online calculator.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
