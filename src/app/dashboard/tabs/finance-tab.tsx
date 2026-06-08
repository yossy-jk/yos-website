'use client'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    fetch('//api/finance-dashboard', {credentials: 'include'}).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading finance data...</div>

  const xero = (data as Record<string, unknown> | null)?.xero as Record<string, unknown> | null
  const weeklyTarget = 6000

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

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
