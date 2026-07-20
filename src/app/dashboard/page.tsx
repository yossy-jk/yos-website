'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import PersonalFinanceTab from './tabs/personal-finance-tab'
import ContentTab from './tabs/content-tab'

/* ────────────────────────────────────────────────────────────────
   YOS Command Centre v2 — Monday.com × HubSpot design language
   Light SaaS shell · status-color system · board-group Next 3
──────────────────────────────────────────────────────────────── */

type Task = { title: string; due: string; tags: string; why: string }
type FeedItem = { type: string; priority: number; title: string; detail: string; action: string; count: number }
type Tile = { label: string; value: any; sub: string; fmt: string }
type Feed = { next3: Task[]; feed: FeedItem[]; numbers: Tile[]; generated: string } | null
type ChatMsg = { role: 'you' | 'fleet'; text: string }
type View = 'home' | 'content' | 'personal-finance' | 'whs'
type Checklist = { id: number; code: string; title: string; business: string; frequency: string; next_due: string; overdue: boolean; due_soon: boolean; last_done: string | null }
type WhsDoc = { id: number; code: string; title: string; category: string; business: string; status: string }
type Incident = { id: number; reported_at: string; business: string; severity: string; description: string; status: string }
type Whs = { score: number; checklists: Checklist[]; documents: WhsDoc[]; docs_current: number; docs_needed: number; incidents: Incident[]; open_incidents: number; overdue_checklists: number; generated: string } | null

const fmtVal = (v: any, fmt: string) => {
  if (v === '—' || v == null || v === '') return '—'
  if (fmt === 'money') {
    const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[$,]/g, ''))
    if (isNaN(n)) return String(v)
    return (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-AU', { maximumFractionDigits: 0 })
  }
  return String(v)
}

const TILE_ICONS: Record<string, string> = {
  'Pipeline': '📈', 'YOS Cash': '🏦', 'Personal (after bills)': '🏠',
  'Content': '✏️', 'EOF Quotes': '🪑', 'Open Tasks': '☑️', 'Search Clicks': '🔍',
}

const FEED_META: Record<string, { icon: string; color: string }> = {
  content:  { icon: '✏️', color: 'var(--purple)' },
  quotes:   { icon: '🪑', color: 'var(--blue)' },
  approvals:{ icon: '✋', color: 'var(--amber)' },
  cash:     { icon: '⚠️', color: 'var(--red)' },
  needles:  { icon: '🎯', color: 'var(--blue)' },
  seo:      { icon: '🔍', color: 'var(--green)' },
}

const CHAT_SUGGESTIONS = [
  'What needs my attention today?',
  "What's our cash position?",
  'Any stalled deals?',
]

