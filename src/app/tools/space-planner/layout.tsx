import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Office Space Planner | Your Office Space',
  description: 'Plan your office layout online. Drag-and-drop desks, meeting rooms, breakout zones and more. Free space planning tool for Newcastle and Australian businesses.',
  alternates: { canonical: 'https://yourofficespace.au/tools/space-planner' },
  openGraph: {
    title: 'Office Space Planner | Your Office Space',
    description: 'Plan your office layout online. Free drag-and-drop space planning tool for Australian businesses.',
    url: 'https://yourofficespace.au/tools/space-planner',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Office Space Planner | Your Office Space', description: 'Plan your office layout online. Free space planning tool for Australian businesses.' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
