import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Land Tax Calculator | Your Office Space',
  description: 'Calculate annual land tax liability on commercial and investment property across all Australian states. 2025-26 verified thresholds and rates.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
