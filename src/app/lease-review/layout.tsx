import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LeaseIntel™ — Free Lease Risk Review | Your Office Space',
  description: 'Upload your commercial lease and get a free risk summary within 24 hours. Every clause rated Red / Amber / Green across 12 risk categories.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
