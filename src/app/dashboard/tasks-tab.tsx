'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

interface Task {
  id: string; title: string; description: string; source: string; status: string
  priority: string; due_date: string | null; assigned_to: string; can_delegate: number
  delegated_to: string; committed_to: string; meeting_title: string
  completed_at: string | null; completion_note: string
  hold_reason: string; on_hold_at: string | null
  notes: string; notes_updated_at: string | null
  completed_date: string | null
}

interface TasksData {
  generatedAt: string
  todayTasks: Task[]; backlog: Task[]; overdue: Task[]; delegated: Task[]; completed: Task[]; onHold: Task[]
  completionRate7d: number; totalOpen: number; totalCompleted: number; totalBacklog: number
  joeCapacityToday: number; maxJoeCapacity: number; sources: Record<string,number>
}

const SOURCE_STYLE: Record<string,{bg:string;color:string;label:string}> = {
  email:    { bg:'rgba(0,181,165,0.12)',   color:'#00B5A5', label:'Email' },
  fireflies:{ bg:'rgba(99,102,241,0.15)',  color:'#a5b4fc', label:'Meeting' },
  plaud:    { bg:'rgba(245,158,11,0.15)',  color:'#fcd34d', label:'Voice' },
  manual:   { bg:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', label:'Manual' },
  hubspot:  { bg:'rgba(236,72,153,0.12)', color:'#ec4899', label:'CRM' },
}

const PRIORITY_COLOR: Record<string,string> = {
  '1': '#ef4444', '2': '#f59e0b', '3': '#22c55e', '4': '#6366f1',
}

function daysLabel(d: string | null) {
  if (!d) return null
  const diff = Math.floor((Date.now() - new Date(d+'T00:00:00').getTime()) / 86400000)
  if (diff < 0) return { text: `In ${Math.abs(diff)}d`, overdue: false }
  if (diff === 0) return { text: 'Today', overdue: false }
  if (diff === 1) return { text: 'Yesterday', overdue: true }
  return { text: `${diff}d ago`, overdue: true }
}

function daysAgo(d: string | null): number | null {
  if (!d) return null
  return Math.floor((Date.now() - new Date(d+'T00:00:00').getTime()) / 86400000)
}

function formatAEST(iso: string): string {
  return new Date(iso).toLocaleString('en-AU', { day:'numeric', month:'short', hour:'numeric', minute:'2-digit' })
}

function CapacityBar({ current, max, onStandby }: { current: number; max: number; onStandby: number }) {
  const pct = Math.min((current / max) * 100, 100)
  const color = pct >= 100 ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#00B5A5'
  const remaining = max - current
  return (
    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'1rem 1.25rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'0.5rem' }}>
        <span style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'rgba(255,255,255,0.4)' }}>Joe's Day</span>
        <span style={{ fontSize:'0.72rem', color, fontWeight:700 }}>
          {remaining > 0 ? `${remaining} free` : remaining < 0 ? `${Math.abs(remaining)} over` : 'At capacity'}
        </span>
      </div>
      <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:4, height:6, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, background:color, height:'100%', borderRadius:4, transition:'width 0.4s' }} />
      </div>
      <div style={{ display:'flex', gap:'1.5rem', marginTop:'0.5rem' }}>
        <span style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.3)' }}><span style={{ color:'#ef4444', fontWeight:700 }}>{current}</span> active</span>
        {onStandby > 0 && <span style={{ fontSize:'0.62rem', color:'rgba(245,158,11,0.6)' }}><span style={{ color:'#f59e0b', fontWeight:700 }}>{onStandby}</span> waiting</span>}
        <span style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.3)' }}><span style={{ color:'rgba(255,255,255,0.6)', fontWeight:700 }}>{Math.max(0, remaining)}</span> free</span>
      </div>
    </div>
  )
}

function SourceBadge({ source }: { source: string }) {
  const s = SOURCE_STYLE[source] || SOURCE_STYLE.manual
  return <span style={{ fontSize:'0.52rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase', background:s.bg, color:s.color, padding:'0.15rem 0.4rem', borderRadius:3 }}>{s.label}</span>
}

