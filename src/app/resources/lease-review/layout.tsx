import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lease Risk Checker | Your Office Space',
  description: 'Get an instant lease risk rating in 2 minutes. 10 questions, plain-English result — Red, Amber or Green. No sign-up required.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
