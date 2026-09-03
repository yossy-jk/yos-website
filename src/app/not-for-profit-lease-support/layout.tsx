import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Free Lease Support for Not-for-Profits | Your Office Space',
  description: 'Pro bono lease reviews and relocation search for not-for-profits in Newcastle and the Hunter. No fees, no obligation. Limited spots available.',
  alternates: { canonical: 'https://www.yourofficespace.au/not-for-profit-lease-support' },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Lease Support for Newcastle Not-for-Profits',
    description: 'Pro bono lease reviews and relocation support for registered charities and not-for-profits in the Hunter.',
  },
  openGraph: {
    title: 'Free Lease Support for Newcastle Not-for-Profits',
    description: 'Pro bono lease reviews and relocation search for not-for-profits in Newcastle and the Hunter. No fees. Limited spots.',
    url: 'https://yourofficespace.au/not-for-profit-lease-support',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function NotForProfitLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}
