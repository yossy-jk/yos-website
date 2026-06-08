'use client'
import { useEffect, useState } from 'react'

const C = { teal: '#00B5A5', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)' }

function Label({ c, children }: { c?: string; children: React.ReactNode }) {
  return <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: c || 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>{children}</p>
}

export default function MarketingTab() {
  const [seo, setSeo] = useState<Record<string, unknown> | null>(null)
  const [queue, setQueue] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/seo/rankings').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/queue/list').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([s, q]) => {
      setSeo(s)
      const items = (q?.items || []).filter((i: Record<string, unknown>) => i.type === 'blog-post')
      setQueue(items)
      setLoading(false)
    })
  }, [])

  const approveBlog = async (id: string) => {
    setApproving(id)
    await fetch('/api/queue/action', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id, action: 'approve' }) }).catch(() => {})
    setQueue(q => q.filter(i => i.id !== id))
    setApproving(null)
  }

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading marketing data...</div>

  const rankings: Record<string, unknown>[] = (seo?.rankings as Record<string, unknown>[]) || []
  const topQueries: Record<string, unknown>[] = (seo?.topQueries as Record<string, unknown>[]) || []
  const ranked = rankings.filter(r => r.position !== null)
  const notRanking = rankings.filter(r => r.position === null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* GSC Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Keywords Tracked', val: String(rankings.length), color: 'white' },
          { label: 'Currently Ranking', val: String(ranked.length), color: ranked.length > 0 ? C.green : C.amber },
          { label: 'Top Queries', val: String(topQueries.length), color: C.teal },
          { label: 'Blog Posts in Queue', val: String(queue.length), color: queue.length > 0 ? C.amber : 'rgba(255,255,255,0.3)' },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0.3rem 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* GSC connection status */}
      {!seo?.connected && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 8, padding: '1.25rem' }}>
          <p style={{ color: C.red, fontWeight: 700, fontSize: '0.8rem', margin: '0 0 0.25rem' }}>⚠️ Google Search Console not connected</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: 0 }}>Visit /api/auth/gsc while logged in to reconnect with joekelley1992@gmail.com</p>
        </div>
      )}

      {/* Blog queue — approve in one tap */}
      {queue.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <Label c={C.amber}>📝 Blog Posts Ready for Review ({queue.length})</Label>
          {queue.map((item: Record<string, unknown>) => (
            <div key={item.id as string} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(245,158,11,0.04)', borderRadius: 6, marginBottom: '0.5rem', border: '1px solid rgba(245,158,11,0.15)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.82rem' }}>{item.title as string}</p>
                {(item.metadata as Record<string, unknown>)?.targetKeyword && (
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.62rem', color: C.teal }}>🎯 {(item.metadata as Record<string, unknown>).targetKeyword as string}</p>
                )}
              </div>
              <button
                onClick={() => approveBlog(item.id as string)}
                disabled={approving === item.id as string}
                style={{ background: C.green, border: 'none', borderRadius: 4, padding: '0.4rem 1rem', color: 'white', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0, opacity: approving === item.id as string ? 0.5 : 1 }}>
                {approving === item.id as string ? '...' : '✓ Approve & Publish'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Top GSC queries */}
      {topQueries.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <Label>🔍 Top Google Queries (last 30 days)</Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Keyword</div>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Position</div>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Clicks</div>
            <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Impressions</div>
            {topQueries.slice(0, 20).map((q: Record<string, unknown>, i: number) => {
              const pos = q.position as number
              const posColour = pos <= 3 ? C.green : pos <= 10 ? C.teal : pos <= 20 ? C.amber : 'rgba(255,255,255,0.4)'
              return [
                <div key={`k${i}`} style={{ fontSize: '0.75rem', padding: '0.4rem 0', borderBottom: `1px solid ${C.border}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.keyword as string}</div>,
                <div key={`p${i}`} style={{ fontSize: '0.75rem', padding: '0.4rem 0', borderBottom: `1px solid ${C.border}`, textAlign: 'center', color: posColour, fontWeight: 700 }}>{pos?.toFixed(1)}</div>,
                <div key={`c${i}`} style={{ fontSize: '0.75rem', padding: '0.4rem 0', borderBottom: `1px solid ${C.border}`, textAlign: 'center', color: (q.clicks as number) > 0 ? C.green : 'rgba(255,255,255,0.3)' }}>{q.clicks as number}</div>,
                <div key={`i${i}`} style={{ fontSize: '0.75rem', padding: '0.4rem 0', borderBottom: `1px solid ${C.border}`, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>{q.impressions as number}</div>,
              ]
            })}
          </div>
        </div>
      )}

      {/* Tracked keywords not ranking */}
      {notRanking.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <Label>🎯 Target Keywords — Not Yet Ranking ({notRanking.length})</Label>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 1rem' }}>These are opportunities — each needs a blog post or page targeting it</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {notRanking.map((k: Record<string, unknown>) => (
              <span key={k.keyword as string} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.3rem 0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                {k.keyword as string}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
