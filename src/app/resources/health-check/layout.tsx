import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workplace Health Check | Your Office Space',
  description: 'Review the lease, space, fit out, furniture and workplace care signals that may deserve attention. Use the result as a practical starting point.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/health-check' },
  openGraph: { title: 'Workplace Health Check | Your Office Space', description: 'Review the workplace signals that may deserve attention.', url: 'https://www.yourofficespace.au/resources/health-check', images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Your Office Space workplace health check' }] },
  twitter: { card: 'summary_large_image', title: 'Workplace Health Check | Your Office Space', description: 'Review the workplace signals that may deserve attention.' },
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Workplace Health Check', applicationCategory: 'BusinessApplication', url: 'https://www.yourofficespace.au/resources/health-check' }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />{children}</>
}
