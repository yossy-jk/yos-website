'use client'
import { useEffect, useState } from 'react'

const C = { teal: '#00B5A5', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', purple: '#8b5cf6', card: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.07)' }

function Label({ children, c }: { children: React.ReactNode; c?: string }) {
  return <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: c || 'rgba(255,255,255,0.3)', margin: '0 0 0.75rem' }}>{children}</p>
}

export default function InnovationTab() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('//api/agent-intel', {credentials: 'include'}).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center' }}>Loading innovation data...</div>

  // Parse pending approvals
  const pending = (data?.pending as string) || ''
  const pendingItems = pending.split('##').filter(s => s.trim() && s.includes('What:')).map(s => {
    const lines = s.trim().split('\n')
    const title = lines[0]?.trim() || 'Pending Item'
    const what = lines.find(l => l.startsWith('What:'))?.replace('What:', '').trim() || ''
    const why = lines.find(l => l.startsWith('Why:'))?.replace('Why:', '').trim() || ''
    const cost = lines.find(l => l.startsWith('Cost:'))?.replace('Cost:', '').trim() || ''
    const approve = lines.find(l => l.includes('approve:'))?.trim() || ''
    return { title, what, why, cost, approve }
  })

  // Parse improvement protocol for capability gaps
  const improve = (data?.improve as string) || ''
  const capLines = improve.split('\n').filter(l => l.includes('CRITICAL') || l.includes('HIGH') || l.includes('Build')).slice(0, 8)

  // Skills status
  const skills = [
    { name: 'fal.ai Image Generation', status: 'pending', impact: 'LinkedIn graphics, proposals', cost: '$20 credit', action: 'Sign up at fal.ai → add FAL_API_KEY' },
    { name: 'Google Places API', status: 'pending', impact: 'Location intelligence for agents', cost: 'Free tier', action: 'Get key at console.cloud.google.com' },
    { name: 'ElevenLabs TTS', status: 'pending', impact: 'COO brief as audio', cost: '$5/month', action: 'Sign up at elevenlabs.io' },
    { name: 'Peekaboo macOS', status: 'pending', impact: 'Screenshot monitoring', cost: 'Free', action: 'brew install peekaboo' },
    { name: 'openai-whisper', status: 'ready', impact: 'Voice transcription', cost: 'Free', action: 'Installed and ready' },
    { name: 'video-frames (ffmpeg)', status: 'ready', impact: 'Video content extraction', cost: 'Free', action: 'Installed and ready' },
    { name: 'openclaw-pdf-reader', status: 'ready', impact: 'PDF analysis for tenders', cost: 'Free', action: 'Ready to use' },
    { name: 'DeepSeek R1', status: 'ready', impact: 'Smart agents (COO, Innovation)', cost: '$0.55/1M', action: 'Wired to 5 agents' },
    { name: 'DeepSeek V3', status: 'ready', impact: 'Business agents', cost: '$0.14/1M', action: 'Wired to 5 agents' },
    { name: 'YOS Estimator', status: 'ready', impact: 'Fitout/cleaning/tender pricing', cost: 'Free', action: 'Wired to 8 agents' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Pending approvals */}
      {pendingItems.length > 0 && (
        <div style={{ background: C.card, border: `1px solid rgba(139,92,246,0.3)`, borderLeft: `3px solid ${C.purple}`, borderRadius: 8, padding: '1.25rem' }}>
          <Label c={C.purple}>⏳ Pending Your Approval ({pendingItems.length})</Label>
          {pendingItems.map((item, i) => (
            <div key={i} style={{ padding: '0.875rem', background: 'rgba(139,92,246,0.05)', borderRadius: 6, marginBottom: '0.75rem', border: `1px solid rgba(139,92,246,0.15)` }}>
              <p style={{ margin: '0 0 0.4rem', fontWeight: 700, fontSize: '0.82rem', color: 'white' }}>{item.title}</p>
              {item.what && <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}><strong>What:</strong> {item.what}</p>}
              {item.why && <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}><strong>Why:</strong> {item.why}</p>}
              {item.cost && <p style={{ margin: '0 0 0.4rem', fontSize: '0.65rem', color: C.amber }}><strong>Cost:</strong> {item.cost}</p>}
              {item.approve && <code style={{ fontSize: '0.65rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.5rem', borderRadius: 3, color: C.teal }}>Telegram: {item.approve}</code>}
            </div>
          ))}
        </div>
      )}

      {/* Skills status */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
        <Label>🔧 Capability Status</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {skills.map(s => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 0.875rem', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
              <span style={{ color: s.status === 'ready' ? C.green : C.amber, fontSize: '0.8rem', flexShrink: 0 }}>{s.status === 'ready' ? '✅' : '⏳'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.78rem' }}>{s.name}</p>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>{s.impact}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ margin: 0, fontSize: '0.62rem', color: s.status === 'ready' ? C.green : C.amber, fontWeight: 700 }}>{s.cost}</p>
                <p style={{ margin: '0.1rem 0 0', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)' }}>{s.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What to do next */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '1.25rem' }}>
        <Label>🚀 Next Level Upgrades — Priority Order</Label>
        {[
          { rank: 1, item: 'Sign up fal.ai ($20)', impact: 'Brand-marketing generates LinkedIn graphics overnight', tag: 'CRITICAL' },
          { rank: 2, item: 'Get Google Places API key (free)', impact: 'Agents research client locations, competitor mapping', tag: 'HIGH' },
          { rank: 3, item: 'Sign up ElevenLabs ($5/month)', impact: 'Listen to COO brief while driving', tag: 'HIGH' },
          { rank: 4, item: 'Connect GSC via Maton OAuth', impact: 'Stable keyword tracking without refresh token issues', tag: 'MEDIUM' },
          { rank: 5, item: 'Connect LinkedIn via Maton', impact: 'Brand-marketing posts automatically', tag: 'MEDIUM' },
        ].map(u => (
          <div key={u.rank} style={{ display: 'flex', gap: '0.875rem', padding: '0.6rem 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: u.rank === 1 ? C.teal : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: 'white', flexShrink: 0 }}>{u.rank}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.78rem' }}>{u.item}</p>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{u.impact}</p>
            </div>
            <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', padding: '0.15rem 0.4rem', borderRadius: 3, background: u.tag === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : u.tag === 'HIGH' ? 'rgba(245,158,11,0.15)' : 'rgba(0,181,165,0.15)', color: u.tag === 'CRITICAL' ? C.red : u.tag === 'HIGH' ? C.amber : C.teal, flexShrink: 0, alignSelf: 'flex-start' }}>{u.tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
