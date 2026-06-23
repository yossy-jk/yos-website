'use client'
import { useEffect, useState } from 'react'

const C = {
  teal:    '#00B5A5',
  red:     '#ef4444',
  green:   '#22c55e',
  amber:   '#f59e0b',
  purple:  '#8b5cf6',
  card:    'rgba(255,255,255,0.03)',
  border:  'rgba(255,255,255,0.07)',
  muted:   'rgba(255,255,255,0.25)',
}

interface Keyword {
  keyword:      string
  rank:         number
  cluster:      string
  intent:       string
  priority:     string
  difficulty:   string
  blog_angle:   string
}

interface GSCQuery {
  keys:     string[]
  clicks:   number
  impr?:    number
  impressions?: number
  ctr:      number
  position: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TrendArrow({ delta }: { delta: number }) {
  if (delta > 0.5) return <span style={{ color: C.green, fontSize: '0.68rem' }}>{delta > 5 ? '▲▲' : '▲'} {delta.toFixed(1)}</span>
  if (delta < -0.5) return <span style={{ color: C.red,   fontSize: '0.68rem' }}>{delta < -5 ? '▼▼' : '▼'} {Math.abs(delta).toFixed(1)}</span>
  return <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem' }}>—</span>
}

function PositionPill({ pos }: { pos: number }) {
  const colour = pos <= 3 ? C.green : pos <= 10 ? C.amber : pos <= 20 ? 'rgba(255,255,255,0.5)' : C.red
  return (
    <span style={{
      background: `${colour}18`,
      color: colour,
      border: `1px solid ${colour}35`,
      fontSize: '0.62rem', fontWeight: 800,
      padding: '0.1rem 0.4rem', borderRadius: 3,
      minWidth: 28, textAlign: 'center', display: 'inline-block',
    }}>
      {pos < 1 ? 'N/A' : pos.toFixed(1)}
    </span>
  )
}

// ─── Blog Suggestion Card ──────────────────────────────────────────────────────

interface BlogSuggestion {
  topic:        string
  keyword:      string
  division:     string
  urgency:      'high' | 'medium' | 'low'
  reason:       string
  searchVolume: string
}

function SuggestionCard({ s, onSuggest }: { s: BlogSuggestion; onSuggest: (s: BlogSuggestion) => void }) {
  const divCol = {
    'tenant-rep':    '#00B5A5',
    'buyers-agency': '#10b981',
    'furniture':     '#8b5cf6',
    'cleaning':      '#f59e0b',
    'general':       '#6b7280',
  }[s.division] || C.purple

  const urgCol = { high: C.red, medium: C.amber, low: C.green }[s.urgency]

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: '0.875rem 1rem',
      display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 0.2rem', fontWeight: 700, fontSize: '0.8rem', color: 'white', lineHeight: 1.3 }}>
          {s.topic}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
          <span style={{ background: `${divCol}18`, color: divCol, fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.1rem 0.4rem', borderRadius: 3 }}>
            {s.division}
          </span>
          <span style={{ fontSize: '0.62rem', color: C.teal, fontStyle: 'italic' }}>
            {s.keyword}
          </span>
          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)' }}>
            {s.searchVolume}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
          {s.reason}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
        <span style={{ background: `${urgCol}18`, color: urgCol, fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.15rem 0.4rem', borderRadius: 3 }}>
          {s.urgency}
        </span>
        <button
          onClick={() => onSuggest(s)}
          style={{ background: 'rgba(0,181,165,0.1)', border: `1px solid rgba(0,181,165,0.25)`, borderRadius: 4, padding: '0.3rem 0.7rem', color: C.teal, fontSize: '0.6rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Request
        </button>
      </div>
    </div>
  )
}

// ─── Keyword Row ──────────────────────────────────────────────────────────────

function KeywordRow({ kw }: { kw: Keyword }) {
  const clusterCol: Record<string, string> = {
    'tenant-rep': C.teal, 'fitout': C.amber, 'cleaning': C.green,
    'furniture': C.purple, 'lease': '#ec4899', 'buyers': '#06b6d4',
  }
  const clusterColor = clusterCol[kw.cluster] || C.muted
  const diffColor   = { low: C.green, medium: C.amber, high: C.red }[kw.difficulty] || C.muted
  const prioColor   = { P1: C.red, P2: C.amber, P3: C.green }[kw.priority] || C.muted

  return (
    <div style={{
      display: 'flex', gap: '0.75rem', alignItems: 'center',
      padding: '0.5rem 0',
      borderBottom: `1px solid rgba(255,255,255,0.04)`,
    }}>
      <span style={{ fontSize: '0.62rem', background: `${clusterColor}15`, color: clusterColor, border: `1px solid ${clusterColor}30`, padding: '0.1rem 0.4rem', borderRadius: 3, fontWeight: 700, minWidth: 64, textAlign: 'center', flexShrink: 0 }}>
        {kw.cluster}
      </span>
      <span style={{ flex: 1, fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {kw.keyword}
      </span>
      <span style={{ fontSize: '0.6rem', color: diffColor, minWidth: 50, textAlign: 'right', flexShrink: 0 }}>
        {kw.difficulty}
      </span>
      <span style={{ fontSize: '0.6rem', color: prioColor, minWidth: 24, textAlign: 'center', flexShrink: 0 }}>
        {kw.priority}
      </span>
      <PositionPill pos={kw.rank} />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketingTab() {
  const [gsc,      setGsc]      = useState<GSCQuery[]>([])
  const [keywords, setKeywords]  = useState<Keyword[]>([])
  const [suggestions, setSuggestions] = useState<BlogSuggestion[]>([])
  const [loading,   setLoading]   = useState(true)
  const [gscLive,  setGscLive]  = useState<boolean | null>(null)
  const [tab, setTab]             = useState<'keywords' | 'queries' | 'suggest'> ('keywords')
  const [search, setSearch]       = useState('')
  const [cluster, setCluster]      = useState('all')
  const [requesting, setRequesting] = useState<string | null>(null)
  const [requested,  setRequested]  = useState<string[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/seo/rankings', { credentials: 'include' }).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/seo-keywords', { credentials: 'include' }).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([seoData, kwData]) => {
      setGscLive(seoData?.connected ?? null)

      // GSC queries (top 100 by impressions)
      const rawQueries = (seoData && Array.isArray((seoData as Record<string,unknown>).topQueries)
        ? (seoData as Record<string,unknown>).topQueries as unknown[]
        : []) as GSCQuery[]
      const sorted = rawQueries.sort((a, b) =>
        ((b.impressions ?? 0) - (a.impressions ?? 0))
      )
      const queries: GSCQuery[] = sorted.slice(0, 80)
      setGsc(queries)

      // Tracked keywords
      const kw: Keyword[] = (kwData?.keywords as Keyword[]) || []
      setKeywords(kw)

      // Build suggestions from keywords that don't have a post ranking yet
      const rankedSlugs = new Set<string>()
      // Build suggestions from high-priority unranked keywords
      const suggs: BlogSuggestion[] = kw
        .filter(k => k.rank > 20 || k.rank === 0)
        .filter(k => ['P1', 'P2'].includes(k.priority))
        .slice(0, 12)
        .map((k, i) => ({
          topic:        `${k.keyword.charAt(0).toUpperCase() + k.keyword.slice(1)} — ${k.cluster.replace('-', ' ')} guide`,
          keyword:      k.keyword,
          division:     k.cluster,
          urgency:      i < 4 ? 'high' : i < 8 ? 'medium' : 'low',
          reason:       k.blog_angle || (`High priority keyword with position "${k.rank === 0 ? 'not yet ranked' : (k.rank + '+')}". Target: "${k.keyword}".`),
          searchVolume: `${k.difficulty} difficulty · ${k.intent} intent`,
        }))
      setSuggestions(suggs)
      setLoading(false)
    })
  }, [])

  const handleSuggest = async (s: BlogSuggestion) => {
    setRequesting(s.keyword)
    try {
      await fetch('/api/queue/submit', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog-request',
          title: s.topic,
          content: `${s.keyword} — ${s.reason}`,
          metadata: {
            targetKeyword: s.keyword,
            division: s.division,
            reason: s.reason,
            urgency: s.urgency,
            source: 'dashboard-marketing-suggest',
          },
        }),
      })
      setRequested(prev => [...prev, s.keyword])
    } catch {
      // silent fail
    } finally {
      setRequesting(null)
    }
  }

  const clusters = ['all', ...Array.from(new Set(keywords.map(k => k.cluster)))]
  const p1count = keywords.filter(k => k.priority === 'P1').length
  const unranked = keywords.filter(k => k.rank > 20 || k.rank === 0).length

  const filteredKw = keywords.filter(k => {
    const matchCluster = cluster === 'all' || k.cluster === cluster
    const matchSearch = !search || k.keyword.toLowerCase().includes(search.toLowerCase())
    return matchCluster && matchSearch
  })

  const filteredGsc = gsc.filter(q => !search || q.keys[0]?.toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div style={{ color: 'rgba(255,255,255,0.3)', padding: '4rem', textAlign: 'center', fontSize: '0.85rem' }}>
      Loading SEO data...
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Target Keywords',  val: String(keywords.length),       color: 'white' },
          { label: 'P1 Priority',      val: String(p1count),              color: p1count > 0 ? C.red : C.muted },
          { label: 'Unranked / 20+',   val: String(unranked),             color: unranked > 5 ? C.amber : C.muted },
          { label: 'GSC Queries',       val: String(gsc.length),           color: gsc.length > 0 ? C.teal : C.muted },
          { label: 'GSC Status',        val: gscLive === true ? 'Live' : gscLive === false ? 'Offline' : 'Unknown', color: gscLive === true ? C.green : C.red },
        ].map(s => (
          <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '0.875rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</p>
            <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', margin: '0.25rem 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Blog suggestions ─────────────────────────────────────────────── */}
      <div style={{ background: `${C.amber}08`, border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 10, padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.amber, margin: '0 0 0.25rem' }}>
              Suggested blog articles
            </p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              Keywords with no strong ranking — blog posts could fill the gap
            </p>
          </div>
          <span style={{ fontSize: '0.62rem', background: `${C.amber}18`, color: C.amber, border: `1px solid ${C.amber}30`, padding: '0.2rem 0.6rem', borderRadius: 4, fontWeight: 700 }}>
            {suggestions.length} ideas
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {suggestions.map(s => (
            <SuggestionCard
              key={s.keyword}
              s={s}
              onSuggest={handleSuggest}
            />
          ))}
        </div>
        {requested.length > 0 && (
          <p style={{ fontSize: '0.65rem', color: C.green, margin: '0.75rem 0 0' }}>
            Requested: {requested.join(', ')}
          </p>
        )}
      </div>

      {/* ── Sub-tabs ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {(['keywords', 'queries', 'suggest'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: tab === t ? 'rgba(0,181,165,0.12)' : 'rgba(255,255,255,0.04)',
              border:    tab === t ? `1px solid rgba(0,181,165,0.3)` : `1px solid ${C.border}`,
              color:     tab === t ? C.teal : 'rgba(255,255,255,0.4)',
              padding: '0.4rem 1rem',
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
            {t === 'keywords' ? 'Keywords' : t === 'queries' ? 'GSC Queries' : 'Suggestions'}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter..."
          style={{
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
            borderRadius: 4, padding: '0.35rem 0.75rem',
            color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: 'inherit',
            width: 160, outline: 'none',
          }}
        />
      </div>

      {/* ── Keywords tab ─────────────────────────────────────────────────── */}
      {tab === 'keywords' && (
        <>
          {/* Cluster filter */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {clusters.map(c => (
              <button
                key={c}
                onClick={() => setCluster(c)}
                style={{
                  background: cluster === c ? `${C.teal}15` : 'transparent',
                  border:    cluster === c ? `1px solid ${C.teal}40` : `1px solid ${C.border}`,
                  color:     cluster === c ? C.teal : 'rgba(255,255,255,0.35)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 4, cursor: 'pointer',
                  fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                {c}
              </button>
            ))}
          </div>

          {/* Column headers */}
          <div style={{ display: 'flex', gap: '0.75rem', padding: '0 0 0.25rem', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', flexShrink: 0, minWidth: 64 }}>Cluster</span>
            <span style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', flex: 1 }}>Keyword</span>
            <span style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', minWidth: 50, textAlign: 'right' }}>Difficulty</span>
            <span style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', minWidth: 24, textAlign: 'center' }}>Pri</span>
            <span style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)', minWidth: 36, textAlign: 'center' }}>Pos</span>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '0.25rem 1rem' }}>
            {filteredKw.length === 0 && (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', padding: '1.5rem' }}>No matching keywords</p>
            )}
            {filteredKw.map((kw, i) => (
              <KeywordRow key={`${kw.keyword}-${i}`} kw={kw} />
            ))}
          </div>
        </>
      )}

      {/* ── GSC Queries tab ──────────────────────────────────────────────── */}
      {tab === 'queries' && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>
              Top {filteredGsc.length} queries by impressions (28 days)
            </span>
          </div>
          {filteredGsc.slice(0, 60).map((q, i) => (
            <div key={i} style={{
              display: 'flex', gap: '1rem', alignItems: 'center',
              padding: '0.5rem 1rem',
              borderBottom: `1px solid rgba(255,255,255,0.04)`,
            }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {q.keys[0]}
              </span>
              <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', minWidth: 50, textAlign: 'right' }}>
                {(q.impr ?? q.impressions ?? 0)} impr
              </span>
              <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', minWidth: 40, textAlign: 'right' }}>
                {q.clicks} clk
              </span>
              <PositionPill pos={q.position} />
            </div>
          ))}
          {gsc.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', padding: '2rem' }}>
              {gscLive === false ? 'GSC is offline — keyword data still available in Keywords tab.' : 'No GSC data available.'}
            </p>
          )}
        </div>
      )}

      {/* ── Suggestions tab ──────────────────────────────────────────────── */}
      {tab === 'suggest' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', margin: '0 0 0.5rem' }}>
            Request a blog article from the Innovation agent. Based on {suggestions.length} unranked / low-ranking keywords.
          </p>
          {suggestions.map(s => (
            <SuggestionCard
              key={s.keyword}
              s={s}
              onSuggest={handleSuggest}
            />
          ))}
        </div>
      )}
    </div>
  )
}