export default function Dashboard() {
  const [d, setD] = useState<Feed>(null)
  const [loaded, setLoaded] = useState(false)
  const [view, setView] = useState<View>('home')
  const [chatOpen, setChatOpen] = useState(false)
  const [chat, setChat] = useState<ChatMsg[]>([])
  const [q, setQ] = useState('')
  const [asking, setAsking] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [whs, setWhs] = useState<Whs>(null)
  const [incDesc, setIncDesc] = useState('')
  const [incSev, setIncSev] = useState('low')
  const chatEnd = useRef<HTMLDivElement>(null)

  const load = useCallback(() => {
    fetch('/api/feed', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (j) setD(j) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t) }, [load])
  useEffect(() => { if (view === 'whs') fetch('/api/whs', { cache: 'no-store' }).then(r => r.json()).then(j => { if (j) setWhs(j) }).catch(() => {}) }, [view])
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat, chatOpen])

  const refresh = () => { setRefreshing(true); load(); setTimeout(() => setRefreshing(false), 900) }

  const whsAct = async (payload: object) => {
    await fetch('/api/whs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  }
  const markChecklist = (id: number) => {
    whsAct({ type: 'checklist_done', id, by: 'Joe' })
    if (whs) setWhs({ ...whs, checklists: whs.checklists.map(c => c.id === id ? { ...c, overdue: false, due_soon: false, last_done: 'just now' } : c) })
  }
  const reportIncident = () => {
    if (!incDesc.trim()) return
    whsAct({ type: 'incident', description: incDesc, severity: incSev, business: 'ALL' })
    if (whs) setWhs({ ...whs, incidents: [{ id: Date.now(), reported_at: 'just now', business: 'ALL', severity: incSev, description: incDesc, status: 'open' }, ...whs.incidents], open_incidents: whs.open_incidents + 1 })
    setIncDesc('')
  }

  const ask = async (text?: string) => {
    const question = (text ?? q).trim()
    if (!question || asking) return
    setChat(c => [...c, { role: 'you', text: question }])
    setQ(''); setAsking(true); setChatOpen(true)
    try {
      const r = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: question }),
      })
      const { id } = await r.json()
      for (let i = 0; i < 15; i++) {
        await new Promise(res => setTimeout(res, 2000))
        const a = await fetch(`/api/chat?id=${id}`, { cache: 'no-store' }).then(r => r.json())
        if (a?.a) { setChat(c => [...c, { role: 'fleet', text: a.a }]); setAsking(false); return }
      }
      setChat(c => [...c, { role: 'fleet', text: 'The fleet took too long to answer. Check the Mac Mini responder is running, then try again.' }])
    } catch {
      setChat(c => [...c, { role: 'fleet', text: 'Connection problem. Try again in a moment.' }])
    }
    setAsking(false)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })

  const railColor = (t: Task) =>
    t.why === 'overdue' ? 'var(--red)' : t.why === 'needle' ? 'var(--blue)' : 'var(--green)'
  const pill = (t: Task) =>
    t.why === 'overdue' ? { label: 'Overdue', cls: 'pill-red' }
    : t.why === 'needle' ? { label: 'Needle', cls: 'pill-blue' }
    : { label: t.due ? `Due ${t.due}` : 'Priority', cls: 'pill-green' }

  return (
    <>
      <style>{CSS}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="shell">
        {/* ── SIDEBAR (desktop) ── */}
        <aside className="sidebar">
          <div className="logo">Y<span>OS</span></div>
          <nav>
            <button className={view === 'home' ? 'nav-item active' : 'nav-item'} onClick={() => setView('home')}>
              <span className="nav-ic">⌂</span> Home
            </button>
            <button className={view === 'content' ? 'nav-item active' : 'nav-item'} onClick={() => setView('content')}>
              <span className="nav-ic">✏️</span> Content
            </button>
            <button className={view === 'personal-finance' ? 'nav-item active' : 'nav-item'} onClick={() => setView('personal-finance')}>
              <span className="nav-ic">🏠</span> Personal
            </button>
            <button className={view === 'whs' ? 'nav-item active' : 'nav-item'} onClick={() => setView('whs')}>
              <span className="nav-ic">🦺</span> WHS &amp; Quality
            </button>
          </nav>
          <div className="sidebar-foot">
            <div className="avatar">J</div>
            <div className="who">Joe Kelley<span>Founder</span></div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">
          {view === 'whs' ? (
            <div className="deepdive">
              <button className="back" onClick={() => setView('home')}>← Back to Home</button>
              <header className="topbar"><div><h1>WHS &amp; Quality Hub</h1>
                <p className="date">Policies, checklists, incidents — your WHS manager</p></div></header>
              <section className="kpis">
                <div className="kpi"><div className="kpi-top"><span className="kpi-ic">🛡️</span><span className="kpi-label">Compliance</span></div>
                  <div className={`kpi-value ${(whs?.score ?? 0) < 60 ? 'neg' : ''}`}>{whs ? `${whs.score}%` : '…'}</div>
                  <div className="kpi-sub">weighted score</div></div>
                <div className="kpi"><div className="kpi-top"><span className="kpi-ic">☑️</span><span className="kpi-label">Checklists overdue</span></div>
                  <div className={`kpi-value ${(whs?.overdue_checklists ?? 0) > 0 ? 'neg' : ''}`}>{whs?.overdue_checklists ?? '…'}</div>
                  <div className="kpi-sub">of {whs?.checklists?.length ?? 0} scheduled</div></div>
                <div className="kpi"><div className="kpi-top"><span className="kpi-ic">🚨</span><span className="kpi-label">Open incidents</span></div>
                  <div className={`kpi-value ${(whs?.open_incidents ?? 0) > 0 ? 'neg' : ''}`}>{whs?.open_incidents ?? '…'}</div>
                  <div className="kpi-sub">require action</div></div>
                <div className="kpi"><div className="kpi-top"><span className="kpi-ic">📄</span><span className="kpi-label">Documents</span></div>
                  <div className="kpi-value">{whs ? `${whs.docs_current}/${whs.documents.length}` : '…'}</div>
                  <div className="kpi-sub">{whs?.docs_needed ?? 0} to draft</div></div>
              </section>
              <div className="cols">
                <section className="panel">
                  <div className="panel-head"><h2>Safety checklists</h2>
                    <span className="panel-count">{whs?.checklists?.length ?? 0}</span></div>
                  {(whs?.checklists || []).map(ch => (
                    <div key={ch.id} className="task">
                      <span className="rail" style={{ background: ch.overdue ? 'var(--red)' : ch.due_soon ? 'var(--amber)' : 'var(--green)' }} />
                      <div className="task-body">
                        <div className="task-title">{ch.title}</div>
                        <div className="task-tags">{ch.business} · {ch.frequency} · due {ch.next_due}{ch.last_done ? ` · last ${ch.last_done}` : ''}</div>
                      </div>
                      <button className="done-btn" onClick={() => markChecklist(ch.id)}>Mark done</button>
                    </div>
                  ))}
                  {!whs?.checklists?.length && <div className="empty">Checklist register loads after the first WHS manager run.</div>}
                </section>
                <div>
                  <section className="panel" style={{ marginBottom: 16 }}>
                    <div className="panel-head"><h2>Report an incident</h2></div>
                    <textarea className="inc-input" value={incDesc} onChange={e => setIncDesc(e.target.value)}
                      placeholder="What happened? Where, who was involved, any injury?" />
                    <div className="inc-row">
                      <select className="inc-sev" value={incSev} onChange={e => setIncSev(e.target.value)}>
                        <option value="low">Low — near miss / hazard</option>
                        <option value="medium">Medium — minor injury</option>
                        <option value="high">High — injury / notifiable</option>
                      </select>
                      <button className="done-btn solid" onClick={reportIncident}>Log incident</button>
                    </div>
                    {(whs?.incidents || []).slice(0, 4).map(inc => (
                      <div key={inc.id} className="task">
                        <span className="rail" style={{ background: inc.severity === 'high' ? 'var(--red)' : inc.severity === 'medium' ? 'var(--amber)' : 'var(--blue)' }} />
                        <div className="task-body">
                          <div className="task-title">{inc.description.slice(0, 70)}</div>
                          <div className="task-tags">{inc.reported_at} · {inc.severity} · {inc.status}</div>
                        </div>
                      </div>
                    ))}
                  </section>
                  <section className="panel">
                    <div className="panel-head"><h2>Document register</h2>
                      <span className="panel-count">{whs?.documents?.length ?? 0}</span></div>
                    {(whs?.documents || []).map(doc => (
                      <div key={doc.id} className="task">
                        <div className="task-body">
                          <div className="task-title">{doc.code} — {doc.title}</div>
                          <div className="task-tags">{doc.category} · {doc.business}</div>
                        </div>
                        <span className={`pill ${doc.status === 'current' ? 'pill-green' : doc.status === 'draft' ? 'pill-blue' : 'pill-red'}`}>
                          {doc.status === 'template_needed' ? 'To draft' : doc.status}
                        </span>
                      </div>
                    ))}
                  </section>
                </div>
              </div>
            </div>
          ) : view !== 'home' ? (
            <div className="deepdive">
              <button className="back" onClick={() => setView('home')}>← Back to Home</button>
              <div className="deepdive-dark">
                {view === 'content' && <ContentTab />}
                {view === 'personal-finance' && <PersonalFinanceTab />}
              </div>
            </div>
          ) : (
            <>
              {/* Top bar */}
              <header className="topbar">
                <div>
                  <h1>{greeting}, Joe</h1>
                  <p className="date">{dateStr}</p>
                </div>
                <div className="topbar-right">
                  <span className="fresh">
                    <span className="dot" /> {d?.generated ? `Updated ${d.generated.slice(11)}` : 'Connecting…'}
                  </span>
                  <button className={refreshing ? 'refresh spinning' : 'refresh'} onClick={refresh} aria-label="Refresh">⟳</button>
                </div>
              </header>

              {/* KPI strip */}
              <section className="kpis">
                {!loaded && [...Array(6)].map((_, i) => <div key={i} className="kpi skeleton" />)}
                {loaded && (d?.numbers || []).map((n, i) => (
                  <div key={i} className="kpi" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="kpi-top">
                      <span className="kpi-ic">{TILE_ICONS[n.label] || '📊'}</span>
                      <span className="kpi-label">{n.label}</span>
                    </div>
                    <div className={`kpi-value ${n.fmt === 'money' && parseFloat(String(n.value).replace(/[$,]/g, '')) < 0 ? 'neg' : ''}`}>
                      {fmtVal(n.value, n.fmt)}
                    </div>
                    <div className="kpi-sub">{n.sub}</div>
                  </div>
                ))}
                {loaded && !d?.numbers?.length && (
                  <div className="empty wide">No live numbers yet — the feed engine runs every 10 minutes.</div>
                )}
              </section>

              <div className="cols">
                {/* NEXT 3 — Monday board group */}
                <section className="panel">
                  <div className="panel-head">
                    <h2>Next 3 tasks</h2>
                    <span className="panel-count">{d?.next3?.length || 0}</span>
                  </div>
                  {!loaded && [...Array(3)].map((_, i) => <div key={i} className="task skeleton-row" />)}
                  {loaded && (d?.next3 || []).map((t, i) => {
                    const p = pill(t)
                    return (
                      <div key={i} className="task" style={{ animationDelay: `${i * 60}ms` }}>
                        <span className="rail" style={{ background: railColor(t) }} />
                        <span className="task-n">{i + 1}</span>
                        <div className="task-body">
                          <div className="task-title">{t.title}</div>
                          {t.tags && <div className="task-tags">{t.tags}</div>}
                        </div>
                        <span className={`pill ${p.cls}`}>{p.label}</span>
                      </div>
                    )
                  })}
                  {loaded && !d?.next3?.length && (
                    <div className="empty">No open tasks in the queue. Add tasks via Telegram or the task agent — they'll rank here automatically.</div>
                  )}
                </section>

                {/* NEEDS YOU */}
                <section className="panel">
                  <div className="panel-head">
                    <h2>Needs you</h2>
                    <span className="panel-count">{d?.feed?.length || 0}</span>
                  </div>
                  {!loaded && [...Array(3)].map((_, i) => <div key={i} className="task skeleton-row" />)}
                  {loaded && (d?.feed || []).map((f, i) => {
                    const meta = FEED_META[f.type] || { icon: '🔔', color: 'var(--blue)' }
                    const clickable = ['content', 'personal-finance'].includes(f.action)
                    return (
                      <div key={i}
                           className={clickable ? 'feed-item clickable' : 'feed-item'}
                           onClick={() => clickable && setView(f.action as View)}
                           style={{ animationDelay: `${i * 60}ms` }}>
                        <span className="feed-ic" style={{ background: `color-mix(in srgb, ${meta.color} 12%, white)` }}>{meta.icon}</span>
                        <div className="task-body">
                          <div className="task-title">{f.title}</div>
                          <div className="task-tags">{f.detail}</div>
                        </div>
                        {clickable && <span className="chev">›</span>}
                      </div>
                    )
                  })}
                  {loaded && !d?.feed?.length && (
                    <div className="empty ok">✓ All clear — nothing is waiting on you right now.</div>
                  )}
                </section>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="bottomnav">
        <button className={view === 'home' ? 'bn active' : 'bn'} onClick={() => setView('home')}>⌂<span>Home</span></button>
        <button className={view === 'content' ? 'bn active' : 'bn'} onClick={() => setView('content')}>✏️<span>Content</span></button>
        <button className={view === 'personal-finance' ? 'bn active' : 'bn'} onClick={() => setView('personal-finance')}>🏠<span>Personal</span></button>
        <button className={view === 'whs' ? 'bn active' : 'bn'} onClick={() => setView('whs')}>🦺<span>WHS</span></button>
        <button className="bn" onClick={() => setChatOpen(true)}>💬<span>Ask</span></button>
      </nav>

      {/* ── CHAT BUBBLE + PANEL ── */}
      {!chatOpen && (
        <button className="chat-fab" onClick={() => setChatOpen(true)} aria-label="Ask the fleet">💬</button>
      )}
      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-head">
            <div>
              <div className="chat-title">Ask the fleet</div>
              <div className="chat-sub">Answers from your agents & live data</div>
            </div>
            <button className="chat-close" onClick={() => setChatOpen(false)}>✕</button>
          </div>
          <div className="chat-body">
            {chat.length === 0 && (
              <div className="chat-suggestions">
                <p>Try asking:</p>
                {CHAT_SUGGESTIONS.map(s => (
                  <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>
                ))}
              </div>
            )}
            {chat.map((m, i) => (
              <div key={i} className={m.role === 'you' ? 'msg you' : 'msg fleet'}>{m.text}</div>
            ))}
            {asking && <div className="msg fleet thinking"><span/><span/><span/></div>}
            <div ref={chatEnd} />
          </div>
          <div className="chat-input">
            <input value={q} onChange={e => setQ(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && ask()}
                   placeholder="Ask anything…" />
            <button onClick={() => ask()} disabled={asking}>→</button>
          </div>
        </div>
      )}
    </>
  )
}

