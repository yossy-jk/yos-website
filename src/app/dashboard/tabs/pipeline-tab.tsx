'use client'
import { useEffect, useState, useCallback } from 'react'

const C = { teal: '#00B5A5', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)' }

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>{children}</p>
}

type Deal = { id: string; name: string; stage: string; amount: number; closeDate: string | null; daysToClose: number | null; isOverdue: boolean; isUrgent: boolean; isStale: boolean; daysSinceTouch: number; isQuoteQuiet: boolean }

export default function PipelineTab() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(() => {
    setRefreshing(true)
    fetch('/api/dashboard-data', {credentials: 'include'}).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false); setRefreshing(false) }).catch(() => { setLoading(false); setRefreshing(false) })
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading pipeline...</div>

  const pipeline = (data as Record<string, unknown> | null)?.pipeline as Record<string, unknown> | null
  const deals: Deal[] = (pipeline?.deals as Deal[]) || []
  const stageVelocity = (data as Record<string,unknown>)?.stageVelocity as Record<string,unknown>[] | null

  const urgent = deals.filter(d => d.isOverdue || d.isUrgent || d.isQuoteQuiet)
  const healthy = deals.filter(d => !d.isOverdue && !d.isUrgent && !d.isQuoteQuiet && !d.isStale)
  const stale = deals.filter(d => d.isStale && !d.isOverdue && !d.isUrgent)

  const DealRow = ({ deal }: { deal: Deal }) => {
    const colour = deal.isOverdue || deal.isQuoteQuiet ? C.red : deal.isUrgent ? C.amber : C.teal
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: deal.isOverdue ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)', borderRadius: 6, marginBottom: '0.4rem', borderLeft: `2px solid ${colour}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.name}</p>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>{deal.stage}</p>
        </div>
        {deal.amount > 0 && <span style={{ color: C.teal, fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>${deal.amount >= 1000 ? `${(deal.amount/1000).toFixed(0)}k` : deal.amount}</span>}
        {deal.closeDate && (
          <span style={{ fontSize: '0.62rem', color: deal.isOverdue ? C.red : deal.isUrgent ? C.amber : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
            {deal.isOverdue ? `${Math.abs(deal.daysToClose || 0)}d overdue` : deal.daysToClose === 0 ? 'Due today' : new Date(deal.closeDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
          </span>
        )}
        {deal.isQuoteQuiet && <span style={{ fontSize: '0.58rem', background: 'rgba(239,68,68,0.15)', color: C.red, padding: '0.1rem 0.4rem', borderRadius: 3, fontWeight: 700 }}>TOUCH NOW</span>}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Total Pipeline', val: `$${((pipeline?.totalValue as number || 0)/1000).toFixed(0)}k`, color: C.teal },
          { label: 'Open Deals', val: String(deals.length), color: 'white' },
          { label: 'Need Action', val: String(urgent.length), color: urgent.length > 0 ? C.red : C.green },
          { label: 'Stale Deals', val: String(stale.length), color: stale.length > 0 ? C.amber : C.green },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0.3rem 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Urgent */}
      {urgent.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <Label>🚨 Need Action Now ({urgent.length})</Label>
          {urgent.map(d => <DealRow key={d.id} deal={d} />)}
        </div>
      )}

      {/* Stage velocity chart */}
      {stageVelocity && stageVelocity.some((s: Record<string,unknown>) => (s.avgDaysInStage as number | null) !== null) && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Label>Deal Velocity — Avg Days in Stage vs Benchmark</Label>
            <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>teal = actual · grey = benchmark</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {stageVelocity.filter((s: Record<string,unknown>) => (s.dealCount as number) > 0).map((s: Record<string,unknown>) => {
              const avg = s.avgDaysInStage as number | null
              const bench = s.benchmarkDays as number
              const count = s.dealCount as number
              const maxVal = Math.max(avg ?? bench, bench) * 1.2
              const actualPct = avg !== null ? (avg / maxVal) * 100 : 0
              const benchPct  = (bench / maxVal) * 100
              const over = avg !== null && avg > bench
              return (
                <div key={s.stageId as string}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{String(s.stage).split(' / ')[0]}</span>
                    <span style={{ fontSize: '0.65rem', color: over ? C.red : C.teal }}>
                      {avg !== null ? `${avg}d` : '—'} actual · {bench}d benchmark · {count} deal{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 8, position: 'relative' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 3, height: 8, width: `${benchPct}%`, position: 'absolute', top: 0, left: 0 }} />
                    {avg !== null && <div style={{ background: over ? C.red : C.teal, borderRadius: 3, height: 8, width: `${actualPct}%`, position: 'absolute', top: 0, left: 0, opacity: 0.85 }} />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All deals */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <Label>All Deals ({deals.length})</Label>
          <button
            onClick={load}
            disabled={refreshing}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', padding: '0.3rem 0.75rem', cursor: refreshing ? 'default' : 'pointer', borderRadius: 4, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span style={{ display: 'inline-block', width: 10, height: 10 }}>{refreshing ? '↻' : '↺'}</span>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {deals.length > 0 ? deals.map(d => <DealRow key={d.id} deal={d} />) : (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', margin: 0 }}>No deals found — HubSpot may be loading.</p>
        )}
      </div>
    </div>
  )
}
