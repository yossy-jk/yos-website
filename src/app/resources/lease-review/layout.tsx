import { withPageSeo } from '@/lib/page-seo'
import type { Metadata } from 'next'

export const metadata: Metadata = withPageSeo({
  title: 'Commercial Lease Risk Checker | Your Office Space',
  description: 'Use ten questions to organise commercial lease topics for further advice. This free questionnaire does not analyse your lease or replace a solicitor.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/lease-review' },
  openGraph: {
    title: 'Commercial Lease Risk Checker | Your Office Space',
    description: 'Use ten questions to organise commercial lease topics for further advice. This free questionnaire does not analyse your lease or replace a solicitor.',
    url: 'https://www.yourofficespace.au/resources/lease-review',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Lease Risk Checker | Your Office Space', description: 'Use ten questions to organise commercial lease topics for further advice. This free questionnaire does not analyse your lease or replace a solicitor.' },
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
