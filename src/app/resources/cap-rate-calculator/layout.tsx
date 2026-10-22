import { withPageSeo } from '@/lib/page-seo'
import type { Metadata } from 'next'

export const metadata: Metadata = withPageSeo({
  robots: { index: true, follow: true },
  title: 'Cap Rate Calculator for Commercial Property | Your Office Space',
  description: 'Calculate cap rate, indicative capitalised value or annual NOI from your own assumptions. Free Australian commercial property tool with an NOI helper and clear limits.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/cap-rate-calculator' },
  openGraph: {
    title: 'Cap Rate Calculator for Commercial Property | Your Office Space',
    description: 'Calculate cap rate, indicative capitalised value or annual NOI from your own assumptions. Free Australian commercial property tool with an NOI helper and clear limits.',
    url: 'https://www.yourofficespace.au/resources/cap-rate-calculator',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Cap Rate Calculator for Commercial Property | Your Office Space', description: 'Calculate cap rate, indicative capitalised value or annual NOI from your own assumptions. Free Australian commercial property tool with an NOI helper and clear limits.' },
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
