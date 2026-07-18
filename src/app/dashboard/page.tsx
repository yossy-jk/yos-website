'use client'
import { useState, useEffect, useRef } from 'react'
import PersonalFinanceTab from './tabs/personal-finance-tab'
import ContentTab from './tabs/content-tab'

type Task = { title: string; due: string; tags: string; why: string }
type FeedItem = { type: string; priority: number; title: string; detail: string; action: string; count: number }
type Tile = { label: string; value: any; sub: string; fmt: string }
type Feed = { next3: Task[]; feed: FeedItem[]; numbers: Tile[]; generated: string } | null
type ChatMsg = { role: 'you' | 'fleet'; text: string }

const fmtVal = (v: any, fmt: string) => {
  if (v === '—' || v == null) return '—'
  if (fmt === 'money') {
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[$,]/g, ''))
    if (isNaN(n)) return String(v)
    return (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })
  }
  return String(v)
}

export default function Dashboard() {
  const [d, setD] = useState<Feed>(null)
  const [view, setView] = useState<'home' | 'content' | 'personal-finance'>('home')
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [q, setQ] = useState('')
  const [asking, setAsking] = useState(false)
  const chatEnd = useRef<HTMLDivElement>(null)

  const load = () => {
    fetch('/api/feed', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null).then(j => { if (j) setD(j) }).catch(() => {})
  }
  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t) }, [])
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat])

  const ask = async () => {
    if (!q.trim() || asking) return
    const question = q.trim()
    setChat(c => [...c, { role: 'you', text: question }])
    setQ(''); setAsking(true)
    try {
      const r = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: question }),
      })
      const { id } = await r.json()
      // Poll for answer up to 30s
      for (let i = 0; i < 15; i++) {
        await new Promise(res => setTimeout(res, 2000))
        const a = await fetch(`/api/chat?id=${id}`, { cache: 'no-store' }).then(r => r.json())
        if (a?.a) { setChat(c => [...c, { role: 'fleet', text: a.a }]); setAsking(false); return }
      }
      setChat(c => [...c, { role: 'fleet', text: 'The fleet is taking too long — the Mac Mini responder may be down. Try again shortly.' }])
    } catch {
      setChat(c => [...c, { role: 'fleet', text: 'Connection issue — try again.' }])
    }
    setAsking(false)
  }

  const S = {
    page: { fontFamily: '-apple-system, sans-serif', background: '#0a0e17', minHeight: '100vh', color: '#e5e7eb', padding: '12px 12px 90px' } as const,
    card: { background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 14, marginBottom: 12 } as const,
    h: { fontSize: 13, fontWeight: 700 as const, color: '#9ca3af', margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  }

  if (view !== 'home') return (
    <div style={S.page}>
      <button onClick={() => setView('home')}
        style={{ background: '#1f2937', color: '#e5e7eb', border: 0, borderRadius: 8, padding: '8px 14px', marginBottom: 12, cursor: 'pointer' }}>
        ← Command Centre
      </button>
      {view === 'content' && <ContentTab />}
      {view === 'personal-finance' && <PersonalFinanceTab />}
    </div>
  )

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <h1 style={{ fontSize: 20, margin: 0, color: '#f9fafb' }}>Command Centre</h1>
        <span style={{ fontSize: 10, color: '#4b5563' }}>{d?.generated || '…'}</span>
      </div>

      {/* NEXT 3 TASKS */}
      <div style={{ ...S.card, borderColor: '#1e3a8a' }}>
        <h3 style={{ ...S.h, color: '#60a5fa' }}>Next 3 Tasks</h3>
        {(d?.next3 || []).map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: i ? '1px solid #1f2937' : 'none' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#374151', minWidth: 22 }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#f9fafb', lineHeight: 1.3 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: t.why === 'overdue' ? '#f87171' : '#6b7280', marginTop: 2 }}>
                {t.why === 'overdue' ? `⚠ overdue (${t.due})` : t.why === 'needle' ? '🎯 needle' : t.due || ''}
              </div>
            </div>
          </div>
        ))}
        {!d?.next3?.length && <div style={{ color: '#4b5563', fontSize: 13 }}>No open tasks — feed loading or task list empty.</div>}
      </div>

      {/* CRUCIAL NUMBERS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: 8, marginBottom: 12 }}>
        {(d?.numbers || []).map((n, i) => (
          <div key={i} style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#6b7280' }}>{n.label}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#f9fafb', margin: '2px 0' }}>{fmtVal(n.value, n.fmt)}</div>
            <div style={{ fontSize: 9, color: '#4b5563' }}>{n.sub}</div>
          </div>
        ))}
      </div>

      {/* NEEDS JOE */}
      <div style={S.card}>
        <h3 style={S.h}>Needs You</h3>
        {(d?.feed || []).map((f, i) => (
          <div key={i}
               onClick={() => { if (f.action === 'content' || f.action === 'personal-finance') setView(f.action as any) }}
               style={{ display: 'flex', gap: 10, padding: '10px 0', borderTop: i ? '1px solid #1f2937' : 'none',
                        cursor: ['content', 'personal-finance'].includes(f.action) ? 'pointer' : 'default' }}>
            <span style={{ fontSize: 16 }}>
              {f.type === 'content' ? '📝' : f.type === 'quotes' ? '💰' : f.type === 'cash' ? '⚠️' : f.type === 'needles' ? '🎯' : '🔔'}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#f9fafb' }}>{f.title}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{f.detail}</div>
            </div>
            {['content', 'personal-finance'].includes(f.action) && <span style={{ color: '#374151' }}>›</span>}
          </div>
        ))}
        {!d?.feed?.length && <div style={{ color: '#22c55e', fontSize: 13 }}>✓ Nothing waiting on you right now.</div>}
      </div>

      {/* DEEP DIVES */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setView('content')}
          style={{ flex: 1, background: '#111827', border: '1px solid #1f2937', color: '#e5e7eb', borderRadius: 10, padding: '12px 0', fontSize: 13, cursor: 'pointer' }}>
          📝 Content
        </button>
        <button onClick={() => setView('personal-finance')}
          style={{ flex: 1, background: '#111827', border: '1px solid #1f2937', color: '#e5e7eb', borderRadius: 10, padding: '12px 0', fontSize: 13, cursor: 'pointer' }}>
          💰 Personal
        </button>
      </div>

      {/* CHAT LOG */}
      {chat.length > 0 && (
        <div style={{ ...S.card, maxHeight: 300, overflowY: 'auto' }}>
          {chat.map((m, i) => (
            <div key={i} style={{ marginBottom: 10, textAlign: m.role === 'you' ? 'right' : 'left' }}>
              <div style={{ display: 'inline-block', maxWidth: '85%', padding: '8px 12px', borderRadius: 12, fontSize: 13,
                            background: m.role === 'you' ? '#1e3a8a' : '#1f2937',
                            color: '#e5e7eb', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                {m.text}
              </div>
            </div>
          ))}
          {asking && <div style={{ color: '#6b7280', fontSize: 12 }}>Fleet is thinking…</div>}
          <div ref={chatEnd} />
        </div>
      )}

      {/* CHAT BAR (fixed bottom) */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0a0e17',
                    borderTop: '1px solid #1f2937', padding: '10px 12px', display: 'flex', gap: 8 }}>
        <input value={q} onChange={e => setQ(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && ask()}
               placeholder="Ask the fleet anything…"
               style={{ flex: 1, background: '#111827', border: '1px solid #1f2937', borderRadius: 10,
                        padding: '12px 14px', color: '#e5e7eb', fontSize: 14, outline: 'none' }} />
        <button onClick={ask} disabled={asking}
                style={{ background: asking ? '#374151' : '#2563eb', color: '#fff', border: 0,
                         borderRadius: 10, padding: '0 18px', fontSize: 15, cursor: 'pointer' }}>
          {asking ? '…' : '→'}
        </button>
      </div>
    </div>
  )
}
