'use client'
import { useState, useEffect } from 'react'

type Card = {
  id: number; channel: string; status: string; idea: string; angle: string
  draft: string | null; image_hint: string; quality_score: number
  quality_notes: string; scheduled_for: string | null; posted_at: string | null
  perf_impressions: number | null; perf_clicks: number | null
}
type Pipeline = { columns: string[]; cards: Card[]; generated: string } | null

const CHANNEL_LABELS: Record<string, string> = {
  'joe-linkedin': 'Joe · LinkedIn', 'yos-linkedin': 'YOS · LinkedIn',
  'yos-instagram': 'YOS · Insta', 'tr-instagram': 'TenantRep · Insta',
}
const CHANNEL_COLORS: Record<string, string> = {
  'joe-linkedin': '#0a66c2', 'yos-linkedin': '#0a66c2',
  'yos-instagram': '#d6249f', 'tr-instagram': '#d6249f',
}
const COL_LABELS: Record<string, string> = {
  idea: 'Ideas', drafting: 'Drafting', quality_loop: 'Quality Loop',
  review: 'Your Review', approved: 'Approved', scheduled: 'Scheduled', posted: 'Posted',
}

export default function ContentTab() {
  const [d, setD] = useState<Pipeline>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [suggestion, setSuggestion] = useState('')
  const [sugChannel, setSugChannel] = useState('yos-linkedin')
  const [editText, setEditText] = useState('')

  const load = () => {
    fetch('/api/content-pipeline', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null).then(j => { if (j) setD(j) })
      .catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const act = async (id: number, action: string, extra?: object) => {
    await fetch('/api/content-pipeline', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action, ...extra }),
    })
    // Optimistic UI: move card locally
    if (d) {
      const cards = d.cards.map(c => c.id === id
        ? { ...c, status: action === 'approve' ? 'approved' : action === 'reject' ? 'archived' : c.status }
        : c).filter(c => c.status !== 'archived')
      setD({ ...d, cards })
    }
    setExpanded(null)
  }

  if (loading) return <div style={{ color: '#6b7280', padding: 40 }}>Loading pipeline…</div>
  if (!d) return (
    <div style={{ color: '#9ca3af', padding: 40 }}>
      Content pipeline not initialised. Run <code>python3 ~/.openclaw/tools/content_sync.py</code> on the Mac Mini.
    </div>
  )

  const cols = d.columns.filter(c => c !== 'archived')

  const suggest = async () => {
    if (!suggestion.trim()) return
    await fetch('/api/content-pipeline', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'suggest', idea: suggestion, channel: sugChannel }),
    })
    setSuggestion('')
    alert('Idea sent to the pipeline — it will be drafted in the next cycle.')
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: 12, marginBottom: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input value={suggestion} onChange={e => setSuggestion(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && suggest()}
               placeholder="Suggest content — e.g. 'Post about the new corner workstation range'"
               style={{ flex: '1 1 240px', background: '#0b0f19', border: '1px solid #1f2937', borderRadius: 8, padding: '10px 12px', color: '#e5e7eb', fontSize: 13, outline: 'none' }} />
        <select value={sugChannel} onChange={e => setSugChannel(e.target.value)}
                style={{ background: '#0b0f19', border: '1px solid #1f2937', borderRadius: 8, color: '#e5e7eb', fontSize: 12, padding: '0 8px' }}>
          <option value="yos-linkedin">YOS LinkedIn</option>
          <option value="joe-linkedin">Joe LinkedIn</option>
          <option value="yos-instagram">YOS Instagram</option>
          <option value="tr-instagram">TenantRep Insta</option>
        </select>
        <button onClick={suggest}
                style={{ background: '#2563eb', color: '#fff', border: 0, borderRadius: 8, padding: '10px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          + Suggest
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 16, color: '#f9fafb' }}>Content Pipeline</h2>
        <span style={{ fontSize: 11, color: '#4b5563' }}>Updated {d.generated}</span>
      </div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12 }}>
        {cols.map(col => {
          const cards = d.cards.filter(c => c.status === col)
          return (
            <div key={col} style={{ minWidth: 230, maxWidth: 260, flex: '0 0 auto' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: col === 'review' ? '#fbbf24' : '#9ca3af',
                            padding: '6px 4px', borderBottom: '2px solid #1f2937', marginBottom: 8 }}>
                {COL_LABELS[col] || col} <span style={{ color: '#4b5563' }}>({cards.length})</span>
              </div>
              {cards.map(c => (
                <div key={c.id}
                     onClick={() => { setExpanded(expanded === c.id ? null : c.id); setEditText(c.draft || '') }}
                     style={{ background: '#111827', border: `1px solid ${col === 'review' ? '#78350f' : '#1f2937'}`,
                              borderRadius: 8, padding: 10, marginBottom: 8, cursor: 'pointer', fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: CHANNEL_COLORS[c.channel] || '#9ca3af' }}>
                      {CHANNEL_LABELS[c.channel] || c.channel}
                    </span>
                    {c.quality_score > 0 &&
                      <span style={{ fontSize: 10, color: c.quality_score >= 9.5 ? '#22c55e' : '#f59e0b' }}>
                        {c.quality_score.toFixed(1)}
                      </span>}
                  </div>
                  <div style={{ color: '#e5e7eb', lineHeight: 1.35 }}>{c.idea?.slice(0, 90)}</div>
                  {c.scheduled_for && <div style={{ fontSize: 10, color: '#60a5fa', marginTop: 4 }}>📅 {c.scheduled_for}</div>}
                  {c.perf_impressions != null && c.perf_impressions > 0 &&
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                      👁 {c.perf_impressions} · 🔗 {c.perf_clicks}
                    </div>}

                  {expanded === c.id && (
                    <div onClick={e => e.stopPropagation()} style={{ marginTop: 10, borderTop: '1px solid #1f2937', paddingTop: 10 }}>
                      {col === 'review' ? (
                        <>
                          <textarea value={editText} onChange={e => setEditText(e.target.value)}
                            style={{ width: '100%', minHeight: 160, background: '#0b0f19', color: '#e5e7eb',
                                     border: '1px solid #1f2937', borderRadius: 6, padding: 8, fontSize: 12 }} />
                          {c.quality_notes && <div style={{ fontSize: 10, color: '#f59e0b', margin: '6px 0' }}>Note: {c.quality_notes}</div>}
                          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                            <button onClick={() => act(c.id, editText !== c.draft ? 'edit' : 'approve', { draft: editText })}
                              style={{ flex: 1, background: '#16a34a', color: '#fff', border: 0, borderRadius: 6, padding: '8px 0', fontWeight: 700, cursor: 'pointer' }}>
                              ✓ Approve
                            </button>
                            <button onClick={() => act(c.id, 'reject')}
                              style={{ flex: 1, background: '#7f1d1d', color: '#fca5a5', border: 0, borderRadius: 6, padding: '8px 0', cursor: 'pointer' }}>
                              ✗ Reject
                            </button>
                          </div>
                        </>
                      ) : (
                        <div style={{ whiteSpace: 'pre-wrap', color: '#d1d5db', fontSize: 12 }}>
                          {c.draft || c.angle || '(not yet drafted)'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
