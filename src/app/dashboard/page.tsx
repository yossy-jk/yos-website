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
type HealthData = {
  receivedAt: string
  latestGlucose: string | null
  latestGlucoseDate: string | null
  restingHR: string | null
  hrv: string | null
  latestWeight: string | null
  latestWeightDate: string | null
  stepsToday: string | null
  sleepTrend: { date: string; value: number }[]
  stepsTrend: { date: string; value: number }[]
  weightTrend: { date: string; value: number }[]
  glucoseTrend: { date: string; value: number }[]
}

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
          {/* Image preview for LinkedIn posts */}
          {!editing && item.metadata?.imageUrl && (
            <div style={{ marginBottom: '1rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.metadata.imageUrl}
                alt="Post image"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', margin: '0.3rem 0 0' }}>
                Image via Unsplash — swap before posting if needed
              </p>
            </div>
          )}

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

          {/* Metadata — hide imageUrl since it's shown as image above */}
          {Object.keys(item.metadata).filter(k => k !== 'imageUrl').length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {Object.entries(item.metadata).filter(([k]) => k !== 'imageUrl').map(([k, v]) => (
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
  const [health, setHealth] = useState<HealthData | null>(null)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [archive, setArchive] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [queueLoading, setQueueLoading] = useState(false)
  const [energy, setEnergy] = useState<number | null>(null)
  const [now, setNow] = useState(aestNow())
  const [activeTab, setActiveTab] = useState<'dashboard' | 'queue' | 'seo' | 'archive'>('dashboard')
  const [showPipeline, setShowPipeline] = useState(false)
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard-data?token=${TOKEN}`)
      if (res.ok) setData(await res.json())
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  const loadHealth = useCallback(async () => {
    try {
      const res = await fetch(`/api/health-intake?token=${TOKEN}`)
      if (res.ok) {
        const d = await res.json()
        if (d.data) setHealth(d.data)
      }
    } catch { /* silent */ }
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
    loadHealth()
    const saved = localStorage.getItem('yos-energy-' + new Date().toDateString())
    if (saved) setEnergy(parseInt(saved))
    const t = setInterval(() => setNow(aestNow()), 60000)
    return () => clearInterval(t)
  }, [loadDashboard, loadQueue, loadHealth])

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
          { key: 'seo' as const, label: 'SEO & AEO', badge: false },
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

          {/* Health */}
          <div style={{ gridColumn: '1 / -1', ...SECTION_STYLE }}>
            <p style={SECTION_LABEL}>Health</p>
            {!health ? (
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>No health data yet. Open Health Auto Export and tap Export Now.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                {/* Glucose */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.3rem' }}>Blood Glucose</p>
                  {health.latestGlucose ? (
                    <>
                      <p style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: parseFloat(health.latestGlucose) > 10 ? '#ef4444' : parseFloat(health.latestGlucose) < 4 ? '#f59e0b' : '#22c55e' }}>
                        {parseFloat(health.latestGlucose).toFixed(1)}
                        <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: '0.3rem' }}>mmol/L</span>
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', margin: '0.2rem 0 0' }}>{health.latestGlucoseDate}</p>
                    </>
                  ) : <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', margin: 0 }}>No CGM data</p>}
                </div>
                {/* Resting HR */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.3rem' }}>Resting HR</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: health.restingHR && parseFloat(health.restingHR) > 90 ? '#f59e0b' : '#22c55e' }}>
                    {health.restingHR || '—'}
                    <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: '0.3rem' }}>bpm</span>
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', margin: '0.2rem 0 0' }}>Target: under 70</p>
                </div>
                {/* HRV */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.3rem' }}>HRV</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
                    {health.hrv ? parseFloat(health.hrv).toFixed(0) : '—'}
                    <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: '0.3rem' }}>ms</span>
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', margin: '0.2rem 0 0' }}>Higher = better recovery</p>
                </div>
                {/* Weight */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.3rem' }}>Weight</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: health.latestWeight && parseFloat(health.latestWeight) > 93 ? '#ef4444' : health.latestWeight && parseFloat(health.latestWeight) < 85 ? '#22c55e' : 'white' }}>
                    {health.latestWeight ? parseFloat(health.latestWeight).toFixed(1) : '—'}
                    <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: '0.3rem' }}>kg</span>
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', margin: '0.2rem 0 0' }}>Target: sub-85kg</p>
                </div>
                {/* Steps */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.3rem' }}>Steps Today</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: health.stepsToday && parseFloat(health.stepsToday) >= 8000 ? '#22c55e' : '#f59e0b' }}>
                    {health.stepsToday ? parseInt(health.stepsToday).toLocaleString() : '—'}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', margin: '0.2rem 0 0' }}>Goal: 8,000/day</p>
                </div>
                {/* Sleep */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.3rem' }}>Sleep Last Night</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: health.sleepTrend?.length && health.sleepTrend[health.sleepTrend.length-1]?.value >= 7 ? '#22c55e' : '#f59e0b' }}>
                    {health.sleepTrend?.length ? health.sleepTrend[health.sleepTrend.length-1]?.value?.toFixed(1) : '—'}
                    <span style={{ fontSize: '0.65rem', fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: '0.3rem' }}>hrs</span>
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem', margin: '0.2rem 0 0' }}>Target: 7-9hrs</p>
                </div>
              </div>
            )}
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

      {/* ── SEO & AEO TAB ── */}
      {activeTab === 'seo' && (() => {
        const KEYWORDS = [
          // TENANT REP
          { id: 'tr-01', keyword: 'tenant representation Newcastle', division: 'Tenant Rep', vol: 90, diff: 22, priority: 'NOW', intent: 'Commercial', rank: null, page: '/tenant-rep', aeo: true, gap: null },
          { id: 'tr-02', keyword: 'commercial tenant representative NSW', division: 'Tenant Rep', vol: 140, diff: 28, priority: 'NOW', intent: 'Commercial', rank: null, page: '/tenant-rep', aeo: true, gap: null },
          { id: 'tr-03', keyword: 'commercial lease negotiation Newcastle', division: 'Tenant Rep', vol: 110, diff: 25, priority: 'NOW', intent: 'Commercial', rank: null, page: '/tenant-rep', aeo: true, gap: null },
          { id: 'tr-04', keyword: 'what is make good in a commercial lease', division: 'Tenant Rep', vol: 320, diff: 35, priority: 'NOW', intent: 'Info', rank: null, page: '/blog/what-is-make-good', aeo: true, gap: null },
          { id: 'tr-05', keyword: 'commercial lease review Newcastle', division: 'Tenant Rep', vol: 80, diff: 20, priority: 'NOW', intent: 'Transactional', rank: null, page: '/leaseintel', aeo: true, gap: null },
          { id: 'tr-06', keyword: 'how to negotiate a commercial lease Australia', division: 'Tenant Rep', vol: 480, diff: 42, priority: '3-6mo', intent: 'Info', rank: null, page: '/blog/commercial-lease-negotiation-tips-australia', aeo: true, gap: null },
          { id: 'tr-07', keyword: 'tenant rights commercial lease NSW', division: 'Tenant Rep', vol: 390, diff: 38, priority: '3-6mo', intent: 'Info', rank: null, page: '/blog/commercial-tenant-rights-nsw', aeo: true, gap: null },
          { id: 'tr-08', keyword: 'commercial lease expiry 12 months what to do', division: 'Tenant Rep', vol: 110, diff: 18, priority: 'NOW', intent: 'Info', rank: null, page: '/blog/12-months-lease-strategy', aeo: true, gap: null },
          // CLEANING
          { id: 'cl-01', keyword: 'commercial cleaning Newcastle', division: 'Cleaning', vol: 590, diff: 45, priority: 'NOW', intent: 'Commercial', rank: null, page: '/cleaning', aeo: false, gap: null },
          { id: 'cl-02', keyword: 'office cleaning Newcastle', division: 'Cleaning', vol: 320, diff: 38, priority: 'NOW', intent: 'Commercial', rank: null, page: '/cleaning', aeo: false, gap: null },
          { id: 'cl-03', keyword: 'medical cleaning Newcastle', division: 'Cleaning', vol: 90, diff: 22, priority: 'NOW', intent: 'Commercial', rank: null, page: '/cleaning', aeo: true, gap: 'medical-practice-cleaning-standards-newcastle' },
          { id: 'cl-04', keyword: 'commercial cleaning contract Hunter Valley', division: 'Cleaning', vol: 70, diff: 18, priority: 'NOW', intent: 'Transactional', rank: null, page: '/cleaning', aeo: false, gap: null },
          { id: 'cl-05', keyword: 'what does a good commercial cleaning contract include', division: 'Cleaning', vol: 210, diff: 28, priority: '3-6mo', intent: 'Info', rank: null, page: '/blog/what-good-commercial-cleaning-looks-like', aeo: true, gap: null },
          // FURNITURE
          { id: 'fu-01', keyword: 'office fitout Newcastle', division: 'Furniture', vol: 260, diff: 35, priority: 'NOW', intent: 'Commercial', rank: null, page: '/furniture', aeo: false, gap: null },
          { id: 'fu-02', keyword: 'office furniture Newcastle', division: 'Furniture', vol: 480, diff: 42, priority: 'NOW', intent: 'Commercial', rank: null, page: '/furniture', aeo: false, gap: null },
          { id: 'fu-03', keyword: 'how much does an office fitout cost Australia', division: 'Furniture', vol: 720, diff: 48, priority: '3-6mo', intent: 'Info', rank: null, page: '/blog/office-fitout-cost-guide-australia-2026', aeo: true, gap: null },
          { id: 'fu-04', keyword: 'sit stand desk Newcastle', division: 'Furniture', vol: 140, diff: 28, priority: '3-6mo', intent: 'Transactional', rank: null, page: '/furniture', aeo: false, gap: 'ergonomic-office-setup-newcastle-guide' },
          // BUYERS AGENCY
          { id: 'ba-01', keyword: 'commercial buyers agent Newcastle', division: 'Buyers Agency', vol: 110, diff: 22, priority: 'NOW', intent: 'Commercial', rank: null, page: '/buyers-agency', aeo: true, gap: null },
          { id: 'ba-02', keyword: 'how to buy commercial property Australia', division: 'Buyers Agency', vol: 880, diff: 52, priority: '3-6mo', intent: 'Info', rank: null, page: '/blog/how-to-buy-commercial-property-australia', aeo: true, gap: null },
          { id: 'ba-03', keyword: 'buying vs leasing commercial property Newcastle', division: 'Buyers Agency', vol: 90, diff: 20, priority: 'NOW', intent: 'Info', rank: null, page: '/blog/buying-vs-leasing-commercial-newcastle', aeo: true, gap: null },
          // LEASEINTEL
          { id: 'li-01', keyword: 'commercial lease risk checker', division: 'LeaseIntel', vol: 70, diff: 15, priority: 'NOW', intent: 'Transactional', rank: null, page: '/leaseintel', aeo: true, gap: null },
          { id: 'li-02', keyword: 'lease review service Australia', division: 'LeaseIntel', vol: 210, diff: 30, priority: '3-6mo', intent: 'Transactional', rank: null, page: '/leaseintel', aeo: true, gap: null },
        ]

        const DIVISION_COLOURS: Record<string, string> = {
          'Tenant Rep': '#00B5A5',
          'Cleaning': '#6366f1',
          'Furniture': '#f59e0b',
          'Buyers Agency': '#ec4899',
          'LeaseIntel': '#22c55e',
        }

        const totalVol = KEYWORDS.reduce((s, k) => s + k.vol, 0)
        const nowCount = KEYWORDS.filter(k => k.priority === 'NOW').length
        const aeoCount = KEYWORDS.filter(k => k.aeo).length
        const gapCount = KEYWORDS.filter(k => k.gap).length

        const CONTENT_SUGGESTIONS = [
          { title: 'Medical practice cleaning standards Newcastle', slug: 'medical-practice-cleaning-standards-newcastle', division: 'Cleaning', why: 'Targets high-value healthcare contracts. Very low competition. Should rank in 4-6 weeks.', keywords: ['medical cleaning Newcastle', 'clinical cleaning standards NSW'], effort: 'Low' },
          { title: 'Ergonomic office setup guide Newcastle 2026', slug: 'ergonomic-office-setup-newcastle-guide', division: 'Furniture', why: 'Targets sit-stand desk searches and employer OH&S obligations. AEO candidate.', keywords: ['sit stand desk Newcastle', 'ergonomic office furniture'], effort: 'Low' },
          { title: 'Commercial rent review guide — what Newcastle businesses need to know', slug: 'commercial-rent-review-newcastle-guide', division: 'Tenant Rep', why: 'High search intent from businesses approaching renewal. Strong AEO match — AI frequently answers rent review questions.', keywords: ['commercial rent review NSW', 'market rent review commercial lease'], effort: 'Medium' },
          { title: 'Office space per person — how much do you actually need?', slug: 'office-space-per-person-guide', division: 'Tenant Rep', why: 'One of the most-asked questions during office search. Already have a blog stub — expand it.', keywords: ['office space per person Australia', 'how much office space do I need'], effort: 'Low' },
          { title: 'Commercial property due diligence checklist Australia', slug: 'commercial-property-due-diligence-newcastle', division: 'Buyers Agency', why: 'High AEO score — AI assistants regularly serve this. Strong top-of-funnel for buyers agency.', keywords: ['commercial property due diligence', 'buying commercial property checklist'], effort: 'Medium' },
        ]

        return (
          <div>
            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Target keywords', val: KEYWORDS.length, sub: 'tracked' },
                { label: 'Monthly search vol', val: totalVol.toLocaleString(), sub: 'AU combined est.' },
                { label: 'Priority NOW', val: nowCount, sub: 'low difficulty wins' },
                { label: 'AEO targets', val: aeoCount, sub: 'AI answer engine fit' },
              ].map(s => (
                <div key={s.label} style={{ ...SECTION_STYLE, textAlign: 'center', padding: '1rem' }}>
                  <p style={{ color: '#00B5A5', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.2rem', lineHeight: 1 }}>{s.val}</p>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.15rem' }}>{s.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', margin: 0 }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* AEO callout */}
            <div style={{ background: 'rgba(0,181,165,0.06)', border: '1px solid rgba(0,181,165,0.25)', borderLeft: '3px solid #00B5A5', padding: '1rem 1.25rem', marginBottom: '1.5rem', borderRadius: '4px' }}>
              <p style={{ color: '#00B5A5', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.5rem' }}>AEO — Answer Engine Optimisation</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>
                {aeoCount} of our {KEYWORDS.length} keywords are AEO targets — meaning ChatGPT, Perplexity, and Google AI Overviews actively answer these questions. To win AEO: write clear, factual answers in the first paragraph of every blog post. Use FAQ schema (already deployed on Homepage, Tenant Rep, Cleaning, Furniture). Answer the exact question in the H1 or H2. Length 800–1,500 words per post is ideal for AI citation.
              </p>
            </div>

            {/* Keyword table */}
            <div style={SECTION_STYLE}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 1rem' }}>Top 22 Target Keywords</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Keyword', 'Division', 'Vol/mo', 'Difficulty', 'Intent', 'Priority', 'AEO', 'Content Gap'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.58rem', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {KEYWORDS.map((kw, i) => (
                      <tr key={kw.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                        <td style={{ padding: '0.5rem 0.6rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500, minWidth: '220px' }}>{kw.keyword}</td>
                        <td style={{ padding: '0.5rem 0.6rem', whiteSpace: 'nowrap' }}>
                          <span style={{ background: DIVISION_COLOURS[kw.division] + '22', color: DIVISION_COLOURS[kw.division], fontSize: '0.58rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '3px', letterSpacing: '0.08em' }}>{kw.division}</span>
                        </td>
                        <td style={{ padding: '0.5rem 0.6rem', color: 'rgba(255,255,255,0.6)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{kw.vol.toLocaleString()}</td>
                        <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center' }}>
                          <span style={{ color: kw.diff < 30 ? '#22c55e' : kw.diff < 45 ? '#f59e0b' : '#ef4444', fontWeight: 700, fontSize: '0.7rem' }}>{kw.diff}</span>
                        </td>
                        <td style={{ padding: '0.5rem 0.6rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem' }}>{kw.intent}</td>
                        <td style={{ padding: '0.5rem 0.6rem' }}>
                          <span style={{ background: kw.priority === 'NOW' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.1)', color: kw.priority === 'NOW' ? '#22c55e' : '#f59e0b', fontSize: '0.58rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '3px' }}>{kw.priority}</span>
                        </td>
                        <td style={{ padding: '0.5rem 0.6rem', textAlign: 'center', color: kw.aeo ? '#00B5A5' : 'rgba(255,255,255,0.15)', fontSize: '0.8rem' }}>{kw.aeo ? '✓' : '—'}</td>
                        <td style={{ padding: '0.5rem 0.6rem', color: kw.gap ? '#f59e0b' : 'rgba(255,255,255,0.15)', fontSize: '0.65rem' }}>{kw.gap ? '⚠ Create post' : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.6rem', margin: '0.75rem 0 0', lineHeight: 1.5 }}>
                Difficulty: green &lt;30 (easy win), amber 30–45 (achievable 3-6mo), red &gt;45 (long-term). Volume = estimated AU monthly searches. Rank data: connect Google Search Console API to populate live positions.
              </p>
            </div>

            {/* Content suggestions */}
            <div style={{ ...SECTION_STYLE, marginTop: '1.25rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 1rem' }}>Content Gap — Suggested Posts to Create ({gapCount} keyword gaps + 5 high-value additions)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {CONTENT_SUGGESTIONS.map(s => (
                  <div key={s.slug} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${DIVISION_COLOURS[s.division] || '#00B5A5'}`, padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.8rem', margin: '0 0 0.3rem' }}>{s.title}</p>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', margin: '0 0 0.4rem', lineHeight: 1.5 }}>{s.why}</p>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {s.keywords.map(kw => (
                            <span key={kw} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontSize: '0.58rem', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>{kw}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
                        <span style={{ background: DIVISION_COLOURS[s.division] + '22', color: DIVISION_COLOURS[s.division], fontSize: '0.58rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '3px' }}>{s.division}</span>
                        <span style={{ background: s.effort === 'Low' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: s.effort === 'Low' ? '#22c55e' : '#f59e0b', fontSize: '0.58rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '3px' }}>{s.effort} effort</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* White hat strategy notes */}
            <div style={{ ...SECTION_STYLE, marginTop: '1.25rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 1rem' }}>White Hat Strategy — What to Execute</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {[
                  { title: 'Google Business Profile', status: 'ACTION REQUIRED', detail: 'Create and verify GBP for yourofficespace.au. Add Newcastle address, all 4 services, photos. This is the single highest-ROI SEO task not yet done.', colour: '#ef4444' },
                  { title: 'Blog publishing cadence', status: 'IN PROGRESS', detail: 'Daily 6am cron generates 1 blog + 2 LinkedIn. Approve in queue. Target: 2 posts per week published minimum. Each post targets one keyword.', colour: '#22c55e' },
                  { title: 'Internal linking', status: 'MONITORING', detail: 'Blog posts auto-link to service pages via keyword map. Review each approved post to confirm key anchor links are present.', colour: '#f59e0b' },
                  { title: 'Backlink building', status: 'NOT STARTED', detail: 'Target: Hunter Business Chamber, Lake Mac Business, Newcastle Weekly, local industry associations. Each backlink from a .au domain is high value.', colour: '#ef4444' },
                  { title: 'Schema / structured data', status: 'LIVE', detail: 'FAQ schema deployed on Homepage, Tenant Rep, Cleaning, Furniture, LeaseIntel. Service schema on Cleaning + Furniture. Eligible for rich results.', colour: '#22c55e' },
                  { title: 'GSC & sitemap', status: 'LIVE', detail: 'Sitemap submitted. 48 pages discovered. Remove /sitemap_index.xml error. Monitor indexing in GSC Pages report weekly.', colour: '#22c55e' },
                ].map(item => (
                  <div key={item.title} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `3px solid ${item.colour}`, padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.75rem', margin: 0 }}>{item.title}</p>
                      <span style={{ color: item.colour, fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em' }}>{item.status}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', margin: 0, lineHeight: 1.6 }}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

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
