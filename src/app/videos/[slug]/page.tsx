import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getVideoResources, getVideoResource, videoSchema } from '@/lib/video-resources'
import { withPageSeo } from '@/lib/page-seo'
import { SITE_URL } from '@/lib/site-schema'
import styles from './watch.module.css'

export function generateStaticParams() { return getVideoResources().map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resource = getVideoResource((await params).slug)
  if (!resource) return {}
  return withPageSeo({ title: `${resource.video.name} | YOS Video`, description: resource.video.description, alternates: { canonical: `${SITE_URL}${resource.href}` }, openGraph: { title: resource.video.name, description: resource.video.description, url: `${SITE_URL}${resource.href}`, type: 'website', images: [{ url: resource.video.poster, width: 720, height: 1280, alt: resource.video.name }] } })
}
export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const resource = getVideoResource((await params).slug)
  if (!resource) notFound()
  const { video, post } = resource
  const fitout = post.slug === 'office-fitout-guide-australia-2026'
  const worksheet = fitout ? 'office-fitout-decision-register.csv' : post.slug.startsWith('commercial-lease-renewal') ? 'commercial-lease-renewal-decision.csv' : 'office-make-good-scope-worksheet.csv'
  return <><Nav /><main id="main-content" tabIndex={-1} className={styles.main}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema(resource)).replace(/</g, '\\u003c') }} />
    <div className={styles.wrap}>
      <Link href="/videos" className="text-action-teal underline">All video guides</Link>
      <h1 className="text-near-black font-bold">{video.name}</h1>
      <div className={styles.grid}>
        <section aria-label="Watch the video" className={styles.player}>
          <video controls playsInline preload="none" width={video.width} height={video.height} poster={video.poster} aria-label={video.name} aria-describedby="watch-description">
            <source src={video.src} type="video/mp4" />
            <track src={video.captions} kind="captions" srcLang="en" label="English" default />
            Your browser does not support video. <a href={video.src}>Open the video</a>.
          </video>
          <a href={video.src} className="text-action-teal underline">Open video in its own player</a>
        </section>
        <aside aria-label="Use this guide" className={styles.support}>
          <p id="watch-description">{video.description}</p>
          <h2 className="text-near-black font-bold">Put the explanation into practice</h2>
          <p>{fitout ? 'Use the responsibility matrix to separate client approvals, coordination and specialist delivery. Record the evidence behind the next scope or budget decision.' : post.slug.startsWith('commercial-lease-renewal') ? 'Build a verified dates register and compare renewal with realistic alternatives. Ask your solicitor to confirm the actual notice requirements before relying on a date.' : 'Clarify the lease position with your solicitor, then organise the physical scope, comparable proposals and handback records with the appointed team.'}</p>
          <Link href={`/blog/${post.slug}`} className={styles.primary} style={{ display: 'block' }}>Read the full planning guide</Link>
          <a href={`/downloads/${worksheet}`} download className="text-action-teal underline" style={{ display: 'block' }}>Download the free worksheet (CSV)</a>
          <p className={styles.note}>No email required. Fill in your own information. The guide and worksheet are planning aids; legal advice and the actual project scope need the appropriate appointed advisers.</p>
          <Link href={fitout ? '/office-fitout#fitout-enquiry' : '/lease-health-check'} className="text-action-teal underline" style={{ display: 'block' }}>{fitout ? 'Discuss your fitout project with YOS' : 'Start a Lease Health Check'}</Link>
        </aside>
      </div>
      <section aria-labelledby="transcript-heading" className={styles.transcript}><h2 id="transcript-heading" className="text-near-black font-bold">Video transcript</h2>{video.transcript.map((text, i) => <p key={i}>{text}</p>)}</section>
    </div>
  </main><Footer /></>
}
