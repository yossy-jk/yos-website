import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Furniture & Fitout Quote | Your Office Space',
  description: 'Get a furniture and fitout quote for your commercial space. Upload your floor plan and tell us about your project.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
