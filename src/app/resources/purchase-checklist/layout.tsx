import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Property Due Diligence Checklist | Your Office Space',
  description: 'A comprehensive due diligence checklist for commercial property buyers in NSW. 30 checks across title, zoning, building, tenancy, and environmental.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