function WaitingModal({ task, onSave, onCancel }: { task: Task; onSave: (reason: string)=>void; onCancel: ()=>void }) {
  const [reason, setReason] = useState(task.hold_reason || '')
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'1rem' }}>
      <div style={{ background:'#141414', border:'1px solid rgba(245,158,11,0.35)', borderRadius:10, padding:'1.75rem', maxWidth:480, width:'100%' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:'#f59e0b', flexShrink:0 }} />
          <span style={{ fontSize:'0.7rem', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'#f59e0b' }}>Waiting</span>
        </div>
        <p style={{ color:'white', fontWeight:600, fontSize:'0.88rem', margin:'0 0 0.5rem', lineHeight:1.4 }}>{task.title}</p>
        <textarea value={reason} onChange={e=>setReason(e.target.value)}
          placeholder='Who are you waiting on? Eg. "Luke from Colliers — waiting on floor plans"'
          rows={3} autoFocus
          style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:6, padding:'0.6rem 0.8rem', color:'white', fontSize:'0.78rem', fontFamily:'inherit', width:'100%', resize:'vertical', outline:'none', lineHeight:1.5 }}
        />
        <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.75rem' }}>
          <button onClick={() => reason.trim() ? onSave(reason.trim()) : null} disabled={!reason.trim()}
            style={{ background: reason.trim() ? '#f59e0b' : 'rgba(245,158,11,0.2)', border:'none', borderRadius:4, padding:'0.5rem 1.2rem', cursor: reason.trim() ? 'pointer' : 'not-allowed', color: reason.trim() ? '#111' : 'rgba(245,158,11,0.4)', fontFamily:'inherit', fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>
            Mark Waiting
          </button>
          <button onClick={onCancel} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem 1rem', cursor:'pointer', color:'rgba(255,255,255,0.4)', fontFamily:'inherit', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function NotesSection({ task, onSave }: { task: Task; onSave: (notes: string)=>void }) {
  const [editing, setEditing] = useState(!task.notes)
  const [value, setValue] = useState(task.notes || '')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleChange = (v: string) => {
    setValue(v)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => onSave(v), 1200)
  }
  if (!editing && !task.notes) {
    return <button onClick={()=>setEditing(true)} style={{ background:'rgba(0,181,165,0.07)', border:'1px dashed rgba(0,181,165,0.25)', borderRadius:4, padding:'0.5rem 0.75rem', cursor:'pointer', color:'rgba(0,181,165,0.5)', fontFamily:'inherit', fontSize:'0.68rem', textAlign:'left', lineHeight:1.5 }}>+ Add notes</button>
  }
  if (!editing && task.notes) {
    return (
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.3rem' }}>
          <span style={{ fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(0,181,165,0.5)' }}>Notes</span>
          <button onClick={()=>setEditing(true)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(0,181,165,0.4)', fontSize:'0.6rem', fontFamily:'inherit' }}>Edit</button>
        </div>
        <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', lineHeight:1.6, whiteSpace:'pre-wrap' }}>{task.notes}</div>
        {task.notes_updated_at && <div style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.2)', marginTop:'0.25rem' }}>Updated {formatAEST(task.notes_updated_at)}</div>}
      </div>
    )
  }
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.3rem' }}>
        <span style={{ fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(0,181,165,0.5)' }}>Notes</span>
      </div>
      <textarea value={value} onChange={e=>handleChange(e.target.value)}
        onBlur={() => { if (!value.trim()) setEditing(false) }}
        placeholder='Add notes — context, decisions, next steps... (auto-saves after 1.2s)'
        rows={3} autoFocus
        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(0,181,165,0.2)', borderRadius:4, padding:'0.5rem 0.6rem', color:'white', fontSize:'0.72rem', fontFamily:'inherit', width:'100%', resize:'vertical', outline:'none', lineHeight:1.55, minHeight:64 }}
      />
    </div>
  )
}
function TaskCard({ task, onComplete, onStandby, onUnstandby, onDelegate, onSaveNotes, expanded, onToggle }: {
  task: Task; onComplete: ()=>void; onStandby: ()=>void; onUnstandby: ()=>void
  onDelegate?: ()=>void; onSaveNotes: (notes: string)=>void
  expanded: boolean; onToggle: ()=>void
}) {
  const dl = daysLabel(task.due_date)
  const prioColor = PRIORITY_COLOR[task.priority] || 'rgba(255,255,255,0.3)'
  const isStandby = task.status === 'standby'
  const isDelegated = task.status === 'delegated' && !!task.delegated_to
  const hasNotes = !!(task.notes && task.notes.trim())
  return (
    <div onClick={onToggle} style={{
      background: isStandby ? 'rgba(245,158,11,0.04)' : expanded ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isStandby ? 'rgba(245,158,11,0.25)' : expanded ? 'rgba(0,181,165,0.3)' : 'rgba(255,255,255,0.07)'}`, 
      borderRadius: 6, padding: '0.875rem 1rem', cursor:'pointer', transition:'all 0.15s', marginBottom: '0.5rem',
      opacity: task.status === 'completed' ? 0.45 : 1
    }}>
      <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background: isStandby ? '#f59e0b' : prioColor, marginTop:6, flexShrink:0 }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', justifyContent:'space-between' }}>
            <div style={{ fontSize:'0.82rem', color:'white', fontWeight:600, lineHeight:1.35, flex:1 }}>{task.title}</div>
            {isStandby && task.hold_reason && (
              <span style={{ fontSize:'0.5rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase', background:'rgba(245,158,11,0.15)', color:'#f59e0b', padding:'0.15rem 0.4rem', borderRadius:3, flexShrink:0, maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={task.hold_reason}>
                Waiting: {task.hold_reason}
              </span>
            )}
          </div>
          <div style={{ display:'flex', gap:'0.45rem', marginTop:'0.4rem', flexWrap:'wrap', alignItems:'center' }}>
            <SourceBadge source={task.source} />
            {hasNotes && <span style={{ fontSize:'0.52rem', fontWeight:700, background:'rgba(0,181,165,0.1)', color:'#00B5A5', padding:'0.15rem 0.4rem', borderRadius:3, letterSpacing:'0.06em', textTransform:'uppercase' }}>Notes</span>}
            {isDelegated && <span style={{ fontSize:'0.52rem', fontWeight:700, background:'rgba(99,102,241,0.15)', color:'#a5b4fc', padding:'0.15rem 0.4rem', borderRadius:3, letterSpacing:'0.06em', textTransform:'uppercase' }}>Delegated</span>}
            {dl && <span style={{ fontSize:'0.6rem', color: dl.overdue ? '#ef4444' : 'rgba(255,255,255,0.35)' }}>{dl.text}</span>}
            {task.meeting_title && <span style={{ fontSize:'0.6rem', color:'rgba(99,102,241,0.6)', fontStyle:'italic' }}>{task.meeting_title}</span>}
          </div>
          {expanded && (
            <div style={{ marginTop:'0.75rem', display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {task.description && <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', lineHeight:1.55, borderLeft:'2px solid rgba(255,255,255,0.1)', paddingLeft:'0.7rem' }}>{task.description.slice(0,350)}{task.description.length > 350 ? '...' : ''}</div>}
              {task.committed_to && <div style={{ fontSize:'0.7rem', color:'rgba(0,181,165,0.65)', fontStyle:'italic', borderLeft:'2px solid rgba(0,181,165,0.25)', paddingLeft:'0.7rem', lineHeight:1.5 }}>"{task.committed_to.slice(0,200)}{task.committed_to.length > 200 ? '...' : ''}"</div>}
              {isStandby && task.hold_reason && <div style={{ fontSize:'0.7rem', color:'rgba(245,158,11,0.8)', borderLeft:'2px solid rgba(245,158,11,0.4)', paddingLeft:'0.7rem', lineHeight:1.5 }}>Waiting: {task.hold_reason}</div>}
              {task.completion_note && <div style={{ fontSize:'0.68rem', color:'rgba(34,197,94,0.6)', borderLeft:'2px solid rgba(34,197,94,0.3)', paddingLeft:'0.7rem' }}>Done: {task.completion_note}</div>}
              {task.completed_date && <div style={{ fontSize:'0.68rem', color:'rgba(34,197,94,0.5)' }}>Completed {formatAEST(task.completed_date)}</div>}
              <NotesSection task={task} onSave={onSaveNotes} />
            </div>
          )}
        </div>
        {task.status !== 'completed' && (
          <div style={{ display:'flex', gap:'0.35rem', flexShrink:0, alignItems:'center' }} onClick={e=>e.stopPropagation()}>
            {onDelegate && task.can_delegate && <button onClick={onDelegate} style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:3, padding:'0.3rem 0.55rem', color:'#a5b4fc', fontSize:'0.55rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.05em', textTransform:'uppercase' }}>Del</button>}
            {!isStandby && <button onClick={onStandby} style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:3, padding:'0.3rem 0.55rem', color:'#f59e0b', fontSize:'0.55rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.05em', textTransform:'uppercase' }}>Wait</button>}
            {isStandby && <button onClick={onUnstandby} style={{ background:'rgba(0,181,165,0.1)', border:'1px solid rgba(0,181,165,0.25)', borderRadius:3, padding:'0.3rem 0.55rem', color:'#00B5A5', fontSize:'0.55rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.05em', textTransform:'uppercase' }}>Resume</button>}
            <button onClick={onComplete} style={{ background:'#22c55e', border:'none', borderRadius:3, padding:'0.3rem 0.7rem', color:'white', fontSize:'0.55rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.05em', textTransform:'uppercase' }}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatsBar({ data }: { data: TasksData }) {
  const stats = [
    { label:'Today',   val: data.todayTasks.length, sub:`of ${data.maxJoeCapacity} cap`, color: data.todayTasks.length > data.maxJoeCapacity ? '#ef4444' : '#00B5A5' },
    { label:'Overdue', val: data.overdue.length,      sub: data.overdue.length > 0 ? 'act now' : 'all clear', color: data.overdue.length > 0 ? '#ef4444' : '#22c55e' },
    { label:'Waiting', val: data.onHold.length,        sub: data.onHold.length > 0 ? 'paused' : 'none', color: data.onHold.length > 0 ? '#f59e0b' : 'rgba(255,255,255,0.3)' },
    { label:'Done',    val: data.totalCompleted,        sub:`${Math.round(data.completionRate7d)}% 7d rate`, color:'#22c55e' },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem' }}>
      {stats.map(s => (
        <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, padding:'0.875rem', textAlign:'center' }}>
          <div style={{ fontSize:'1.5rem', fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
          <div style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.35)', margin:'0.3rem 0 0.15rem' }}>{s.label}</div>
          <div style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.2)' }}>{s.sub}</div>
        </div>
      ))}
    </div>
  )
}

type TabId = 'today' | 'overdue' | 'standby' | 'delegated' | 'backlog' | 'done'

export default function TasksTab() {
  const [data, setData] = useState<TasksData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabId>('overdue')
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [delegateFor, setDelegateFor] = useState<Task | null>(null)
  const [standbyFor, setStandbyFor] = useState<Task | null>(null)
  const [addingTask, setAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({ title:'', due_date:'', priority:'2', source:'manual', description:'' })

  const [loadKey, setLoadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/tasks-data',{cache:'no-store'}).then(async r => { if (!r.ok) throw new Error('load '+r.status); const d = await r.json(); if (!d || typeof (d as any).totalOpen === 'undefined') throw new Error('bad payload');
      if (!cancelled) { setData(d as TasksData); setLoading(false) }
    }).catch(() => { if (!cancelled) { setLoading(false) /* keep last data on failed load */ } })
    return () => { cancelled = true }
  }, [loadKey])

  const load = useCallback(() => setLoadKey(k => k + 1), [])

  const apiAction = async (taskId: string, action: string, extra: Record<string, unknown> = {}) => {
    // Optimistic UI: reflect the change instantly, reconcile with server after
    const snapshot = data
    if (data && ['complete','delegate','standby'].includes(action)) {
      const strip = (arr?: Task[]) => (arr || []).filter(t => t.id !== taskId)
      const moved = [...(data.todayTasks||[]), ...(data.backlog||[]), ...(data.overdue||[])].find(t => t.id === taskId)
      setData({
        ...data,
        todayTasks: strip(data.todayTasks),
        backlog: strip(data.backlog),
        overdue: strip(data.overdue),
        completed: action === 'complete' && moved ? [{ ...moved, status: 'completed' }, ...(data.completed||[])] : data.completed,
        totalOpen: Math.max(0, (data.totalOpen||0) - (moved ? 1 : 0)),
      })
    }
    try {
      const res = await fetch('/api/tasks-data', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ taskId, action, ...extra }),
      })
      if (res.ok) { load() } else if (snapshot) { setData(snapshot) }
    } catch { if (snapshot) setData(snapshot) }
  }

  const complete = (taskId: string, note?: string) => {
    apiAction(taskId, 'complete', { completionNote: note || '' })
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    await fetch('/api/tasks-data', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'create', ...newTask })})
    setNewTask({ title:'', due_date:'', priority:'2', source:'manual', description:'' })
    setAddingTask(false)
    load()
  }

  const tabTasks = (): Task[] => {
    if (!data) return []
    switch (tab) {
      case 'today':     return data.todayTasks
      case 'overdue':   return data.overdue
      case 'standby':   return data.onHold
      case 'delegated': return data.delegated
      case 'backlog':   return data.backlog
      case 'done':      return data.completed
    }
  }

  const filtered = filter
    ? tabTasks().filter(t =>
        t.title.toLowerCase().includes(filter.toLowerCase()) ||
        (t.description||'').toLowerCase().includes(filter.toLowerCase()) ||
        (t.committed_to||'').toLowerCase().includes(filter.toLowerCase()) ||
        (t.notes||'').toLowerCase().includes(filter.toLowerCase()) ||
        (t.hold_reason||'').toLowerCase().includes(filter.toLowerCase())
      )
    : tabTasks()

  const sorted = tab === 'overdue'
    ? [...filtered].sort((a,b) => (daysAgo(b.due_date)??9999) - (daysAgo(a.due_date)??9999))
    : tab === 'done'
    ? [...filtered].sort((a,b) => (b.completed_date||'') > (a.completed_date||'') ? 1 : -1)
    : filtered

  const tabs: { id: TabId; count: number | undefined }[] = [
    { id:'today',     count: data?.todayTasks.length },
    { id:'overdue',   count: data?.overdue.length },
    { id:'standby',   count: data?.onHold.length },
    { id:'delegated', count: data?.delegated.length },
    { id:'backlog',   count: data?.backlog.length },
    { id:'done',      count: data?.completed.length },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', margin:0 }}>Tasks</p>
          <p style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.65rem', margin:'0.2rem 0 0' }}>Inbox · meetings · voice · AI — sorted by what matters most</p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <button onClick={()=>setAddingTask(true)} style={{ background:'#00B5A5', border:'none', padding:'0.4rem 0.9rem', cursor:'pointer', fontFamily:'inherit', fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'white', borderRadius:4 }}>+ Add</button>
          <button onClick={load} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', padding:'0.4rem 0.8rem', cursor:'pointer', fontFamily:'inherit', fontSize:'0.62rem', color:'rgba(255,255,255,0.4)', borderRadius:4 }}>Refresh</button>
        </div>
      </div>

      {data && <CapacityBar current={data.todayTasks.length} max={data.maxJoeCapacity} onStandby={data.onHold.length} />}
      {!loading && data && <StatsBar data={data} />}

      {addingTask && (
        <form onSubmit={addTask} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(0,181,165,0.25)', borderRadius:8, padding:'1.25rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:'0.5rem', marginBottom:'0.75rem' }}>
            <input value={newTask.title} onChange={e=>setNewTask(t=>({...t,title:e.target.value}))} placeholder='Task title...' required
              style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem 0.75rem', color:'white', fontSize:'0.8rem', fontFamily:'inherit', flex:1 }} />
            <input value={newTask.due_date} onChange={e=>setNewTask(t=>({...t,due_date:e.target.value}))} type='date'
              style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem 0.5rem', color:'white', fontSize:'0.75rem', fontFamily:'inherit' }} />
            <select value={newTask.priority} onChange={e=>setNewTask(t=>({...t,priority:e.target.value}))}
              style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem', color:'white', fontSize:'0.75rem', fontFamily:'inherit' }}>
              <option value='1'>High</option><option value='2'>Medium</option><option value='3'>Low</option>
            </select>
          </div>
          <textarea value={newTask.description} onChange={e=>setNewTask(t=>({...t,description:e.target.value}))} placeholder='Notes (optional)...'
            rows={2} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem 0.75rem', color:'white', fontSize:'0.75rem', fontFamily:'inherit', width:'100%', resize:'vertical', marginBottom:'0.75rem' }} />
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <button type='submit' style={{ background:'#00B5A5', border:'none', padding:'0.5rem 1.2rem', cursor:'pointer', color:'white', fontFamily:'inherit', fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4 }}>Save Task</button>
            <button type='button' onClick={()=>setAddingTask(false)} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', padding:'0.5rem 1rem', cursor:'pointer', color:'rgba(255,255,255,0.4)', fontFamily:'inherit', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4 }}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>{ setTab(t.id); setExpanded(null) }} style={{
            background: tab === t.id ? 'rgba(0,181,165,0.15)' : 'rgba(255,255,255,0.04)',
            border: tab === t.id ? '1px solid rgba(0,181,165,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: tab === t.id ? '#00B5A5' : 'rgba(255,255,255,0.5)',
            padding:'0.4rem 0.9rem', borderRadius:4, cursor:'pointer', fontFamily:'inherit',
            fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase'
          }}>{t.id} {t.count !== undefined ? `(${t.count})` : ''}</button>
        ))}
        <div style={{ flex:1 }} />
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder='Filter tasks...'
          style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, padding:'0.4rem 0.75rem', color:'rgba(255,255,255,0.7)', fontSize:'0.72rem', fontFamily:'inherit', width:160, outline:'none' }} />
      </div>

      {loading && <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.3)', fontSize:'0.85rem' }}>Loading...</div>}
      {!loading && sorted.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.25)' }}>
          <p style={{ fontSize:'0.85rem', marginBottom:'0.75rem' }}>No {tab} tasks.</p>
        </div>
      )}
      {!loading && sorted.length > 0 && sorted.map(task => (
        <TaskCard key={task.id} task={task} expanded={expanded === task.id}
          onToggle={() => setExpanded(expanded === task.id ? null : task.id)}
          onComplete={() => complete(task.id)}
          onStandby={() => setStandbyFor(task)}
          onUnstandby={() => apiAction(task.id, 'unstandby')}
          onDelegate={task.can_delegate ? () => setDelegateFor(task) : undefined}
          onSaveNotes={(notes) => apiAction(task.id, 'save-notes', { completionNote: notes })}
        />
      ))}

      {standbyFor && (
        <WaitingModal
          task={standbyFor}
          onSave={(reason) => {
            apiAction(standbyFor.id, 'standby', { holdReason: reason })
            setStandbyFor(null)
          }}
          onCancel={() => setStandbyFor(null)}
        />
      )}

      {delegateFor && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'1rem' }}>
          <div style={{ background:'#141414', border:'1px solid rgba(99,102,241,0.35)', borderRadius:10, padding:'1.75rem', maxWidth:480, width:'100%' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:'#a5b4fc', flexShrink:0 }} />
              <span style={{ fontSize:'0.7rem', fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'#a5b4fc' }}>Delegate</span>
            </div>
            <p style={{ color:'white', fontWeight:600, fontSize:'0.88rem', margin:'0 0 0.5rem', lineHeight:1.4 }}>{delegateFor.title}</p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem', margin:'0 0 1rem' }}>Select an agent to hand this task to. A follow-up reminder will be created to check in.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1rem' }}>
              {[{id:'inbox-ea',label:'Inbox EA',desc:'Email follow-ups, scheduling, admin'}, {id:'hubspot-revops',label:'HubSpot RevOps',desc:'Quotes, proposals, CRM'}, {id:'finance',label:'Finance',desc:'Invoices, payments, Xero'}, {id:'cleaning-bdm',label:'Cleaning BDM',desc:'Cleaning leads and proposals'}, {id:'chief-of-staff',label:'Chief of Staff',desc:'Coordination, research'}].map(a => (
                <button key={a.id} onClick={() => { apiAction(delegateFor.id, 'delegate', { agentId: a.id }); setDelegateFor(null) }}
                  style={{ background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:6, padding:'0.75rem 1rem', cursor:'pointer', textAlign:'left' }}>
                  <div style={{ fontSize:'0.78rem', fontWeight:700, color:'white', marginBottom:'0.2rem' }}>{a.label}</div>
                  <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)' }}>{a.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>setDelegateFor(null)} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem 1rem', cursor:'pointer', color:'rgba(255,255,255,0.4)', fontFamily:'inherit', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  )
}
