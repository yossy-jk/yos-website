'use client'
import { useEffect, useState, useCallback, JSX } from 'react'

const TEAL = '#00B5A5'
const RED = '#ef4444'
const GREEN = '#22c55e'
const AMBER = '#f59e0b'
const CARD = 'rgba(255,255,255,0.03)'
const BORDER = 'rgba(255,255,255,0.07)'

const ENERGY_LABELS: Record<number, string> = {
  1: 'LOW — delegate everything possible',
  2: 'BELOW AVERAGE — focus on high-value tasks only',
  3: 'AVERAGE — normal day',
  4: 'HIGH — push on big opportunities',
  5: 'PEAK — tackle your hardest challenges',
}

const ENERGY_COLOURS: Record<number, string> = {
  1: '#6b7280', 2: AMBER, 3: TEAL, 4: GREEN, 5: '#ec4899'
}

interface TaskItem {
  id: string
  title: string
  source?: string
  raw_commitment?: string
  client_name?: string
}

interface DashData {
  pipeline?: {
    totalValue?: number
    totalDeals?: number
    deals?: Array<{ isUrgent?: boolean; isOverdue?: boolean }>
  }
  events?: Array<{ start: string; subject: string; location?: string }>
}

interface IntelData {
  cooMem?: string
}

interface TasksData {
  todayTasks?: TaskItem[]
}

export default function TodayTab(): JSX.Element {
  const [energy, setEnergy] = useState<number>(0)
  const [data, setData] = useState<DashData | null>(null)
  const [intel, setIntel] = useState<IntelData | null>(null)
  const [tasks, setTasks] = useState<TasksData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yos-energy-' + new Date().toDateString())
      if (saved) setEnergy(parseInt(saved))
    }
    Promise.all([
      fetch('/api/dashboard-data', {credentials: 'include'}).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/agent-intel', {credentials: 'include'}).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/tasks-data', {credentials: 'include'}).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([d, i, t]: [DashData | null, IntelData | null, TasksData | null]) => {
      setData(d)
      setIntel(i)
      setTasks(t)
      setLoading(false)
    })
  }, [])

  const setEnergyLevel = (n: number): void => {
    setEnergy(n)
    if (typeof window !== 'undefined') {
      localStorage.setItem('yos-energy-' + new Date().toDateString(), String(n))
    }
  }

  const briefLines: string[] = (intel?.cooMem || '')
    .split('\n')
    .filter((l: string) => l.trim() && !l.startsWith('#'))
    .slice(0, 10)

  const todayTasks: TaskItem[] = (tasks?.todayTasks || []).slice(0, 3)
  const weeklyTarget = 6000
  const urgentDeals = (data?.pipeline?.deals || []).filter(d => d.isUrgent || d.isOverdue).length

  if (loading) {
    return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading your command centre...</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

        {/* Energy */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>Energy Today</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {[1,2,3,4,5].map((n: number) => (
              <button key={n} onClick={() => setEnergyLevel(n)}
                style={{ flex: 1, height: 36, border: `1px solid ${energy === n ? ENERGY_COLOURS[n] : BORDER}`, background: energy === n ? ENERGY_COLOURS[n] : 'transparent', borderRadius: 4, cursor: 'pointer', color: energy === n ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.85rem' }}>
                {n}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', margin: 0, fontWeight: 600, color: energy > 0 ? ENERGY_COLOURS[energy] : 'rgba(255,255,255,0.2)' }}>
            {energy > 0 ? ENERGY_LABELS[energy] : 'Set your energy level'}
          </p>
        </div>

        {/* $6k Weekly Tracker */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>Weekly Revenue vs $6k Target</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: RED }}>$0</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>of ${weeklyTarget.toLocaleString()}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, marginBottom: '0.5rem' }}>
            <div style={{ background: TEAL, borderRadius: 4, height: 6, width: '0%' }} />
          </div>
          <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', margin: 0 }}>Finance agent syncs daily</p>
        </div>

        {/* Pipeline */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>Pipeline Snapshot</p>
          {data?.pipeline ? (
            <>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: TEAL, margin: '0 0 0.25rem' }}>
                ${((data.pipeline.totalValue || 0) / 1000).toFixed(0)}k
              </p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.5rem' }}>
                {data.pipeline.totalDeals || 0} open deals
              </p>
              <p style={{ fontSize: '0.65rem', color: urgentDeals > 0 ? AMBER : GREEN, margin: 0 }}>
                {urgentDeals > 0 ? `${urgentDeals} need attention today` : 'All deals on track'}
              </p>
            </>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', margin: 0 }}>Connecting to HubSpot...</p>
          )}
        </div>
      </div>

      {/* COO Brief */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`, borderRadius: 8, padding: '1.25rem' }}>
        <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: TEAL, margin: '0 0 0.75rem' }}>⚡ COO Morning Brief</p>
        {briefLines.length > 0 ? (
          <div style={{ fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
            {briefLines.map((line: string, i: number) => (
              <p key={i} style={{ margin: '0 0 0.3rem' }}>{line}</p>
            ))}
          </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', margin: 0 }}>
            Awaiting COO brief — runs at 5am daily. Send &quot;HEARTBEAT&quot; to the COO bot on Telegram to trigger now.
          </p>
        )}
      </div>

      {/* Top 3 Tasks */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${TEAL}`, borderRadius: 8, padding: '1.25rem' }}>
        <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: TEAL, margin: '0 0 0.75rem' }}>⚡ Win Today — Top 3 Priorities</p>
        {todayTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayTasks.map((t: TaskItem, i: number) => (
              <div key={t.id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '0.875rem', background: 'rgba(0,181,165,0.05)', borderRadius: 6, border: `1px solid rgba(0,181,165,0.12)` }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? TEAL : 'rgba(0,181,165,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, color: 'white', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{t.title}</p>
                  {t.raw_commitment && <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>&quot;{t.raw_commitment.slice(0, 80)}&quot;</p>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                    {t.source && <span style={{ fontSize: '0.58rem', background: 'rgba(0,181,165,0.15)', color: TEAL, padding: '0.1rem 0.4rem', borderRadius: 3, textTransform: 'uppercase', fontWeight: 700 }}>{t.source}</span>}
                    {t.client_name && <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>{t.client_name}</span>}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await fetch('/api/tasks-data', { method: 'POST', credentials: 'include', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ taskId: t.id, action: 'complete' }) })
                    window.location.reload()
                  }}
                  style={{ background: GREEN, border: 'none', borderRadius: 4, padding: '0.35rem 0.875rem', color: 'white', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                  ✓ Done
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', margin: 0 }}>No tasks for today — check the Tasks tab.</p>
        )}
      </div>

      {/* Calendar */}
      {data?.events && data.events.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>📅 Upcoming</p>
          {data.events.slice(0, 4).map((ev: { start: string; subject: string; location?: string }, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ flexShrink: 0, minWidth: 60 }}>
                <p style={{ color: TEAL, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                  {new Date(ev.start.endsWith('Z') ? ev.start : ev.start + 'Z').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Australia/Sydney' })}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', margin: '0.1rem 0 0' }}>
                  {new Date(ev.start.endsWith('Z') ? ev.start : ev.start + 'Z').toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' })}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500 }}>{ev.subject}</p>
                {ev.location && <p style={{ margin: '0.1rem 0 0', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{ev.location}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
