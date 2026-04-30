import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Furniture & Fitout Quote | Your Office Space',
  description: 'Get a furniture and fitout quote for your Newcastle commercial space. Tell us about your project and we will provide a tailored estimate.',
  alternates: { canonical: 'https://yourofficespace.au/resources/furniture-quote' },
  openGraph: {
    title: 'Furniture & Fitout Quote | Your Office Space',
    description: 'Get a furniture and fitout quote for your Newcastle commercial space. Tell us about your project and we will provide a tailored estimate.',
    url: 'https://yourofficespace.au/resources/furniture-quote',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Furniture & Fitout Quote | Your Office Space', description: 'Get a furniture and fitout quote for your Newcastle commercial space.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
