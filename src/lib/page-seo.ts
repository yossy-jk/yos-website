import type { Metadata } from 'next'
import { SITE_URL } from './site-schema'

// Each page owns its canonical, title and preview. Do not inherit a homepage
// preview when a page-level Open Graph object replaces the root metadata.
export function withPageSeo(metadata: Metadata): Metadata {
  const title = typeof metadata.title === 'string' ? metadata.title : undefined
  const description = metadata.description || undefined
  const canonical = metadata.alternates?.canonical
  const image = { url: '/og/og-default.png', width: 1200, height: 630, alt: 'Your Office Space' }
  const images = metadata.openGraph?.images || [image]
  return {
    ...metadata,
    openGraph: {
      type: 'website', siteName: 'Your Office Space', locale: 'en_AU',
      title, description,
      ...(typeof canonical === 'string' ? { url: canonical } : {}),
      ...metadata.openGraph, images,
    },
    twitter: {
      card: 'summary_large_image', title, description, images,
      ...metadata.twitter,
    },
  }
}

export function absoluteAssetUrl(asset: string): string {
  return new URL(asset, `${SITE_URL}/`).href
}
