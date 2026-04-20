import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rental Yield Calculator | Your Office Space',
  description: 'Calculate gross and net rental yield on commercial property. Factor in outgoings, vacancy, and management fees to get a true picture of returns.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
