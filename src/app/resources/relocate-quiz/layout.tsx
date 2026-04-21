import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Should I Relocate My Office? | Free Assessment | Your Office Space',
  description: 'Answer 6 quick questions and get an instant Red, Amber, or Green verdict on whether your business should relocate offices. Free tool from Your Office Space.',
  alternates: { canonical: 'https://yourofficespace.au/resources/relocate-quiz' },
  openGraph: {
    title: 'Should I Relocate My Office? | Free Assessment | Your Office Space',
    description: 'Answer 6 quick questions and get an instant Red, Amber, or Green verdict on whether your business should relocate offices. Free tool from Your Office Space.',
    url: 'https://yourofficespace.au/resources/relocate-quiz',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Should I Relocate My Office? | Free Assessment | Your Office Space',
    description: 'Answer 6 quick questions and get a Red/Amber/Green verdict on whether you should move offices.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
