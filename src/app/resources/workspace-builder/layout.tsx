import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workspace Furniture Planner | Your Office Space',
  description: 'Build a practical first-pass furniture brief around team size, work style, spaces and priorities. Pricing is indicative and requires confirmation.',
  alternates: { canonical: 'https://www.yourofficespace.au/resources/workspace-builder' },
  openGraph: { title: 'Workspace Furniture Planner | Your Office Space', description: 'Build a practical first-pass workplace furniture brief.', url: 'https://www.yourofficespace.au/resources/workspace-builder', images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Your Office Space furniture planner' }] },
  twitter: { card: 'summary_large_image', title: 'Workspace Furniture Planner', description: 'Build a practical first-pass workplace furniture brief.' },
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children }
