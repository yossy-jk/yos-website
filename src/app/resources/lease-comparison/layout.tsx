import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lease Comparison Tool | Your Office Space',
  description: 'Compare up to three commercial lease options on true occupancy cost. Accounts for rent reviews, outgoings, incentives, and make-good.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
