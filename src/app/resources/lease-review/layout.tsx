import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Lease Risk Checker | Your Office Space',
  description: 'Identify hidden risks in your commercial lease before you sign. Free clause-by-clause risk assessment tool for Australian tenants.',
  alternates: { canonical: 'https://yourofficespace.au/resources/lease-review' },
  openGraph: {
    title: 'Commercial Lease Risk Checker | Your Office Space',
    description: 'Identify hidden risks in your commercial lease before you sign. Free clause-by-clause risk assessment tool for Australian tenants.',
    url: 'https://yourofficespace.au/resources/lease-review',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Commercial Lease Risk Checker | Your Office Space', description: 'Identify hidden risks in your commercial lease before you sign. Free clause-by-clause risk assessment tool for Australian tenants.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
