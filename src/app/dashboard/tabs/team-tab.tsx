'use client'
import { useEffect, useState } from 'react'

const C = { teal: '#00B5A5', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)' }

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>{children}</p>
}

type AgentActivity = { agent: string; status: 'active' | 'stale' | 'dead' | 'no-memory'; hoursAgo: number; snippet: string }

const AGENT_ROLES: Record<string, string> = {
  'chief-of-staff': 'COO / EA', 'sarah': 'Co-Director Assistant', 'inbox-ea': 'Email & Calendar',
  'hubspot-revops': 'CRM & Pipeline', 'finance': 'Finance & Xero', 'brand-marketing': 'Content & SEO',
  'innovation': 'R&D & Audit', 'tenant-rep': 'Tenant Rep BDM', 'cleaning-bdm': 'Cleaning Sales',
  'furniture-bdm': 'Furniture Sales', 'furniture-tender': 'Tender & BOQ', 'lease-intel': 'Lease Analysis',
  'risk': 'Risk & Security', 'it-systems': 'Infrastructure', 'financial-planner': 'Forecasting',
  'cleaning-manager': 'Cleaning Ops', 'furniture-website': 'Website Sales', 'health-wellness': 'Health',
  'tenant-rep-bdm': 'TR Lead Gen',
}

export default function TeamTab() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/agent-intel, {credentials: 'include'}).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading team status...</div>

  const agents: AgentActivity[] = (data?.agentActivity as AgentActivity[]) || []
  const active = agents.filter(a => a.status === 'active')
  const stale = agents.filter(a => a.status === 'stale')
  const dead = agents.filter(a => a.status === 'dead' || a.status === 'no-memory')

  const intel = (data?.intel as string) || ''
  const intelLines = intel.split('\n').filter(l => l.trim() && l.includes('[') && l.includes(']')).slice(-20)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Team health stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Active Today', val: String(active.length), color: C.green, sub: 'ran in last 24h' },
          { label: 'Stale', val: String(stale.length), color: C.amber, sub: '1-3 days inactive' },
          { label: 'Need Attention', val: String(dead.length), color: dead.length > 0 ? C.red : C.green, sub: 'not running' },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '0.3rem 0 0.1rem' }}>{s.label}</p>
            <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Agent grid */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
        <Label>Agent Team — 19 Agents</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem' }}>
          {agents.map((a: AgentActivity) => {
            const colour = a.status === 'active' ? C.green : a.status === 'stale' ? C.amber : C.red
            const dot = a.status === 'active' ? '●' : a.status === 'stale' ? '◑' : '○'
            return (
              <div key={a.agent} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: `1px solid ${C.border}` }}>
                <span style={{ color: colour, fontSize: '0.8rem', flexShrink: 0, marginTop: 2 }}>{dot}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.75rem', textTransform: 'capitalize' }}>{a.agent.replace(/-/g, ' ')}</p>
                  <p style={{ margin: '0.1rem 0 0', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{AGENT_ROLES[a.agent] || 'Agent'}</p>
                  {a.hoursAgo && <p style={{ margin: '0.1rem 0 0', fontSize: '0.58rem', color: colour === C.red ? colour : 'rgba(255,255,255,0.2)' }}>{a.hoursAgo < 1 ? 'Just now' : `${a.hoursAgo}h ago`}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Agent intel feed */}
      {intelLines.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
          <Label>📡 Agent Intelligence Feed</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {intelLines.map((line: string, i: number) => (
              <p key={i} style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, padding: '0.3rem 0', borderBottom: `1px solid ${C.border}` }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
