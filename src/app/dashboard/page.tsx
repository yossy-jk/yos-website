'use client'
import { useEffect, useState, useCallback } from 'react'

const TOKEN = 'yos-joe-2026'

type Priority = { label: string; detail: string; type: 'critical' | 'action' | 'info' }
type Deal = {
  id: string; name: string; stage: string; amount: number;
  closeDate: string | null; daysToClose: number | null;
  daysSinceMod: number; isStale: boolean; isOverdue: boolean; isUrgent: boolean;
}
type CalEvent = { subject: string; start: string; end: string; location: string }
type XeroData = { outstanding: number; overdue: number; overdueCount: number; outstandingCount: number }
type DashboardData = {
  generatedAt: string
  priorities: Priority[]
  pipeline: { totalDeals: number; totalValue: number; staleDeals: number; deals: Deal[] }
  proposalDeals: Deal[]
  events: CalEvent[]
  xero: XeroData
}

function fmt(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`
  return `$${n.toLocaleString()}`
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

function fmtTime(iso: string) {
  if (!iso) return ''
  // Convert UTC to AEST (+10)
  const d = new Date(iso)
  return d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' })
}

function fmtEventDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const eventDay = new Date(d.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' }))
  const todayDay = new Date(today.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' }))
  const tomorrowDay = new Date(tomorrow.toLocaleDateString('en-AU', { timeZone: 'Australia/Sydney' }))
  if (eventDay.toDateString() === todayDay.toDateString()) return 'Today'
  if (eventDay.toDateString() === tomorrowDay.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Australia/Sydney' })
}

function aestNow() {
  return new Date().toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

const PRIORITY_COLOURS = {
  critical: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', dot: '#ef4444', label: 'rgb(239,68,68)' },
  action: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', dot: '#f59e0b', label: 'rgb(245,158,11)' },
  info: { bg: 'rgba(0,181,165,0.08)', border: 'rgba(0,181,165,0.3)', dot: '#00B5A5', label: 'rgb(0,181,165)' },
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [energy, setEnergy] = useState<number | null>(null)
  const [now, setNow] = useState(aestNow())

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/dashboard-data?token=${TOKEN}`)
      if (!res.ok) throw new Error('Failed to load')
      setData(await res.json())
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(() => setNow(aestNow()), 60000)
    return () => clearInterval(t)
  }, [load])

  // Load saved energy
  useEffect(() => {
    const saved = localStorage.getItem('yos-energy-' + new Date().toDateString())
    if (saved) setEnergy(parseInt(saved))
  }, [])

  const setEnergyLevel = (n: number) => {
    setEnergy(n)
    localStorage.setItem('yos-energy-' + new Date().toDateString(), String(n))
  }

  const ENERGY_LABELS = ['', 'Running on fumes', 'Below average', 'Solid', 'High energy', 'At my best']
  const ENERGY_COLOURS = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#00B5A5']

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: 'clamp(1.5rem, 4vw, 3rem)' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ color: '#00B5A5', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 0.4rem' }}>Your Office Space</p>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Good morning, Joe.</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', margin: '0.4rem 0 0', fontWeight: 300 }}>{now}</p>
        </div>
        <button onClick={load} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
          Refresh
        </button>
      </div>

      {loading && !data && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Loading your data...</div>
      )}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '1rem 1.5rem', marginBottom: '2rem', color: '#ef4444', fontSize: '0.8rem' }}>
          Could not load data — {error}
        </div>
      )}

      {data && (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

          {/* ── TODAY'S PRIORITIES ── */}
          <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.75rem' }}>
            <p style={{ color: '#00B5A5', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 1.25rem' }}>Today&apos;s Priorities</p>
            {data.priorities.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Nothing critical. Good day to focus on growth.</p>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                {data.priorities.map((p, i) => {
                  const c = PRIORITY_COLOURS[p.type]
                  return (
                    <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.dot, flexShrink: 0, marginTop: '0.35rem' }} />
                        <div>
                          <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.3rem', lineHeight: 1.4 }}>{p.label}</p>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: 0, lineHeight: 1.5 }}>{p.detail}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── ENERGY CHECK-IN ── */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.75rem' }}>
            <p style={{ color: '#00B5A5', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 1.25rem' }}>Energy Today</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setEnergyLevel(n)}
                  style={{
                    flex: 1, padding: '0.75rem 0', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
                    background: energy === n ? ENERGY_COLOURS[n] : 'rgba(255,255,255,0.06)',
                    border: energy === n ? `1px solid ${ENERGY_COLOURS[n]}` : '1px solid rgba(255,255,255,0.1)',
                    color: energy === n ? 'white' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.15s',
                  }}>
                  {n}
                </button>
              ))}
            </div>
            {energy && (
              <p style={{ color: ENERGY_COLOURS[energy], fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>
                {ENERGY_LABELS[energy]}
              </p>
            )}
            {!energy && (
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', margin: 0 }}>Tap 1–5 to set your energy level</p>
            )}
          </div>

          {/* ── CALENDAR ── */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.75rem' }}>
            <p style={{ color: '#00B5A5', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 1.25rem' }}>Next 7 Days</p>
            {data.events.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>No events found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {data.events.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid #00B5A5' }}>
                    <div style={{ flexShrink: 0, minWidth: '60px' }}>
                      <p style={{ color: '#00B5A5', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{fmtEventDate(ev.start)}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', margin: '0.1rem 0 0' }}>{fmtTime(ev.start)}</p>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{ev.subject}</p>
                      {ev.location && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', margin: '0.2rem 0 0' }}>{ev.location}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── CASH / AR ── */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.75rem' }}>
            <p style={{ color: '#00B5A5', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 1.25rem' }}>Money</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.3rem' }}>AR Outstanding</p>
                <p style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 900, margin: 0, color: data.xero.outstanding > 0 ? 'white' : 'rgba(255,255,255,0.4)' }}>
                  {fmt(data.xero.outstanding)}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', margin: '0.3rem 0 0' }}>{data.xero.outstandingCount} invoice{data.xero.outstandingCount !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.3rem' }}>Overdue Now</p>
                <p style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 900, margin: 0, color: data.xero.overdue > 0 ? '#ef4444' : '#22c55e' }}>
                  {fmt(data.xero.overdue)}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', margin: '0.3rem 0 0' }}>{data.xero.overdueCount} overdue</p>
              </div>
            </div>
          </div>

          {/* ── PIPELINE ── */}
          <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <p style={{ color: '#00B5A5', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Pipeline</p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}><strong style={{ color: 'white' }}>{data.pipeline.totalDeals}</strong> open deals</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}><strong style={{ color: '#00B5A5' }}>{fmt(data.pipeline.totalValue)}</strong> total value</span>
                {data.pipeline.staleDeals > 0 && <span style={{ color: '#f59e0b', fontSize: '0.7rem' }}><strong>{data.pipeline.staleDeals}</strong> stale</span>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {data.pipeline.deals.map(deal => (
                <div key={deal.id} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.7rem 0.875rem',
                  background: deal.isOverdue ? 'rgba(239,68,68,0.05)' : deal.isUrgent ? 'rgba(245,158,11,0.05)' : deal.isStale ? 'rgba(255,255,255,0.03)' : 'transparent',
                  borderLeft: `2px solid ${deal.isOverdue ? '#ef4444' : deal.isUrgent ? '#f59e0b' : deal.isStale ? 'rgba(255,255,255,0.15)' : 'transparent'}`,
                  flexWrap: 'wrap',
                }}>
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{deal.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', margin: '0.1rem 0 0' }}>{deal.stage}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexShrink: 0 }}>
                    {deal.amount > 0 && <span style={{ color: '#00B5A5', fontSize: '0.8rem', fontWeight: 700 }}>{fmt(deal.amount)}</span>}
                    {deal.closeDate && (
                      <span style={{ color: deal.isOverdue ? '#ef4444' : deal.isUrgent ? '#f59e0b' : 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
                        {deal.isOverdue ? `Overdue ${Math.abs(deal.daysToClose!)}d` : deal.daysToClose === 0 ? 'Due today' : `${fmtDate(deal.closeDate)}`}
                      </span>
                    )}
                    {deal.isStale && !deal.isOverdue && !deal.isUrgent && (
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem' }}>{deal.daysSinceMod}d quiet</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.6rem', margin: 0 }}>
          YOS Operations Dashboard · yourofficespace.au
        </p>
        {data && (
          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.6rem', margin: 0 }}>
            Last updated {new Date(data.generatedAt).toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour: 'numeric', minute: '2-digit', hour12: true })} AEST
          </p>
        )}
      </div>
    </div>
  )
}
