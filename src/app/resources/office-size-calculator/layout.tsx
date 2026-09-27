import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Office Size Calculator | Your Office Space',
  description: 'Estimate a starting office size range from team size, work style, private offices and meeting-room needs. Use the result as a planning guide.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/office-size-calculator' },
  openGraph: { title: 'Office Size Calculator | Your Office Space', description: 'Estimate a practical starting office size range for your team.', url: 'https://www.yourofficespace.au/resources/office-size-calculator', images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Your Office Space office size calculator' }] },
  twitter: { card: 'summary_large_image', title: 'Office Size Calculator | Your Office Space', description: 'Estimate a practical starting office size range for your team.' },
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children }
