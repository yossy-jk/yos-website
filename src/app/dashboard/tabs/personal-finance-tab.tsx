
'use client'
import { useState, useEffect } from 'react'

type Bill = { name: string; amount: number; due: string; category: string }
type Cat  = { category: string; total: number }
type PFData = {
  cash_available: number; cash_after_30d_bills: number
  bills_next_7d: Bill[]; bills_next_14d_total: number
  bills_next_30d_total: number; bills_next_90d_total: number
  spending_last_30d: number; income_last_30d: number
  surplus_last_30d: number; category_breakdown: Cat[]
  unreviewed_transactions: number; generated: string
} | null

const $ = (n: number) => '$' + Math.abs(n).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
const status = (n: number, good = true) => n > 0 === good ? '#22c55e' : n > -500 ? '#f59e0b' : '#ef4444'

export default function PersonalFinanceTab() {
  const [d, setD] = useState<PFData>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/personal-finance', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (j) setD(j) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const card = (label: string, value: string, color?: string) => (
    <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 10, padding: '16px 20px', flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || '#f9fafb' }}>{value}</div>
    </div>
  )

  if (loading) return <div style={{ color: '#6b7280', padding: 40 }}>Loading financial position…</div>
  if (!d) return (
    <div style={{ color: '#9ca3af', padding: 40, fontFamily: 'sans-serif' }}>
      <h3 style={{ color: '#f9fafb', marginBottom: 12 }}>Personal Finance — Setup Required</h3>
      <p>Drop your bank CSV exports into <code style={{ color: '#60a5fa' }}>~/.openclaw/workspace-personal-finance/inbox/</code> then run:</p>
      <pre style={{ background: '#111827', padding: 16, borderRadius: 8, marginTop: 8, fontSize: 12 }}>
        python3 ~/.openclaw/tools/pf_csv_ingester.py{'\n'}
        python3 ~/.openclaw/tools/pf_bills_cashflow.py
      </pre>
      <p style={{ marginTop: 12 }}>Add your account balances and upcoming bills in the setup below.</p>
    </div>
  )

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '4px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 16, color: '#f9fafb' }}>Personal Finance — Joe & Sarah</h2>
        <span style={{ fontSize: 11, color: '#4b5563' }}>Updated {d.generated}</span>
      </div>

      {/* Cash position */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        {card('Cash Available', $(d.cash_available))}
        {card('After 30d Bills', $(d.cash_after_30d_bills), status(d.cash_after_30d_bills))}
        {card('30d Income', $(d.income_last_30d), '#22c55e')}
        {card('30d Spending', $(d.spending_last_30d), '#f9fafb')}
        {card('30d Surplus', $(d.surplus_last_30d), status(d.surplus_last_30d))}
      </div>

      {/* Bills next 7 days */}
      {d.bills_next_7d.length > 0 && (
        <div style={{ background: '#111827', border: '1px solid #7f1d1d', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#fca5a5' }}>⚠ Due This Week</h3>
          {d.bills_next_7d.map((b, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: i ? '1px solid #1f2937' : 'none', fontSize: 13 }}>
              <div>
                <span style={{ color: '#f9fafb' }}>{b.name}</span>
                <span style={{ fontSize: 11, color: '#6b7280', marginLeft: 8 }}>{b.category}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#f9fafb', fontWeight: 600 }}>{$(b.amount)}</span>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{b.due}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bill horizons */}
      <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#f9fafb' }}>Upcoming Bills</h3>
        {[['Next 7 days', d.bills_next_14d_total],['Next 30 days', d.bills_next_30d_total],['Next 90 days', d.bills_next_90d_total]].map(([label,amt]) => (
          <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderTop: '1px solid #1f2937', fontSize: 13 }}>
            <span style={{ color: '#9ca3af' }}>{label as string}</span>
            <span style={{ color: '#f9fafb', fontWeight: 600 }}>{$(amt as number)}</span>
          </div>
        ))}
      </div>

      {/* Spending by category */}
      {d.category_breakdown.length > 0 && (
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#f9fafb' }}>Spending — Last 30 Days</h3>
          {d.category_breakdown.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: i ? '1px solid #1f2937' : 'none', fontSize: 13 }}>
              <span style={{ color: '#9ca3af' }}>{c.category}</span>
              <span style={{ color: '#f9fafb' }}>{$(c.total)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Setup prompt */}
      {d.unreviewed_transactions > 0 && (
        <div style={{ background: '#1c1917', border: '1px solid #78350f', borderRadius: 10, padding: 16, fontSize: 13, color: '#fcd34d' }}>
          {d.unreviewed_transactions} transactions need categorisation — run <code>pf_csv_ingester.py</code> review queue for accuracy.
        </div>
      )}
    </div>
  )
}
