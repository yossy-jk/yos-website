import type { BlogPost } from '@/lib/blog'

export default function BlogVideo({ video }: { video: NonNullable<BlogPost['video']> }) {
  return <section aria-labelledby="article-video-heading" className="border-b border-gray-200" style={{ marginBottom: '3rem', paddingBottom: '2.5rem' }}>
    <p className="text-action-teal text-xs font-bold uppercase tracking-widest" style={{ marginBottom: '0.75rem' }}>Video guide</p>
    <h2 id="article-video-heading" className="text-near-black text-2xl font-bold leading-tight" style={{ marginBottom: '1rem' }}>{video.name}</h2>
    {video.aiAssisted && <p className="text-charcoal text-sm" style={{ marginBottom: '1rem' }}>AI-assisted video presentation. The transcript is available below.</p>}
    <p id="article-video-description" className="text-charcoal leading-relaxed" style={{ marginBottom: '1.5rem' }}>{video.description}</p>
    <video
      controls
      playsInline
      preload="none"
      width={video.width}
      height={video.height}
      poster={video.poster}
      aria-label={video.name}
      aria-describedby="article-video-description"
      style={{ width: '100%', maxWidth: video.width > video.height ? '100%' : '22.5rem', height: 'auto', aspectRatio: `${video.width} / ${video.height}`, display: 'block', margin: '0 auto', background: '#191919', borderRadius: '0.75rem' }}
    >
      <source src={video.src} type="video/mp4" />
      <track src={video.captions} kind="captions" srcLang="en" label="English" default={video.captionsDefault !== false} />
      Your browser does not support video. <a href={video.src}>Open the video</a>.
    </video>
    <p className="text-sm" style={{ marginTop: '1rem' }}><a href={video.src} className="text-action-teal font-semibold underline underline-offset-4">Open video in its own player</a></p>
    {video.watchSlug && <p style={{ marginTop: '1rem' }}><a href={`/videos/${video.watchSlug}`} className="text-action-teal font-semibold underline underline-offset-4">Watch on the dedicated video page</a></p>}
    {video.youtubeId && <p style={{ marginTop: '1rem' }}><a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} className="text-action-teal font-semibold underline underline-offset-4">Watch on YouTube</a></p>}
    <details className="border border-black/10 rounded-xl" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
      <summary className="text-near-black font-semibold cursor-pointer" style={{ minHeight: '1.5rem' }}>Read the video transcript</summary>
      <div className="text-charcoal leading-relaxed" style={{ marginTop: '1.25rem' }}>{video.transcript.map((paragraph, index) => <p key={index} style={{ marginBottom: index === video.transcript.length - 1 ? 0 : '1rem' }}>{paragraph}</p>)}</div>
    </details>
  </section>
}
