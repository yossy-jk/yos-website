'use client'
import { useEffect, useState, useCallback } from 'react'

const C = { teal: '#00B5A5', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)' }

const TYPE_CONFIG: Record<string, { label: string; colour: string; icon: string }> = {
  'linkedin-post':   { label: 'LinkedIn', colour: '#0077b5', icon: '💼' },
  'proposal':        { label: 'Proposal', colour: C.teal, icon: '📄' },
  'cold-email':      { label: 'Cold Email', colour: '#8b5cf6', icon: '✉️' },
  'invoice-chaser':  { label: 'Invoice', colour: C.red, icon: '💰' },
  'tender-decision': { label: 'Tender', colour: C.amber, icon: '🏗️' },
  'blog-post':       { label: 'Blog Post', colour: '#10b981', icon: '📝' },
  'email-draft':     { label: 'Email', colour: '#6366f1', icon: '📧' },
  'other':           { label: 'Other', colour: '#6b7280', icon: '📌' },
}

export default function ApprovalsTab({ onCountChange }: { onCountChange?: (n: number) => void }) {
  const [queue, setQueue] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const loadQueue = useCallback(() => {
    fetch('/api/queue/list').then(r => r.ok ? r.json() : { items: [] }).then(d => {
      const items = d.pending || d.items || []
      setQueue(items)
      onCountChange?.(items.length)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [onCountChange])

  useEffect(() => { loadQueue() }, [loadQueue])

  const action = async (id: string, act: 'approve' | 'skip') => {
    setActing(id)
    await fetch('/api/queue/action', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id, action: act }) }).catch(() => {})
    setQueue(q => q.filter(i => i.id !== id))
    onCountChange?.(queue.length - 1)
    setActing(null)
  }

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading approvals...</div>

  if (queue.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '3rem', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>✅</p>
        <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', margin: '0 0 0.25rem' }}>Queue is clear</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', margin: 0 }}>Agents are working. Blog posts, emails and proposals will appear here for your approval.</p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{queue.length} item{queue.length !== 1 ? 's' : ''} need your approval</p>
        <button onClick={loadQueue} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', padding: '0.35rem 0.875rem', cursor: 'pointer', borderRadius: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Refresh</button>
      </div>

      {queue.map((item: Record<string, unknown>) => {
        const cfg = TYPE_CONFIG[item.type as string] || TYPE_CONFIG.other
        const isExp = expanded === item.id as string
        const content = item.content as string || ''
        return (
          <div key={item.id as string} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{cfg.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title as string || content.slice(0, 60)}</p>
                <span style={{ fontSize: '0.58rem', background: `${cfg.colour}22`, color: cfg.colour, padding: '0.1rem 0.4rem', borderRadius: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cfg.label}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => setExpanded(isExp ? null : item.id as string)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.35rem 0.75rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', cursor: 'pointer' }}>
                  {isExp ? 'Hide' : 'Preview'}
                </button>
                <button onClick={() => action(item.id as string, 'skip')} disabled={acting === item.id as string}
                  style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 4, padding: '0.35rem 0.75rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', cursor: 'pointer' }}>
                  Skip
                </button>
                <button onClick={() => action(item.id as string, 'approve')} disabled={acting === item.id as string}
                  style={{ background: C.green, border: 'none', borderRadius: 4, padding: '0.35rem 1rem', color: 'white', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', opacity: acting === item.id as string ? 0.5 : 1 }}>
                  {acting === item.id as string ? '...' : '✓ Approve'}
                </button>
              </div>
            </div>
            {isExp && (
              <div style={{ borderTop: `1px solid ${C.border}`, padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.2)' }}>
                <pre style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {content.slice(0, 2000)}{content.length > 2000 ? '...' : ''}
                </pre>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
