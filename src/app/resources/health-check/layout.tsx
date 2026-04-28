import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Property Health Check | Free Diagnostic | Your Office Space',
  description: '12 questions. 4 domains. A clear picture of where your business is exposed — and what it\'s costing you. Free commercial property diagnostic from Your Office Space.',
  alternates: { canonical: 'https://yourofficespace.au/resources/health-check' },
  openGraph: {
    title: 'Commercial Property Health Check | Free Diagnostic | Your Office Space',
    description: '12 questions. 4 domains. A clear picture of where your business is exposed — and what it\'s costing you. Free commercial property diagnostic from Your Office Space.',
    url: 'https://yourofficespace.au/resources/health-check',
    siteName: 'Your Office Space',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Property Health Check | Free Diagnostic | Your Office Space',
    description: '12 questions across lease, fitout, furniture, and cleaning. Instant RAG verdict per domain.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
