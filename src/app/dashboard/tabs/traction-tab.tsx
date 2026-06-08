'use client'
import { useEffect, useState } from 'react'

const C = { teal: '#00B5A5', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)' }

export default function TractionTab() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/eos/data, {credentials: 'include'}).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading traction data...</div>

  const rocks = (data?.rocks as Record<string, unknown>[]) || []
  const kpis = (data?.kpis as Record<string, unknown>[]) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Rocks */}
      {rocks.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>🪨 Quarterly Rocks</p>
          {rocks.map((rock: Record<string, unknown>, i: number) => {
            const status = rock.status as string
            const colour = status === 'done' ? C.green : status === 'on-track' ? C.teal : status === 'off-track' ? C.red : 'rgba(255,255,255,0.3)'
            return (
              <div key={i} style={{ display: 'flex', gap: '0.875rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 6, marginBottom: '0.4rem' }}>
                <span style={{ color: colour, fontSize: '0.8rem', flexShrink: 0 }}>{status === 'done' ? '✅' : status === 'on-track' ? '🟢' : status === 'off-track' ? '🔴' : '⚪'}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.8rem' }}>{String(rock.title ?? '')}</p>
                  {rock.owner ? <p style={{ margin: '0.1rem 0 0', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>{String(rock.owner)}</p> : null}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* KPIs */}
      {kpis.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>📊 KPIs</p>
          {kpis.map((kpi: Record<string, unknown>, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: `1px solid ${C.border}` }}>
              <p style={{ margin: 0, fontSize: '0.78rem' }}>{String(kpi.label ?? '')}</p>
              <div style={{ textAlign: 'right' }}>
<span style={{ fontWeight: 700, color: C.teal, fontSize: '0.85rem' }}>{String(kpi.actual ?? '')}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}> / {String(kpi.goal ?? '')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!data && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', margin: 0 }}>EOS data not configured — ask the innovation agent to set up your rocks and KPIs</p>
        </div>
      )}
    </div>
  )
}
