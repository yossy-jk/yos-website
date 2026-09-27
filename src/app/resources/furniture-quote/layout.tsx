import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Furniture & Fitout Quote | Your Office Space',
  description: 'Get a furniture and fitout quote for your Newcastle commercial space. Tell us about your project and we will provide a tailored estimate.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/furniture-quote' },
  openGraph: {
    title: 'Furniture & Fitout Quote | Your Office Space',
    description: 'Get a furniture and fitout quote for your Newcastle commercial space. Tell us about your project and we will provide a tailored estimate.',
    url: 'https://www.yourofficespace.au/resources/furniture-quote',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Your Office Space furniture brief' }],
  },
  twitter: { card: 'summary_large_image', title: 'Furniture & Fitout Quote | Your Office Space', description: 'Get a furniture and fitout quote for your Newcastle commercial space.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = { '@context': 'https://schema.org', '@type': 'Service', name: 'Office and commercial furniture', provider: { '@id': 'https://www.yourofficespace.au/#business' }, url: 'https://www.yourofficespace.au/resources/furniture-quote' }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />{children}</>
}
