'use client'
import { useEffect, useState, useCallback } from 'react'
import TodayTab from './tabs/today-tab'
import PipelineTab from './tabs/pipeline-tab'
import TasksTab from './tasks-tab'
import MarketingTab from './tabs/marketing-tab'
import FinanceTab from './tabs/finance-tab'
import ApprovalsTab from './tabs/approvals-tab'
import TeamTab from './tabs/team-tab'
import InnovationTab from './tabs/innovation-tab'
import TractionTab from './tabs/traction-tab'

type TabKey = 'today' | 'pipeline' | 'tasks' | 'marketing' | 'finance' | 'approvals' | 'team' | 'innovation' | 'traction'

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'today',      label: 'Today',      icon: '' },
  { key: 'pipeline',   label: 'Pipeline',   icon: '' },
  { key: 'tasks',      label: 'Tasks',      icon: '' },
  { key: 'marketing',  label: 'Marketing',  icon: '' },
  { key: 'finance',    label: 'Finance',    icon: '' },
  { key: 'approvals',  label: 'Approvals',  icon: '' },
  { key: 'team',       label: 'Team',       icon: '' },
  { key: 'innovation', label: 'Innovation', icon: '' },
  { key: 'traction',   label: 'Traction',   icon: '' },
]

function aestNow() {
  return new Date().toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney', weekday: 'long', day: 'numeric',
    month: 'long', hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('today')
  const [now, setNow] = useState(aestNow())
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setNow(aestNow()), 60000)
    // Check pending queue count
    fetch('/api/queue/list', {credentials: 'include'}).then(r => r.json()).then(d => {
      setPendingCount(d?.items?.length || 0)
    }).catch(() => {})
    return () => clearInterval(t)
  }, [])

  const S: Record<string, React.CSSProperties> = {
    shell: {
      minHeight: '100vh',
      background: '#080808',
      color: 'white',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    },
    header: {
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      position: 'sticky' as const,
      top: 0,
      background: 'rgba(8,8,8,0.95)',
      backdropFilter: 'blur(12px)',
      zIndex: 50,
    },
    logo: {
      fontSize: '0.75rem',
      fontWeight: 800,
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
      color: '#00B5A5',
    },
    time: {
      fontSize: '0.65rem',
      color: 'rgba(255,255,255,0.3)',
      letterSpacing: '0.05em',
    },
    nav: {
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '0 2rem',
      display: 'flex',
      gap: 0,
      overflowX: 'auto' as const,
    },
    content: {
      padding: '2rem',
      maxWidth: 1400,
      margin: '0 auto',
    },
  }

  return (
    <div style={S.shell}>
      {/* Header */}
      <div style={S.header}>
        <span style={S.logo}>YOS Command</span>
        <span style={S.time}>{now}</span>
        <button
          onClick={() => {
            document.cookie = 'yos_dash_session=; Max-Age=0; path=/'
            window.location.href = '/dashboard/login'
          }}
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', padding: '0.3rem 0.75rem', cursor: 'pointer', borderRadius: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          Sign out
        </button>
      </div>

      {/* Navigation */}
      <div style={S.nav}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key
          const badge = tab.key === 'approvals' && pendingCount > 0 ? pendingCount : 0
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0 1.25rem',
                height: 48,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.7rem',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isActive ? 'white' : 'rgba(255,255,255,0.3)',
                borderBottom: isActive ? '2px solid #00B5A5' : '2px solid transparent',
                marginBottom: -1,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color 0.15s',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>{tab.icon}</span>
              {tab.label}
              {badge > 0 && (
                <span style={{ background: '#ef4444', color: 'white', fontSize: '0.55rem', fontWeight: 900, padding: '0.1rem 0.35rem', borderRadius: 99, lineHeight: 1.4 }}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={S.content}>
        {activeTab === 'today'      && <TodayTab />}
        {activeTab === 'pipeline'   && <PipelineTab />}
        {activeTab === 'tasks'      && <TasksTab />}
        {activeTab === 'marketing'  && <MarketingTab />}
        {activeTab === 'finance'    && <FinanceTab />}
        {activeTab === 'approvals'  && <ApprovalsTab onCountChange={setPendingCount} />}
        {activeTab === 'team'       && <TeamTab />}
        {activeTab === 'innovation' && <InnovationTab />}
        {activeTab === 'traction'   && <TractionTab />}
      </div>
    </div>
  )
}
