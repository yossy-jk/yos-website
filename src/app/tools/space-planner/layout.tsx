import { withPageSeo } from '@/lib/page-seo'
import type { Metadata } from 'next'

export const metadata: Metadata = withPageSeo({
  title: 'Office Space Planner | Your Office Space',
  description: 'The YOS online Space Planner is not available yet. Share your furniture brief with the team to request a scoped quote.',
  alternates: { canonical: 'https://www.yourofficespace.au/tools/space-planner' },
  openGraph: {
    title: 'Office Space Planner | Your Office Space',
    description: 'The YOS online Space Planner is not available yet. Share your furniture brief with the team to request a scoped quote.',
    url: 'https://www.yourofficespace.au/tools/space-planner',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Office Space Planner | Your Office Space', description: 'The YOS online Space Planner is not available yet. Share your furniture brief with the team to request a scoped quote.' },
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
