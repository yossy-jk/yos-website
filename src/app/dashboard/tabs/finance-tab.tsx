'use client'
import { useEffect, useState, useCallback } from 'react'

const C = { teal: '#00B5A5', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)' }

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>{children}</p>
}

function fmt(n: number) {
  if (n >= 1000) return `$${(n/1000).toFixed(1)}k`
  return `$${n.toLocaleString()}`
}

export default function FinanceTab() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const requestData = useCallback(() =>
    fetch('/api/dashboard-data', {credentials: 'include'}).then(r => r.ok ? r.json() : null), [])

  const load = useCallback(() => {
    setRefreshing(true)
    requestData().then(d => { setData(d); setLoading(false) }).catch(() => { setLoading(false) }).finally(() => setRefreshing(false))
  }, [requestData])

  useEffect(() => {
    let cancelled = false
    requestData()
      .then(d => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [requestData])

  const cashflow = (data as Record<string,unknown>)?.cashflow as Record<string,number>|null
  const xero = (data as Record<string,unknown>)?.xero as Record<string,unknown>|null

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading finance data...</div>

  const weeklyTarget = 6000

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <UpcomingBills />

      {/* Key numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Outstanding', val: fmt(xero?.outstanding as number || 0), color: C.teal, sub: `${xero?.outstandingCount || 0} invoices` },
          { label: 'Overdue', val: fmt(xero?.overdue as number || 0), color: (xero?.overdue as number || 0) > 0 ? C.red : C.green, sub: `${xero?.overdueCount || 0} invoices` },
          { label: 'Weekly Target', val: fmt(weeklyTarget), color: C.amber, sub: '$312k/year run rate' },
          { label: 'To $1M Goal', val: '$1M', color: 'rgba(255,255,255,0.4)', sub: 'FY2026 target' },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0.25rem 0 0.1rem' }}>{s.label}</p>
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* 30/60-day cashflow projection */}
      {cashflow && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Label>30 / 60-Day Cashflow Projection</Label>
            <button
              onClick={load}
              disabled={refreshing}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', padding: '0.3rem 0.75rem', cursor: refreshing ? 'default' : 'pointer', borderRadius: 4, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span style={{ display: 'inline-block', width: 10, height: 10 }}>{refreshing ? '↻' : '↺'}</span>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* 30-day bucket */}
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>Next 30 Days</p>
              {[
                { label: 'Incoming', val: cashflow.incoming30Days, color: C.green },
                { label: 'Outgoing', val: cashflow.outgoing30Days, color: C.red },
                { label: 'Net', val: cashflow.incoming30Days - cashflow.outgoing30Days, color: C.teal },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: row.color }}>{fmt(row.val)}</span>
                </div>
              ))}
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 10, marginTop: '0.75rem' }}>
                <div style={{ background: C.green, borderRadius: 4, height: 10, width: `${Math.min(100, (cashflow.incoming30Days / (cashflow.outgoing30Days || 1)) * 50)}%` }} />
              </div>
            </div>
            {/* 60-day bucket */}
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>Next 60 Days</p>
              {[
                { label: 'Incoming', val: cashflow.incoming60Days, color: C.green },
                { label: 'Outgoing', val: cashflow.outgoing60Days, color: C.red },
                { label: 'Net', val: cashflow.incoming60Days - cashflow.outgoing60Days, color: C.teal },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: row.color }}>{fmt(row.val)}</span>
                </div>
              ))}
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 10, marginTop: '0.75rem' }}>
                <div style={{ background: C.green, borderRadius: 4, height: 10, width: `${Math.min(100, (cashflow.incoming60Days / (cashflow.outgoing60Days || 1)) * 50)}%` }} />
              </div>
            </div>
          </div>
          {cashflow.projectedLow < 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6 }}>
              <p style={{ fontSize: '0.7rem', color: C.red, margin: 0 }}>
                Cash trough of {fmt(cashflow.projectedLow)} projected around {cashflow.projectedLowDate} — consider accelerating collections.
              </p>
            </div>
          )}
        </div>
      )}

      {/* $6k weekly tracker */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
        <Label>Weekly Revenue vs $6,000 Target</Label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 900, color: C.teal }}>$0</span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>of $6,000 this week</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 8 }}>
          <div style={{ background: C.teal, borderRadius: 4, height: 8, width: '0%' }} />
        </div>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', margin: '0.5rem 0 0' }}>
          Finance agent syncs Xero daily — bank feed data will appear here when connected
        </p>
      </div>

      {!data && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', margin: 0 }}>Finance data loading — Finance agent runs at 7am and 5pm daily</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', margin: '0.5rem 0 0' }}>Ensure Xero is connected via Maton credentials</p>
        </div>
      )}
    </div>
  )
}

function UpcomingBills() {
  const [bd, setBd] = useState<{ bills: {payee:string;amount:number;due:string;source:string;status:string}[]; totals: {next7:number;next7Count:number;next30:number;next30Count:number} } | null>(null)
  useEffect(() => {
    fetch('/api/bills-upcoming', { cache: 'no-store' })
      .then(async r => { if (!r.ok) throw new Error(String(r.status)); const j = await r.json(); if (j && j.bills) setBd(j) })
      .catch(() => {})
  }, [])
  if (!bd) return null
  const tag = (s: string) => s === 'bill' ? 'Bill' : s === 'scheduled' ? 'Scheduled' : 'Direct debit'
  const tagColor = (s: string) => s === 'bill' ? '#f59e0b' : s === 'scheduled' ? '#3b82f6' : '#8b5cf6'
  return (
    <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: 15, color: '#f9fafb' }}>Upcoming Bills / Direct Debits</h3>
        <div style={{ fontSize: 12, color: '#9ca3af' }}>
          next 7d: <b style={{ color: '#f9fafb' }}>{`$${bd.totals.next7.toLocaleString()}`}</b> ({bd.totals.next7Count}) - 30d: <b style={{ color: '#f9fafb' }}>{`$${bd.totals.next30.toLocaleString()}`}</b> ({bd.totals.next30Count})
        </div>
      </div>
      {bd.bills.slice(0, 25).map((b, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderTop: i ? '1px solid #1f2937' : 'none', fontSize: 13 }}>
          <div style={{ minWidth: 0 }}>
            <span style={{ color: '#f9fafb' }}>{b.payee}</span>
            <span style={{ marginLeft: 8, fontSize: 10, padding: '1px 6px', borderRadius: 4, background: `${tagColor(b.source)}22`, color: tagColor(b.source) }}>{tag(b.source)}</span>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{b.status}</div>
          </div>
          <div style={{ textAlign: 'right', whiteSpace: 'nowrap', marginLeft: 12 }}>
            <div style={{ color: '#f9fafb' }}>{`$${b.amount.toLocaleString()}`}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>{b.due || 'date tbc'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
