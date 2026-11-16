import { getPublicPosts } from '@/lib/blog'
import { SITE_URL, ORGANIZATION_SCHEMA } from '@/lib/site-schema'

export function getVideoResources() {
  return getPublicPosts().flatMap(post => {
    const video = post.video
    return video?.watchSlug ? [{ post, video, slug: video.watchSlug, href: `/videos/${video.watchSlug}` }] : []
  })
}

export function getVideoResource(slug: string) {
  return getVideoResources().find(resource => resource.slug === slug)
}

export function videoSchema(resource: ReturnType<typeof getVideoResources>[number]) {
  const { video, href } = resource
  return {
    '@context': 'https://schema.org', '@type': 'VideoObject', '@id': `${SITE_URL}${href}#video`,
    name: video.name, description: video.description, url: `${SITE_URL}${href}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${href}` },
    thumbnailUrl: `${SITE_URL}${video.poster}`, contentUrl: `${SITE_URL}${video.src}`,
    uploadDate: video.uploadDate, duration: video.duration, inLanguage: 'en-AU',
    transcript: video.transcript.join(' '), publisher: ORGANIZATION_SCHEMA,
  }
}
