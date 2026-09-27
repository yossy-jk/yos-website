import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Should Your Office Relocate? | Your Office Space',
  description: 'Work through the practical signals behind staying, renewing or relocating. Use the result as a starting point, not a substitute for advice.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/relocate-quiz' },
  openGraph: { title: 'Should Your Office Relocate? | Your Office Space', description: 'A practical starting point for comparing staying, renewing and relocating.', url: 'https://www.yourofficespace.au/resources/relocate-quiz', images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Your Office Space relocation guide' }] },
  twitter: { card: 'summary_large_image', title: 'Should Your Office Relocate?', description: 'Compare the practical signals behind staying, renewing and relocating.' },
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Should Your Office Relocate?', applicationCategory: 'BusinessApplication', url: 'https://www.yourofficespace.au/resources/relocate-quiz' }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />{children}</>
}
