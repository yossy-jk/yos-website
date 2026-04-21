import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Office Size Calculator — How Much Space Does Your Team Need? | Your Office Space',
  description: 'Calculate how much office space your team needs based on staff count, work style and room requirements. Free tool for Newcastle and Australian businesses.',
  alternates: { canonical: 'https://yourofficespace.au/resources/office-size-calculator' },
  openGraph: {
    title: 'Office Size Calculator — How Much Space Does Your Team Need? | Your Office Space',
    description: 'Calculate how much office space your team needs based on staff count, work style and room requirements. Free tool for Newcastle and Australian businesses.',
    url: 'https://yourofficespace.au/resources/office-size-calculator',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Office Size Calculator | Your Office Space',
    description: 'How much office space does your team actually need? Find out in seconds.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
