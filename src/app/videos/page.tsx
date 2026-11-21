import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import VideoResources from '@/components/VideoResources'
import { getVideoResources } from '@/lib/video-resources'
import { withPageSeo } from '@/lib/page-seo'
import { SITE_URL } from '@/lib/site-schema'

export const metadata = withPageSeo({ title: 'Workplace Planning Video Guides | Your Office Space', description: 'Watch short YOS video guides on commercial cleaning, office fitout decisions, commercial lease renewal and make-good planning. Includes captions, transcripts and practical resources.', alternates: { canonical: `${SITE_URL}/videos` } })

export default function VideosPage() {
  const videos = getVideoResources()
  return <><Nav /><main id="main-content" tabIndex={-1}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Workplace planning video guides', url: `${SITE_URL}/videos`, mainEntity: { '@type': 'ItemList', numberOfItems: videos.length, itemListElement: videos.map((v, i) => ({ '@type': 'ListItem', position: i + 1, name: v.video.name, url: `${SITE_URL}${v.href}` })) } }).replace(/</g, '\\u003c') }} />
    <header className="bg-near-black text-white" style={{ padding: 'clamp(9rem,15vw,13rem) clamp(1.5rem,8vw,6rem) 3rem' }}><h1 className="font-bold" style={{ fontSize: 'clamp(2rem,5vw,3.75rem)', maxWidth: '50rem', lineHeight: 1.15 }}>Clearer decisions for your next workplace move.</h1><p style={{ maxWidth: '44rem', marginTop: '1.5rem', lineHeight: 1.8 }}>Watch a short explanation, then use the companion guide to organise the details for your own business.</p></header>
    <VideoResources />
  </main><Footer /></>
}
