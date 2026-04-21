import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Commercial Leases Side by Side | Your Office Space',
  description: 'Compare two commercial lease options on true cost, incentives, and net effective rent. Free lease comparison calculator for Australian businesses.',
  alternates: { canonical: 'https://yourofficespace.au/resources/lease-comparison' },
  openGraph: {
    title: 'Compare Commercial Leases Side by Side | Your Office Space',
    description: 'Compare two commercial lease options on true cost, incentives, and net effective rent. Free lease comparison calculator for Australian businesses.',
    url: 'https://yourofficespace.au/resources/lease-comparison',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Compare Commercial Leases Side by Side | Your Office Space', description: 'Compare two commercial lease options on true cost, incentives, and net effective rent. Free lease comparison calculator for Australian businesses.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
