import { withPageSeo } from '@/lib/page-seo'
export const metadata = withPageSeo({
  title: 'Workspace Builder | Office Furniture Planning | Your Office Space',
  description: 'Plan an office furniture brief, explore workspace layouts and request help selecting, supplying and installing commercial furniture.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/workspace-builder' },
  openGraph: { images: [{ url: '/og/og-furniture.png', width: 1200, height: 630, alt: 'Office furniture planning with Your Office Space' }] },
})
export default function Layout({ children }: { children: React.ReactNode }) { return children }