const CSS = `
:root {
  --canvas:#f6f7fb; --surface:#ffffff; --ink:#323338; --ink2:#676879;
  --line:#e6e9ef; --blue:#0073ea; --green:#00c875; --amber:#fdab3d;
  --red:#e2445c; --purple:#a25ddc;
  --shadow:0 1px 2px rgba(30,40,70,.06),0 4px 14px rgba(30,40,70,.05);
  --shadow-lift:0 2px 4px rgba(30,40,70,.08),0 10px 28px rgba(30,40,70,.10);
  --r:12px;
}
* { box-sizing:border-box; margin:0; }
html,body { background:var(--canvas); }
.shell { display:flex; min-height:100vh; background:var(--canvas);
  font-family:'Figtree',-apple-system,'Segoe UI',sans-serif; color:var(--ink); }

/* Sidebar */
.sidebar { width:224px; background:var(--surface); border-right:1px solid var(--line);
  display:flex; flex-direction:column; padding:20px 12px; position:sticky; top:0; height:100vh; }
.logo { font-size:22px; font-weight:800; letter-spacing:-.5px; padding:4px 12px 22px; color:var(--blue); }
.logo span { color:var(--ink); }
.nav-item { display:flex; align-items:center; gap:10px; width:100%; padding:10px 12px;
  border:0; background:none; border-radius:8px; font:inherit; font-size:14px; font-weight:500;
  color:var(--ink2); cursor:pointer; transition:background .15s,color .15s; text-align:left; }
.nav-item:hover { background:#f0f3f8; color:var(--ink); }
.nav-item.active { background:color-mix(in srgb,var(--blue) 10%,white); color:var(--blue); font-weight:600; }
.nav-ic { width:20px; text-align:center; }
.sidebar-foot { margin-top:auto; display:flex; gap:10px; align-items:center; padding:10px 8px;
  border-top:1px solid var(--line); }
.avatar { width:34px; height:34px; border-radius:50%; background:var(--blue); color:#fff;
  display:grid; place-items:center; font-weight:700; font-size:15px; }
.who { font-size:13px; font-weight:600; line-height:1.2; }
.who span { display:block; font-size:11px; font-weight:400; color:var(--ink2); }

/* Main */
.main { flex:1; padding:26px 30px 110px; max-width:1120px; }
.topbar { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:22px; }
.topbar h1 { font-size:24px; font-weight:700; letter-spacing:-.3px; }
.date { font-size:13px; color:var(--ink2); margin-top:3px; }
.topbar-right { display:flex; gap:10px; align-items:center; }
.fresh { font-size:12px; color:var(--ink2); display:flex; align-items:center; gap:6px;
  background:var(--surface); border:1px solid var(--line); border-radius:20px; padding:6px 12px; }
.dot { width:7px; height:7px; border-radius:50%; background:var(--green); }
.refresh { width:34px; height:34px; border-radius:50%; border:1px solid var(--line);
  background:var(--surface); font-size:16px; color:var(--ink2); cursor:pointer; transition:transform .5s; }
.refresh.spinning { transform:rotate(360deg); }

/* KPI strip */
.kpis { display:grid; grid-template-columns:repeat(auto-fill,minmax(168px,1fr)); gap:12px; margin-bottom:22px; }
.kpi { background:var(--surface); border:1px solid var(--line); border-radius:var(--r);
  padding:14px 16px; box-shadow:var(--shadow); animation:rise .3s ease both;
  transition:box-shadow .15s,transform .15s; }
.kpi:hover { box-shadow:var(--shadow-lift); transform:translateY(-1px); }
.kpi-top { display:flex; align-items:center; gap:7px; margin-bottom:8px; }
.kpi-ic { font-size:14px; }
.kpi-label { font-size:11.5px; font-weight:600; color:var(--ink2); text-transform:uppercase; letter-spacing:.4px; }
.kpi-value { font-size:23px; font-weight:800; letter-spacing:-.5px; }
.kpi-value.neg { color:var(--red); }
.kpi-sub { font-size:12px; color:var(--ink2); margin-top:3px; }

/* Panels */
.cols { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.panel { background:var(--surface); border:1px solid var(--line); border-radius:var(--r);
  padding:18px; box-shadow:var(--shadow); }
.panel-head { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
.panel-head h2 { font-size:15px; font-weight:700; }
.panel-count { background:#eef1f6; color:var(--ink2); font-size:11.5px; font-weight:700;
  border-radius:10px; padding:2px 8px; }

/* Task rows (Monday board style) */
.task,.feed-item { display:flex; align-items:center; gap:12px; padding:11px 10px;
  border-radius:9px; animation:rise .3s ease both; position:relative; }
.task + .task,.feed-item + .feed-item { border-top:1px solid var(--line); }
.task:hover,.feed-item:hover { background:#f7f9fc; }
.rail { width:4px; align-self:stretch; border-radius:4px; flex:none; }
.task-n { font-size:15px; font-weight:800; color:#c3c8d4; min-width:16px; }
.task-body { flex:1; min-width:0; }
.task-title { font-size:13.5px; font-weight:600; line-height:1.35; }
.task-tags { font-size:12px; color:var(--ink2); margin-top:2px; overflow:hidden;
  text-overflow:ellipsis; white-space:nowrap; }
.pill { font-size:11px; font-weight:700; padding:3px 10px; border-radius:12px; flex:none; }
.pill-red { background:color-mix(in srgb,var(--red) 13%,white); color:var(--red); }
.pill-blue { background:color-mix(in srgb,var(--blue) 12%,white); color:var(--blue); }
.pill-green { background:color-mix(in srgb,var(--green) 14%,white); color:#00a25b; }
.feed-ic { width:34px; height:34px; border-radius:9px; display:grid; place-items:center;
  font-size:15px; flex:none; }
.feed-item.clickable { cursor:pointer; }
.chev { color:#c3c8d4; font-size:18px; }

/* Empty & skeleton */
.empty { padding:22px 12px; font-size:13px; color:var(--ink2); text-align:center; }
.empty.ok { color:#00a25b; font-weight:600; }
.empty.wide { grid-column:1/-1; background:var(--surface); border:1px dashed var(--line);
  border-radius:var(--r); }
.skeleton,.skeleton-row { background:linear-gradient(90deg,#eef1f6 25%,#f6f8fb 50%,#eef1f6 75%);
  background-size:200% 100%; animation:shimmer 1.2s infinite; border-radius:var(--r); }
.skeleton { height:92px; }
.skeleton-row { height:54px; margin-bottom:6px; border-radius:9px; }

/* Deep dives (existing dark tabs framed intentionally) */
.deepdive { animation:rise .25s ease both; }
.back { border:1px solid var(--line); background:var(--surface); border-radius:8px;
  padding:8px 14px; font:inherit; font-size:13px; font-weight:600; color:var(--ink2);
  cursor:pointer; margin-bottom:14px; }
.back:hover { color:var(--ink); }
.deepdive-dark { background:#0a0e17; border-radius:var(--r); padding:16px; box-shadow:var(--shadow); }

/* Chat */
.chat-fab { position:fixed; right:22px; bottom:22px; width:54px; height:54px; border-radius:50%;
  background:var(--blue); color:#fff; border:0; font-size:22px; cursor:pointer;
  box-shadow:0 6px 20px rgba(0,115,234,.4); transition:transform .15s; z-index:50; }
.chat-fab:hover { transform:scale(1.06); }
.chat-panel { position:fixed; right:18px; bottom:18px; width:min(380px,calc(100vw - 24px));
  height:min(520px,calc(100vh - 100px)); background:var(--surface); border-radius:16px;
  box-shadow:0 12px 48px rgba(30,40,70,.22); display:flex; flex-direction:column;
  z-index:60; animation:pop .2s ease; overflow:hidden; }
.chat-head { display:flex; justify-content:space-between; align-items:center;
  padding:14px 16px; background:var(--blue); color:#fff; }
.chat-title { font-weight:700; font-size:14.5px; }
.chat-sub { font-size:11.5px; opacity:.85; }
.chat-close { background:none; border:0; color:#fff; font-size:15px; cursor:pointer; opacity:.85; }
.chat-body { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:8px; }
.chat-suggestions p { font-size:12.5px; color:var(--ink2); margin-bottom:8px; }
.chip { display:block; width:100%; text-align:left; background:#f2f5fa; border:1px solid var(--line);
  border-radius:10px; padding:10px 12px; font:inherit; font-size:13px; color:var(--ink);
  cursor:pointer; margin-bottom:6px; transition:background .15s; }
.chip:hover { background:#e9eef7; }
.msg { max-width:85%; padding:9px 13px; border-radius:14px; font-size:13.5px; line-height:1.45;
  white-space:pre-wrap; animation:rise .2s ease; }
.msg.you { align-self:flex-end; background:var(--blue); color:#fff; border-bottom-right-radius:4px; }
.msg.fleet { align-self:flex-start; background:#f2f5fa; border-bottom-left-radius:4px; }
.thinking { display:flex; gap:4px; }
.thinking span { width:7px; height:7px; border-radius:50%; background:#b9c0cf;
  animation:bounce 1.2s infinite; }
.thinking span:nth-child(2){ animation-delay:.15s } .thinking span:nth-child(3){ animation-delay:.3s }
.chat-input { display:flex; gap:8px; padding:12px; border-top:1px solid var(--line); }
.chat-input input { flex:1; border:1px solid var(--line); border-radius:10px; padding:11px 13px;
  font:inherit; font-size:14px; outline:none; }
.chat-input input:focus { border-color:var(--blue); box-shadow:0 0 0 3px rgba(0,115,234,.12); }
.chat-input button { background:var(--blue); color:#fff; border:0; border-radius:10px;
  padding:0 16px; font-size:16px; cursor:pointer; }
.chat-input button:disabled { background:#b9c9e2; }

.done-btn { border:1px solid var(--line); background:var(--surface); color:var(--blue);
  font:inherit; font-size:12px; font-weight:700; border-radius:8px; padding:7px 12px;
  cursor:pointer; flex:none; transition:background .15s; }
.done-btn:hover { background:color-mix(in srgb,var(--blue) 8%,white); }
.done-btn.solid { background:var(--blue); color:#fff; border-color:var(--blue); }
.inc-input { width:100%; min-height:70px; border:1px solid var(--line); border-radius:10px;
  padding:10px 12px; font:inherit; font-size:13px; resize:vertical; outline:none; }
.inc-input:focus { border-color:var(--blue); box-shadow:0 0 0 3px rgba(0,115,234,.12); }
.inc-row { display:flex; gap:8px; margin:10px 0 14px; }
.inc-sev { flex:1; border:1px solid var(--line); border-radius:8px; padding:8px 10px;
  font:inherit; font-size:12.5px; background:var(--surface); }

/* Bottom nav (mobile) */
.bottomnav { display:none; }

@keyframes rise { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
@keyframes pop { from { opacity:0; transform:scale(.96) translateY(8px) } to { opacity:1; transform:none } }
@keyframes shimmer { to { background-position:-200% 0 } }
@keyframes bounce { 0%,60%,100% { transform:none } 30% { transform:translateY(-4px) } }
@media (prefers-reduced-motion:reduce){ *{ animation:none!important; transition:none!important } }

/* Mobile */
@media (max-width:820px){
  .sidebar { display:none; }
  .main { padding:18px 14px 130px; }
  .topbar h1 { font-size:20px; }
  .cols { grid-template-columns:1fr; }
  .kpis { grid-template-columns:repeat(2,1fr); gap:9px; }
  .kpi-value { font-size:19px; }
  .bottomnav { display:flex; position:fixed; bottom:0; left:0; right:0; background:var(--surface);
    border-top:1px solid var(--line); padding:6px 4px calc(6px + env(safe-area-inset-bottom));
    z-index:40; }
  .bn { flex:1; display:flex; flex-direction:column; align-items:center; gap:2px;
    background:none; border:0; font:inherit; font-size:17px; color:var(--ink2);
    cursor:pointer; padding:6px 0; }
  .bn span { font-size:10.5px; font-weight:600; }
  .bn.active { color:var(--blue); }
  .chat-fab { bottom:78px; }
  .chat-panel { bottom:70px; }
}
`
