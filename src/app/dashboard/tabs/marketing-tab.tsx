'use client'
import { useEffect, useState } from 'react'

const C = { teal: '#00B5A5', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', purple: '#8b5cf6', card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)' }

interface Keyword { rank: number; keyword: string; cluster: string; intent: string; priority: string; difficulty: string; blog_angle: string }
interface QueueItem { id: string; type: string; title: string; content: string; metadata?: Record<string,unknown> }

const CLUSTER_COLOURS: Record<string,string> = {
  'tenant-rep': C.teal, 'fitout': '#f59e0b', 'cleaning': '#22c55e',
  'furniture': '#8b5cf6', 'lease': '#ec4899', 'buyers': '#06b6d4'
}
const DIFF_COLOURS: Record<string,string> = { low: C.green, medium: C.amber, high: C.red }

export default function MarketingTab() {
  const [seo, setSeo] = useState<Record<string,unknown> | null>(null)
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)
  const [activeCluster, setActiveCluster] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Edit / Suggest state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [suggestingId, setSuggestingId] = useState<string | null>(null)
  const [suggestText, setSuggestText] = useState('')
  const [saving, setSaving] = useState(false)
  const [rewriting, setRewriting] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/seo/rankings', {credentials:'include'}).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/queue/list', {credentials:'include'}).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/seo-keywords', {credentials:'include'}).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([s, q, k]) => {
      setSeo(s)
      const items = (q?.pending || []).filter((i: QueueItem) => i.type === 'blog-post')
      setQueue(items)
      setKeywords(k?.keywords || [])
      setLoading(false)
    })
  }, [])

  const approveBlog = async (id: string) => {
    setApproving(id)
    await fetch('/api/queue/action', { method: 'POST', credentials: 'include', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id, action: 'approve' }) }).catch(() => {})
    setQueue(q => q.filter(i => i.id !== id))
    setApproving(null)
  }

  const startEdit = (item: QueueItem) => {
    setEditingId(item.id)
    setEditContent(item.content || '')
    setSuggestingId(null)
    setSuggestText('')
  }

  const saveEdit = async (id: string) => {
    if (!editContent.trim()) return
    setSaving(true)
    await fetch('/api/queue/action', {
      method: 'POST', credentials: 'include', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id, action: 'edit', editedContent: editContent, feedback: 'Manual edit by Joe' }),
    }).catch(() => {})
    setEditingId(null)
    setEditContent('')
    setSaving(false)
  }

  const startSuggest = (item: QueueItem) => {
    setSuggestingId(item.id)
    setSuggestText('')
    setEditingId(null)
    setEditContent('')
  }

  const submitSuggestion = async (id: string) => {
    if (!suggestText.trim()) return
    setRewriting(true)
    await fetch('/api/queue/action', {
      method: 'POST', credentials: 'include', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id, action: 'revision', feedback: suggestText }),
    }).catch(() => {})
    // Trigger blog rewriter
    await fetch('/api/blog-rewrite-now', { method: 'POST', credentials: 'include' }).catch(() => {})
    setQueue(q => q.filter(i => i.id !== id))
    setSuggestingId(null)
    setSuggestText('')
    setRewriting(false)
  }

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading marketing data...</div>

  const clusters = ['all', ...Array.from(new Set(keywords.map(k => k.cluster)))]
  const filtered = keywords.filter(k => {
    const matchCluster = activeCluster === 'all' || k.cluster === activeCluster
    const matchSearch = searchTerm === '' || k.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCluster && matchSearch
  })

  const p1 = keywords.filter(k => k.priority === 'P1')
  const topQueries: Record<string,unknown>[] = (seo?.topQueries as Record<string,unknown>[]) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Target Keywords', val: String(keywords.length), color: 'white' },
          { label: 'P1 Priority', val: String(p1.length), color: C.red },
          { label: 'GSC Queries', val: String(topQueries.length), color: C.teal },
          { label: 'Blog Queue', val: String(queue.length), color: queue.length > 0 ? C.amber : 'rgba(255,255,255,0.3)' },
          { label: 'GSC Status', val: seo?.connected ? 'Live' : 'Offline', color: seo?.connected ? C.green : C.red },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0.25rem 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Blog queue */}
      {queue.length > 0 && (
        <div style={{ background: C.card, border: `1px solid rgba(245,158,11,0.3)`, borderRadius: 8, padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.amber, margin: '0 0 0.75rem' }}>📝 Blog Posts Ready ({queue.length})</p>
          {queue.map(item => {
            const isEditing = editingId === item.id
            const isSuggesting = suggestingId === item.id
            return (
              <div key={item.id} style={{ background: isEditing || isSuggesting ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.04)', borderRadius: 6, marginBottom: '0.5rem', border: `1px solid ${isEditing || isSuggesting ? 'rgba(245,158,11,0.3)' : 'transparent'}` }}>
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.82rem' }}>{item.title || item.content?.slice(0,60)}</p>
                    {item.metadata?.targetKeyword ? <p style={{ margin: '0.15rem 0 0', fontSize: '0.62rem', color: C.teal }}>🎯 {String(item.metadata.targetKeyword)}</p> : null}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button onClick={() => startEdit(item)}
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.35rem 0.75rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', cursor: 'pointer' }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => startSuggest(item)}
                      style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 4, padding: '0.35rem 0.75rem', color: '#a78bfa', fontSize: '0.62rem', cursor: 'pointer' }}>
                      💡 Suggest
                    </button>
                    <button onClick={() => approveBlog(item.id)} disabled={approving === item.id}
                      style={{ background: C.green, border: 'none', borderRadius: 4, padding: '0.35rem 0.875rem', color: 'white', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>
                      {approving === item.id ? '...' : '✓ Publish'}
                    </button>
                  </div>
                </div>

                {/* Edit panel */}
                {isEditing && (
                  <div style={{ borderTop: `1px solid ${C.border}`, padding: '1rem' }}>
                    <p style={{ fontSize: '0.6rem', color: C.amber, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>✏️ Direct Edit — changes saved immediately</p>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      style={{ width: '100%', minHeight: 200, background: 'rgba(0,0,0,0.3)', border: `1px solid ${C.border}`, borderRadius: 6, padding: '0.75rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', lineHeight: 1.7, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button onClick={() => saveEdit(item.id)} disabled={saving}
                        style={{ background: C.green, border: 'none', borderRadius: 4, padding: '0.4rem 1rem', color: 'white', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}>
                        {saving ? 'Saving...' : '💾 Save Edits'}
                      </button>
                      <button onClick={() => setEditingId(null)}
                        style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.4rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggest panel */}
                {isSuggesting && (
                  <div style={{ borderTop: `1px solid rgba(139,92,246,0.3)`, padding: '1rem' }}>
                    <p style={{ fontSize: '0.6rem', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>💡 Suggest Changes — AI will rewrite the blog incorporating your feedback</p>
                    <textarea
                      value={suggestText}
                      onChange={e => setSuggestText(e.target.value)}
                      placeholder="e.g. Add a section on typical project timelines. Make the intro more specific to Newcastle. Tone should be more direct, less corporate."
                      style={{ width: '100%', minHeight: 100, background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 6, padding: '0.75rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button onClick={() => submitSuggestion(item.id)} disabled={rewriting || !suggestText.trim()}
                        style={{ background: '#7c3aed', border: 'none', borderRadius: 4, padding: '0.4rem 1rem', color: 'white', fontSize: '0.65rem', fontWeight: 700, cursor: suggestText.trim() && !rewriting ? 'pointer' : 'not-allowed', opacity: !suggestText.trim() || rewriting ? 0.5 : 1 }}>
                        {rewriting ? '⏳ Rewriting...' : '✨ Rewrite Blog'}
                      </button>
                      <button onClick={() => setSuggestingId(null)}
                        style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.4rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Top 50 keyword tracker */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: 0 }}>🎯 Top 50 Target Keywords</p>
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search keywords..."
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.3rem 0.75rem', color: 'white', fontSize: '0.72rem', width: 180, outline: 'none' }} />
        </div>

        {/* Cluster filter */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {clusters.map(c => (
            <button key={c} onClick={() => setActiveCluster(c)}
              style={{ background: activeCluster === c ? (CLUSTER_COLOURS[c] || C.teal) : 'rgba(255,255,255,0.05)', border: `1px solid ${activeCluster === c ? (CLUSTER_COLOURS[c] || C.teal) : C.border}`, borderRadius: 4, padding: '0.25rem 0.75rem', color: activeCluster === c ? 'white' : 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
              {c === 'all' ? `All (${keywords.length})` : `${c} (${keywords.filter(k=>k.cluster===c).length})`}
            </button>
          ))}
        </div>

        {/* Keyword table */}
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 90px 70px 70px', gap: 0 }}>
          {['#', 'Keyword + Blog Angle', 'Cluster', 'Priority', 'Difficulty'].map(h => (
            <div key={h} style={{ fontSize: '0.55rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.4rem 0.5rem', borderBottom: `1px solid ${C.border}` }}>{h}</div>
          ))}
          {filtered.map(k => (
            <>
              <div key={`r${k.rank}`} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', padding: '0.6rem 0.5rem', borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{k.rank}</div>
              <div key={`k${k.rank}`} style={{ padding: '0.6rem 0.5rem', borderBottom: `1px solid ${C.border}` }}>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600 }}>{k.keyword}</p>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{k.blog_angle}</p>
              </div>
              <div key={`c${k.rank}`} style={{ padding: '0.6rem 0.5rem', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: CLUSTER_COLOURS[k.cluster] || C.teal, background: `${CLUSTER_COLOURS[k.cluster] || C.teal}22`, padding: '0.15rem 0.4rem', borderRadius: 3, textTransform: 'capitalize' }}>{k.cluster}</span>
              </div>
              <div key={`p${k.rank}`} style={{ padding: '0.6rem 0.5rem', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: k.priority === 'P1' ? C.red : k.priority === 'P2' ? C.amber : 'rgba(255,255,255,0.4)', background: k.priority === 'P1' ? 'rgba(239,68,68,0.15)' : k.priority === 'P2' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', borderRadius: 3 }}>{k.priority}</span>
              </div>
              <div key={`d${k.rank}`} style={{ padding: '0.6rem 0.5rem', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: (DIFF_COLOURS as Record<string,string>)[k.difficulty] || 'white', textTransform: 'capitalize' }}>{k.difficulty}</span>
              </div>
            </>
          ))}
        </div>
      </div>

      {/* GSC live data */}
      {topQueries.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>🔍 Live GSC Data — Top Queries</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 90px', gap: 0 }}>
            {['Query', 'Position', 'Clicks', 'Impressions'].map(h => (
              <div key={h} style={{ fontSize: '0.55rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.4rem 0', borderBottom: `1px solid ${C.border}` }}>{h}</div>
            ))}
            {topQueries.slice(0, 25).map((q, i) => {
              const pos = q.position as number
              const posColour = pos <= 3 ? C.green : pos <= 10 ? C.teal : pos <= 20 ? C.amber : 'rgba(255,255,255,0.4)'
              return [
                <div key={`qk${i}`} style={{ fontSize: '0.72rem', padding: '0.4rem 0', borderBottom: `1px solid ${C.border}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.keyword as string}</div>,
                <div key={`qp${i}`} style={{ fontSize: '0.72rem', padding: '0.4rem 0', borderBottom: `1px solid ${C.border}`, color: posColour, fontWeight: 700 }}>{pos?.toFixed(1)}</div>,
                <div key={`qc${i}`} style={{ fontSize: '0.72rem', padding: '0.4rem 0', borderBottom: `1px solid ${C.border}`, color: (q.clicks as number) > 0 ? C.green : 'rgba(255,255,255,0.3)' }}>{q.clicks as number}</div>,
                <div key={`qi${i}`} style={{ fontSize: '0.72rem', padding: '0.4rem 0', borderBottom: `1px solid ${C.border}`, color: 'rgba(255,255,255,0.5)' }}>{q.impressions as number}</div>,
              ]
            })}
          </div>
        </div>
      )}
    </div>
  )
}
