import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cap Rate Calculator | Your Office Space',
  description: 'Calculate the capitalisation rate on commercial property instantly. Compare your deal against Hunter Valley and Newcastle market benchmarks.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
