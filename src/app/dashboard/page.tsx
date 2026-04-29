'use client'
import { useEffect, useState, useCallback, useRef } from 'react'

const TOKEN = 'yos-joe-2026'

// ── Types ───────────────────────────────────────────────────────────────────
type Priority = { label: string; detail: string; type: 'critical' | 'action' | 'info' }
type Deal = {
  id: string; name: string; stage: string; amount: number
  closeDate: string | null; daysToClose: number | null
  daysSinceMod: number; isStale: boolean; isOverdue: boolean; isUrgent: boolean
}
type CalEvent = { subject: string; start: string; end: string; location: string }
type XeroData = { outstanding: number; overdue: number; overdueCount: number; outstandingCount: number }
type DashboardData = {
  generatedAt: string; priorities: Priority[]
  pipeline: { totalDeals: number; totalValue: number; staleDeals: number; deals: Deal[] }
  proposalDeals: Deal[]; events: CalEvent[]; xero: XeroData
}
type QueueItem = {
  id: string; type: string; title: string; content: string; agentId: string
  metadata: Record<string, string>; priority: string; status: string
  createdAt: string; updatedAt: string; editFeedback?: string; editCount?: number
  approvedAt?: string; skippedAt?: string; approvedContent?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`
  return `$${n.toLocaleString()}`
}
function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' })
}
function fmtEventDate(iso: string) {
  const d = new Date(iso)
  const todayStr = new Date().toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' })
  const tomorrowD = new Date(); tomorrowD.setDate(tomorrowD.getDate() + 1)
  const tomorrowStr = tomorrowD.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' })
  const evStr = d.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' })
  if (evStr === todayStr) return 'Today'
  if (evStr === tomorrowStr) return 'Tomorrow'
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Australia/Sydney' })
}
function aestNow() {
  return new Date().toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney', weekday: 'long', day: 'numeric', month: 'long',
    year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  })
}
function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const TYPE_CONFIG: Record<string, { label: string; colour: string; icon: string }> = {
  'linkedin-post':   { label: 'LinkedIn', colour: '#0077b5', icon: '💼' },
  'proposal':        { label: 'Proposal', colour: '#00B5A5', icon: '📄' },
  'cold-email':      { label: 'Cold Email', colour: '#8b5cf6', icon: '✉️' },
  'invoice-chaser':  { label: 'Invoice', colour: '#ef4444', icon: '💰' },
  'tender-decision': { label: 'Tender', colour: '#f59e0b', icon: '🏗️' },
  'blog-post':       { label: 'Blog Post', colour: '#10b981', icon: '📝' },
  'email-draft':     { label: 'Email', colour: '#6366f1', icon: '📧' },
  'other':           { label: 'Other', colour: '#6b7280', icon: '📌' },
}

const PRIORITY_COLOURS = {
  critical: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', dot: '#ef4444' },
  action:   { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', dot: '#f59e0b' },
  info:     { bg: 'rgba(0,181,165,0.08)',  border: 'rgba(0,181,165,0.3)',  dot: '#00B5A5' },
}

const SECTION_STYLE = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  padding: '1.75rem',
}
const SECTION_LABEL = {
  color: '#00B5A5', fontSize: '0.58rem', letterSpacing: '0.3em',
  textTransform: 'uppercase' as const, fontWeight: 700, margin: '0 0 1.25rem',
}

// ── Queue Item Card ──────────────────────────────────────────────────────────
function QueueCard({ item, onAction, refreshing }: {
  item: QueueItem
  onAction: (id: string, action: 'approve' | 'skip' | 'edit', editedContent?: string, feedback?: string) => Promise<void>
  refreshing: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(item.content)
  const [feedback, setFeedback] = useState('')
  const [acting, setActing] = useState(false)
  const tc = TYPE_CONFIG[item.type] || TYPE_CONFIG['other']

  const act = async (action: 'approve' | 'skip' | 'edit') => {
    setActing(true)
    await onAction(item.id, action, action === 'approve' ? editContent : action === 'edit' ? editContent : undefined, feedback)
    setActing(false)
    setEditing(false)
  }

  return (
    <div style={{
      border: `1px solid rgba(255,255,255,0.1)`,
      borderLeft: `3px solid ${tc.colour}`,
      background: 'rgba(255,255,255,0.02)',
      marginBottom: '0.75rem',
      opacity: acting || refreshing ? 0.6 : 1,
      transition: 'opacity 0.2s',
    }}>
      {/* Header */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <span style={{ fontSize: '1rem', flexShrink: 0 }}>{tc.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ color: tc.colour, fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{tc.label}</span>
            {item.priority === 'urgent' && <span style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.55rem', fontWeight: 700, padding: '0.1rem 0.4rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Urgent</span>}
            {(item.editCount || 0) > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>revised ×{item.editCount}</span>}
          </div>
          <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, margin: '0.2rem 0 0', lineHeight: 1.3 }}>{item.title}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>{timeAgo(item.createdAt)}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          {/* Content */}
          {editing ? (
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              style={{
                width: '100%', minHeight: '160px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.82rem',
                lineHeight: 1.7, padding: '0.875rem', fontFamily: 'inherit', resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <div style={{
              background: 'rgba(0,0,0,0.2)', padding: '1rem', marginBottom: '1rem',
              borderRadius: '0.25rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.75, whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto',
            }}>
              {item.editFeedback && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.5rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.72rem', color: '#f59e0b' }}>
                  Previous feedback: {item.editFeedback}
                </div>
              )}
              {editContent}
            </div>
          )}

          {/* Metadata */}
          {Object.keys(item.metadata).length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {Object.entries(item.metadata).map(([k, v]) => (
                <span key={k} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>{k}:</span> {v}
                </span>
              ))}
            </div>
          )}

          {/* Feedback field for edit */}
          {editing && (
            <input
              type="text"
              placeholder="Feedback for agent (optional)..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontSize: '0.75rem', padding: '0.6rem 0.875rem', fontFamily: 'inherit',
                marginBottom: '0.75rem', boxSizing: 'border-box',
              }}
            />
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {!editing ? (
              <>
                <button onClick={() => act('approve')} disabled={acting}
                  style={{ background: '#00B5A5', color: 'white', border: 'none', padding: '0.6rem 1.25rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✓ Approve
                </button>
                <button onClick={() => setEditing(true)} disabled={acting}
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', padding: '0.6rem 1.25rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✎ Edit
                </button>
                <button onClick={() => act('skip')} disabled={acting}
                  style={{ background: 'transparent', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.6rem 1.25rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Skip
                </button>
              </>
            ) : (
              <>
                <button onClick={() => act('edit')} disabled={acting}
                  style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.6rem 1.25rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Save Edits
                </button>
                <button onClick={() => act('approve')} disabled={acting}
                  style={{ background: '#00B5A5', color: 'white', border: 'none', padding: '0.6rem 1.25rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Approve As Edited
                </button>
                <button onClick={() => { setEditing(false); setEditContent(item.content) }} disabled={acting}
                  style={{ background: 'transparent', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.6rem 1.25rem', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [archive, setArchive] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [queueLoading, setQueueLoading] = useState(false)
  const [energy, setEnergy] = useState<number | null>(null)
  const [now, setNow] = useState(aestNow())
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queue' | 'archive'>('dashboard')
  const [showPipeline, setShowPipeline] = useState(false)
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard-data?token=${TOKEN}`)
      if (res.ok) setData(await res.json())
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  const loadQueue = useCallback(async () => {
    try {
      setQueueLoading(true)
      const res = await fetch(`/api/queue/list?token=${TOKEN}`)
      if (res.ok) {
        const d = await res.json()
        setQueue(d.pending || [])
        setArchive(d.archive || [])
      }
    } catch { /* silent */ }
    finally { setQueueLoading(false) }
  }, [])

  const handleQueueAction = useCallback(async (id: string, action: 'approve' | 'skip' | 'edit', editedContent?: string, feedback?: string) => {
    await fetch('/api/queue/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action, editedContent, feedback, token: TOKEN }),
    })
    await loadQueue()
  }, [loadQueue])

  useEffect(() => {
    loadDashboard()
    loadQueue()
    const saved = localStorage.getItem('yos-energy-' + new Date().toDateString())
    if (saved) setEnergy(parseInt(saved))
    const t = setInterval(() => setNow(aestNow()), 60000)
    return () => clearInterval(t)
  }, [loadDashboard, loadQueue])

  // Auto-refresh queue every 2 min
  useEffect(() => {
    refreshTimer.current = setInterval(loadQueue, 120000)
    return () => { if (refreshTimer.current) clearInterval(refreshTimer.current) }
  }, [loadQueue])

  useEffect(() => {
    document.body.style.overflow = ''
  }, [])

  const setEnergyLevel = (n: number) => {
    setEnergy(n)
    localStorage.setItem('yos-energy-' + new Date().toDateString(), String(n))
  }

  const ENERGY_LABELS = ['', 'Running on fumes', 'Below average', 'Solid', 'High energy', 'At my best']
  const ENERGY_COLOURS = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#00B5A5']

  const pendingCount = queue.length
  const urgentCount = queue.filter(q => q.priority === 'urgent').length

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: 'clamp(1.25rem, 4vw, 2.5rem)' }}>

      {/* ── Top Bar ── */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ color: '#00B5A5', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 0.3rem' }}>Your Office Space</p>
          <h1 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Good morning, Joe.</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', margin: '0.3rem 0 0', fontWeight: 300 }}>{now}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button onClick={() => { loadDashboard(); loadQueue() }}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
            Refresh
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 0, marginBottom: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {([
          { key: 'dashboard' as const, label: 'Dashboard', badge: false },
          { key: 'queue' as const, label: `Approvals${pendingCount > 0 ? ` (${pendingCount})` : ''}`, badge: urgentCount > 0 },
          { key: 'archive' as const, label: 'History', badge: false },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'transparent', border: 'none', padding: '0.75rem 1.25rem', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.35)',
              borderBottom: activeTab === tab.key ? '2px solid #00B5A5' : '2px solid transparent',
              marginBottom: '-1px',
            }}>
            {tab.label}
            {tab.badge === true && <span style={{ background: '#ef4444', color: 'white', fontSize: '0.5rem', padding: '0.1rem 0.35rem', borderRadius: '999px', marginLeft: '0.4rem', verticalAlign: 'middle' }}>{urgentCount}</span>}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD TAB ── */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

          {/* Priorities */}
          <div style={{ gridColumn: '1 / -1', ...SECTION_STYLE }}>
            <p style={SECTION_LABEL}>Today&apos;s Priorities</p>
            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>Loading...</p>
            ) : !data?.priorities.length ? (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Nothing critical. Good day to focus on growth.</p>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                {data.priorities.map((p, i) => {
                  const c = PRIORITY_COLOURS[p.type]
                  return (
                    <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, padding: '1.1rem' }}>
                      <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.dot, flexShrink: 0, marginTop: '0.35rem' }} />
                        <div>
                          <p style={{ color: 'white', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 0.25rem', lineHeight: 1.3 }}>{p.label}</p>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', margin: 0, lineHeight: 1.5 }}>{p.detail}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {/* Approval queue nudge */}
                {pendingCount > 0 && (
                  <div style={{ background: 'rgba(0,181,165,0.06)', border: '1px solid rgba(0,181,165,0.2)', padding: '1.1rem', cursor: 'pointer' }} onClick={() => setActiveTab('queue')}>
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00B5A5', flexShrink: 0, marginTop: '0.35rem' }} />
                      <div>
                        <p style={{ color: 'white', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{pendingCount} item{pendingCount !== 1 ? 's' : ''} awaiting your approval</p>
                        <p style={{ color: 'rgba(0,181,165,0.7)', fontSize: '0.7rem', margin: 0 }}>Tap to review →</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Energy */}
          <div style={SECTION_STYLE}>
            <p style={SECTION_LABEL}>Energy Today</p>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setEnergyLevel(n)}
                  style={{
                    flex: 1, padding: '0.65rem 0', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
                    background: energy === n ? ENERGY_COLOURS[n] : 'rgba(255,255,255,0.05)',
                    border: energy === n ? `1px solid ${ENERGY_COLOURS[n]}` : '1px solid rgba(255,255,255,0.08)',
                    color: energy === n ? 'white' : 'rgba(255,255,255,0.35)', transition: 'all 0.15s',
                  }}>{n}</button>
              ))}
            </div>
            {energy
              ? <p style={{ color: ENERGY_COLOURS[energy], fontSize: '0.72rem', fontWeight: 600, margin: 0 }}>{ENERGY_LABELS[energy]}</p>
              : <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', margin: 0 }}>Tap 1–5 to set today&apos;s energy</p>}
          </div>

          {/* Calendar */}
          <div style={SECTION_STYLE}>
            <p style={SECTION_LABEL}>Next 7 Days</p>
            {!data?.events.length
              ? <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>No upcoming events.</p>
              : (data.events.map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.875rem', padding: '0.65rem 0.875rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid #00B5A5', marginBottom: '0.4rem' }}>
                  <div style={{ flexShrink: 0, minWidth: '56px' }}>
                    <p style={{ color: '#00B5A5', fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{fmtEventDate(ev.start)}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', margin: '0.1rem 0 0' }}>{fmtTime(ev.start)}</p>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{ev.subject}</p>
                    {ev.location && <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.62rem', margin: '0.15rem 0 0' }}>{ev.location}</p>}
                  </div>
                </div>
              )))}
          </div>

          {/* Money */}
          <div style={SECTION_STYLE}>
            <p style={SECTION_LABEL}>Money</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.25rem' }}>AR Outstanding</p>
                <p style={{ fontSize: 'clamp(1.3rem,2.5vw,1.7rem)', fontWeight: 900, margin: 0 }}>{fmt(data?.xero.outstanding || 0)}</p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.62rem', margin: '0.2rem 0 0' }}>{data?.xero.outstandingCount || 0} invoice{data?.xero.outstandingCount !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.25rem' }}>Overdue Now</p>
                <p style={{ fontSize: 'clamp(1.3rem,2.5vw,1.7rem)', fontWeight: 900, margin: 0, color: (data?.xero.overdue || 0) > 0 ? '#ef4444' : '#22c55e' }}>
                  {fmt(data?.xero.overdue || 0)}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.62rem', margin: '0.2rem 0 0' }}>{data?.xero.overdueCount || 0} overdue</p>
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div style={{ gridColumn: '1 / -1', ...SECTION_STYLE }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p style={{ ...SECTION_LABEL, margin: 0 }}>Pipeline</p>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}><strong style={{ color: 'white' }}>{data?.pipeline.totalDeals || 0}</strong> open</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}><strong style={{ color: '#00B5A5' }}>{fmt(data?.pipeline.totalValue || 0)}</strong> value</span>
                {(data?.pipeline.staleDeals || 0) > 0 && <span style={{ color: '#f59e0b', fontSize: '0.68rem' }}><strong>{data?.pipeline.staleDeals}</strong> stale</span>}
                <button onClick={() => setShowPipeline(s => !s)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', padding: '0.3rem 0.7rem', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {showPipeline ? 'Hide' : 'Show all'}
                </button>
              </div>
            </div>
            {showPipeline && data?.pipeline.deals.map(deal => (
              <div key={deal.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.65rem 0.875rem', marginBottom: '0.3rem', flexWrap: 'wrap',
                background: deal.isOverdue ? 'rgba(239,68,68,0.05)' : deal.isUrgent ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.02)',
                borderLeft: `2px solid ${deal.isOverdue ? '#ef4444' : deal.isUrgent ? '#f59e0b' : deal.isStale ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
              }}>
                <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                  <p style={{ color: 'white', fontSize: '0.78rem', fontWeight: 600, margin: 0 }}>{deal.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.62rem', margin: '0.1rem 0 0' }}>{deal.stage}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexShrink: 0 }}>
                  {deal.amount > 0 && <span style={{ color: '#00B5A5', fontSize: '0.78rem', fontWeight: 700 }}>{fmt(deal.amount)}</span>}
                  {deal.closeDate && <span style={{ color: deal.isOverdue ? '#ef4444' : deal.isUrgent ? '#f59e0b' : 'rgba(255,255,255,0.3)', fontSize: '0.62rem' }}>
                    {deal.isOverdue ? `${Math.abs(deal.daysToClose!)}d overdue` : deal.daysToClose === 0 ? 'Due today' : fmtDate(deal.closeDate)}
                  </span>}
                  {deal.isStale && !deal.isOverdue && !deal.isUrgent && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem' }}>{deal.daysSinceMod}d quiet</span>}
                </div>
              </div>
            ))}
            {!showPipeline && (
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', margin: 0 }}>
                Click &quot;Show all&quot; to see all {data?.pipeline.totalDeals || 0} deals
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── QUEUE TAB ── */}
      {activeTab === 'queue' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <p style={{ color: 'white', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                {pendingCount === 0 ? 'Queue is clear' : `${pendingCount} item${pendingCount !== 1 ? 's' : ''} to review`}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', margin: '0.2rem 0 0' }}>
                Approve, edit, or skip each item. Approved content is backed up in History.
              </p>
            </div>
            <button onClick={loadQueue} disabled={queueLoading}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              {queueLoading ? '...' : 'Refresh'}
            </button>
          </div>

          {pendingCount === 0 ? (
            <div style={{ ...SECTION_STYLE, textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', margin: 0 }}>Nothing waiting for review.</p>
              <p style={{ color: 'rgba(255,255,255,0.1)', fontSize: '0.72rem', margin: '0.5rem 0 0' }}>Agents will submit LinkedIn posts, proposals, emails and tender decisions here.</p>
            </div>
          ) : (
            queue.map(item => (
              <QueueCard key={item.id} item={item} onAction={handleQueueAction} refreshing={queueLoading} />
            ))
          )}
        </div>
      )}

      {/* ── ARCHIVE TAB ── */}
      {activeTab === 'archive' && (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginBottom: '1.25rem' }}>
            All approved and skipped content — most recent first.
          </p>
          {archive.length === 0 ? (
            <div style={{ ...SECTION_STYLE, textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', margin: 0 }}>No history yet.</p>
            </div>
          ) : (
            archive.map(item => {
              const tc = TYPE_CONFIG[item.type] || TYPE_CONFIG['other']
              const isApproved = item.status === 'approved'
              return (
                <div key={item.id + (item.approvedAt || item.skippedAt)} style={{
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderLeft: `3px solid ${isApproved ? tc.colour : 'rgba(255,255,255,0.15)'}`,
                  background: 'rgba(255,255,255,0.015)', marginBottom: '0.5rem', padding: '1rem 1.25rem',
                  opacity: isApproved ? 1 : 0.5,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.9rem' }}>{tc.icon}</span>
                    <span style={{ color: tc.colour, fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{tc.label}</span>
                    <span style={{ color: isApproved ? '#22c55e' : 'rgba(255,255,255,0.25)', fontSize: '0.62rem', fontWeight: 600 }}>
                      {isApproved ? '✓ Approved' : '— Skipped'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', marginLeft: 'auto' }}>
                      {timeAgo(item.approvedAt || item.skippedAt || item.updatedAt)}
                    </span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 0.4rem' }}>{item.title}</p>
                  {isApproved && (
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', maxHeight: '80px', overflow: 'hidden' }}>
                      {(item.approvedContent || item.content).slice(0, 200)}{(item.approvedContent || item.content).length > 200 ? '...' : ''}
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.58rem', margin: 0 }}>YOS Operations Dashboard · yourofficespace.au</p>
        {data && <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: '0.58rem', margin: 0 }}>
          Data updated {new Date(data.generatedAt).toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour: 'numeric', minute: '2-digit', hour12: true })} AEST
        </p>}
      </div>
    </div>
  )
}
