import Image from 'next/image'
import Link from 'next/link'
import { getVideoResources } from '@/lib/video-resources'

export default function VideoResources() {
  return <section aria-labelledby="video-resources-heading" style={{ padding: 'clamp(3rem,7vw,6rem) clamp(1.5rem,8vw,6rem)', background: '#f5f7f6' }}>
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <h2 id="video-resources-heading" className="text-near-black font-bold" style={{ fontSize: 'clamp(1.75rem,3vw,2.75rem)', marginBottom: '1rem' }}>Watch a workplace planning guide</h2>
      <p className="text-charcoal" style={{ maxWidth: '46rem', lineHeight: 1.8, marginBottom: '2rem' }}>Short explainers with English captions, readable transcripts and a practical guide or worksheet for your next decision.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: '1.5rem' }}>
        {getVideoResources().map(({ video, href }) => <Link key={href} href={href} className="text-charcoal no-underline bg-white" style={{ display: 'block', border: '1px solid #d6dddd', borderRadius: '0.75rem', overflow: 'hidden' }}>
          <Image src={video.poster} alt={`Video thumbnail: ${video.name}`} width={video.width} height={video.height} sizes="(max-width: 768px) 100vw, 33vw" style={{ width: '100%', height: '240px', objectFit: 'contain', background: '#edf1ef' }} />
          <div style={{ padding: '1.5rem' }}><h3 className="text-near-black font-bold text-xl" style={{ marginBottom: '0.75rem' }}>{video.name}</h3><p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>{video.description}</p><span className="text-action-teal font-semibold underline">Watch video and read transcript →</span></div>
        </Link>)}
      </div>
    </div>
  </section>
}
