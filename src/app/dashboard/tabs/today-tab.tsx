'use client'
import { useEffect, useState } from 'react'

const C = {
  teal: '#00B5A5',
  red: '#ef4444',
  green: '#22c55e',
  amber: '#f59e0b',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.07)',
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem', ...style }}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>{children}</p>
}

export default function TodayTab() {
  const [energy, setEnergy] = useState(0)
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [intel, setIntel] = useState<Record<string, unknown> | null>(null)
  const [tasks, setTasks] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yos-energy-' + new Date().toDateString())
      if (saved) setEnergy(parseInt(saved))
    }

    Promise.all([
      fetch('/api/dashboard-data').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/agent-intel').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/tasks-data').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([d, i, t]) => {
      setData(d)
      setIntel(i)
      setTasks(t)
      setLoading(false)
    })
  }, [])

  const setEnergyLevel = (n: number) => {
    setEnergy(n)
    if (typeof window !== 'undefined') {
      localStorage.setItem('yos-energy-' + new Date().toDateString(), String(n))
    }
  }

  const ENERGY_LABELS: Record<number, string> = {
    1: '😴 Low — delegate everything possible',
    2: '😐 Below average — focus on high-value tasks only',
    3: '🙂 Average — normal day',
    4: '💪 High — push on big opportunities',
    5: '🔥 Peak — tackle your hardest challenges',
  }

  const ENERGY_COLOURS: Record<number, string> = {
    1: '#6b7280', 2: '#f59e0b', 3: '#00B5A5', 4: '#22c55e', 5: '#ec4899'
  }

  // $6k weekly tracker
  const weeklyTarget = 6000
  const weeklyActual = 0 // TODO: pull from finance API
  const weeklyPct = Math.min(100, (weeklyActual / weeklyTarget) * 100)

  // Extract COO brief from memory
  const cooMem = (intel as Record<string, unknown> | null)?.cooMem as string || ''
  const briefLines = cooMem.split('\n').filter((l: string) => l.trim() && !l.startsWith('#')).slice(0, 15)

  // Top 3 tasks
  const todayTasks = ((tasks as Record<string, unknown> | null)?.todayTasks as Record<string, unknown>[] || []).slice(0, 3)

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading your command centre...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Top row — energy + $6k tracker */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

        {/* Energy */}
        <Card>
          <Label>Energy Today</Label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setEnergyLevel(n)}
                style={{ flex: 1, height: 36, border: `1px solid ${energy === n ? ENERGY_COLOURS[n] : C.border}`, background: energy === n ? ENERGY_COLOURS[n] : 'transparent', borderRadius: 4, cursor: 'pointer', color: energy === n ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.15s' }}>
                {n}
              </button>
            ))}
          </div>
          {energy > 0
            ? <p style={{ color: ENERGY_COLOURS[energy], fontSize: '0.72rem', margin: 0, fontWeight: 600 }}>{ENERGY_LABELS[energy]}</p>
            : <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', margin: 0 }}>Set your energy level</p>
          }
        </Card>

        {/* $6k Weekly Tracker */}
        <Card>
          <Label>Weekly Revenue vs $6k Target</Label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: weeklyPct >= 100 ? C.green : weeklyPct >= 60 ? C.amber : C.red }}>
              ${weeklyActual.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>of $6,000</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, marginBottom: '0.5rem' }}>
            <div style={{ background: weeklyPct >= 100 ? C.green : C.teal, borderRadius: 4, height: 6, width: `${weeklyPct}%`, transition: 'width 0.5s' }} />
          </div>
          <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            ${(weeklyTarget - weeklyActual).toLocaleString()} remaining this week
          </p>
        </Card>

        {/* Pipeline snapshot */}
        <Card>
          <Label>Pipeline Snapshot</Label>
          {(data as Record<string, unknown> | null)?.pipeline ? (
            <>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: C.teal, margin: '0 0 0.25rem' }}>
                ${(((data as Record<string, unknown>).pipeline as Record<string, unknown>)?.totalValue as number || 0).toLocaleString()}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.5rem' }}>
                {(((data as Record<string, unknown>).pipeline as Record<string, unknown>)?.totalDeals as number || 0)} open deals
              </p>
              <p style={{ fontSize: '0.65rem', color: C.amber, margin: 0 }}>
                {(((data as Record<string, unknown>).pipeline as Record<string, unknown>)?.deals as Record<string, unknown>[] || []).filter((d: Record<string, unknown>) => d.isUrgent || d.isOverdue).length} need attention today
              </p>
            </>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>Connecting to HubSpot...</p>
          )}
        </Card>
      </div>

      {/* COO Morning Brief */}
      <Card style={{ borderLeft: `3px solid ${C.teal}` }}>
        <Label>⚡ COO Morning Brief</Label>
        {briefLines.length > 0 ? (
          <div style={{ fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
            {briefLines.slice(0, 10).map((line: string, i: number) => (
              <p key={i} style={{ margin: '0 0 0.3rem' }}>{line}</p>
            ))}
          </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', margin: 0 }}>
            Awaiting COO brief — runs at 5am daily. Send &quot;HEARTBEAT&quot; to the COO bot on Telegram to trigger now.
          </p>
        )}
      </Card>

      {/* Top 3 Tasks */}
      <Card>
        <Label>⚡ Win Today — Top 3 Priorities</Label>
        {todayTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {todayTasks.map((t: Record<string, unknown>, i: number) => (
              <div key={t.id as string} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start', padding: '0.875rem', background: 'rgba(0,181,165,0.05)', borderRadius: 6, border: `1px solid rgba(0,181,165,0.12)` }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? C.teal : 'rgba(0,181,165,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, color: 'white', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{t.title as string}</p>
                  {t.raw_commitment && <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>&quot;{(t.raw_commitment as string).slice(0, 80)}&quot;</p>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                    {t.source && <span style={{ fontSize: '0.58rem', background: 'rgba(0,181,165,0.15)', color: C.teal, padding: '0.1rem 0.4rem', borderRadius: 3, textTransform: 'uppercase', fontWeight: 700 }}>{t.source as string}</span>}
                    {(t as Record<string, unknown>).client_name && <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>{(t as Record<string, unknown>).client_name as string}</span>}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await fetch('/api/tasks-data', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ taskId: t.id, action: 'complete' }) })
                    window.location.reload()
                  }}
                  style={{ background: C.green, border: 'none', borderRadius: 4, padding: '0.35rem 0.875rem', color: 'white', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                  ✓ Done
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', margin: 0 }}>No tasks scheduled for today — check the Tasks tab.</p>
        )}
      </Card>

      {/* Calendar */}
      {(data as Record<string, unknown> | null)?.events && ((data as Record<string, unknown>).events as Record<string, unknown>[]).length > 0 && (
        <Card>
          <Label>📅 Upcoming</Label>
          {((data as Record<string, unknown>).events as Record<string, unknown>[]).slice(0, 4).map((ev: Record<string, unknown>, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ flexShrink: 0, minWidth: 60 }}>
                <p style={{ color: C.teal, fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                  {new Date(ev.start as string).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Australia/Sydney' })}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', margin: '0.1rem 0 0' }}>
                  {new Date(ev.start as string).toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney' })}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 500 }}>{ev.subject as string}</p>
                {ev.location && <p style={{ margin: '0.1rem 0 0', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{ev.location as string}</p>}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
