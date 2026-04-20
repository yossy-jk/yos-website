import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Property Stamp Duty Calculator | Your Office Space',
  description: 'Calculate stamp duty on commercial property purchases across all Australian states and territories. 2025-26 verified rates.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
