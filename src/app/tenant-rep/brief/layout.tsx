import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Private Client Brief | Your Office Space',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false, noarchive: true } },
}
export default function Layout({ children }: { children: React.ReactNode }) { return children }
