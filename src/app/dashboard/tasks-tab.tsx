'use client'
import { useState, useEffect, useCallback } from 'react'

interface Task {
  id: string; title: string; description: string; source: string; source_id: string
  status: string; priority: string; due_date: string|null; due_time: string|null
  assigned_to: string; revenue_value: number|null; client_name: string; client_id: string
  can_delegate: number; raw_commitment: string; tags: string; completed_at: string|null
  created_at: string; updated_at: string
}

interface TasksData {
  generatedAt: string; todayTasks: Task[]; backlog: Task[]; overdue: Task[]
  delegated: Task[]; completed: Task[]; completionRate7d: number; totalOpen: number
  totalCompleted: number; totalBacklog: number; maxJoeCapacity: number; sources: Record<string,number>; error?: string
}

const SOURCE_STYLE: Record<string,{bg:string;color:string;label:string}> = {
  email:    {bg:'rgba(0,181,165,0.12)',   color:'#00B5A5', label:'Email'},
  fireflies:{bg:'rgba(99,102,241,0.15)',  color:'#a5b4fc', label:'Meeting'},
  plaud:    {bg:'rgba(245,158,11,0.15)',  color:'#fcd34d', label:'Voice'},
  manual:   {bg:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', label:'Manual'},
  hubspot:  {bg:'rgba(236,72,153,0.12)', color:'#ec4899', label:'HubSpot'},
}

const PRIORITY_COLOR: Record<string,string> = {
  '1': '#ef4444', high: '#ef4444',
  '2': '#f59e0b', medium: '#f59e0b',
  '3': '#22c55e', low: '#22c55e',
  '4': '#6366f1',
}

function daysLabel(d: string|null) {
  if (!d) return null
  const diff = Math.floor((Date.now() - new Date(d+'T00:00:00').getTime()) / 86400000)
  if (diff < 0) return { text: `In ${Math.abs(diff)}d`, overdue: false }
  if (diff === 0) return { text: 'Today', overdue: false }
  if (diff === 1) return { text: 'Yesterday', overdue: true }
  return { text: `${diff}d ago`, overdue: true }
}

function Tag({ label, bg, color }: { label: string; bg: string; color: string }) {
  return <span style={{ fontSize:'0.58rem', background:bg, color, padding:'0.15rem 0.45rem', borderRadius:3, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</span>
}

function TaskCard({ task, onComplete, onDelegate, expanded, onToggle }: {
  task: Task; onComplete: ()=>void; onDelegate?: ()=>void; expanded: boolean; onToggle: ()=>void
}) {
  const src = SOURCE_STYLE[task.source] || SOURCE_STYLE.manual
  const dl = daysLabel(task.due_date)
  const prioColor = PRIORITY_COLOR[task.priority] || 'rgba(255,255,255,0.3)'

  return (
    <div onClick={onToggle} style={{
      background: expanded ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${expanded ? 'rgba(0,181,165,0.3)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 6, padding: '0.875rem 1rem', cursor:'pointer', transition:'all 0.15s', marginBottom: '0.5rem'
    }}>
      <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background: prioColor, marginTop:6, flexShrink:0 }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:'0.82rem', color:'white', fontWeight:600, lineHeight:1.3 }}>{task.title}</div>
          <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.4rem', flexWrap:'wrap', alignItems:'center' }}>
            <Tag label={src.label} bg={src.bg} color={src.color} />
            {task.client_name && <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.4)' }}>{task.client_name}</span>}
            {task.revenue_value && task.revenue_value > 0 && (
              <span style={{ fontSize:'0.6rem', background:'rgba(34,197,94,0.12)', color:'#22c55e', padding:'0.1rem 0.4rem', borderRadius:3, fontWeight:700 }}>
                ${task.revenue_value.toLocaleString()}
              </span>
            )}
            {dl && (
              <span style={{ fontSize:'0.6rem', color: dl.overdue ? '#ef4444' : 'rgba(255,255,255,0.3)' }}>
                {dl.text}
              </span>
            )}
          </div>
          {expanded && task.description && (
            <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', marginTop:'0.5rem', lineHeight:1.5, borderLeft:'2px solid rgba(255,255,255,0.1)', paddingLeft:'0.6rem' }}>
              {task.description.slice(0,300)}
            </div>
          )}
          {expanded && task.raw_commitment && (
            <div style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.3)', marginTop:'0.4rem', fontStyle:'italic', borderLeft:'2px solid rgba(0,181,165,0.25)', paddingLeft:'0.6rem' }}>
              "{task.raw_commitment.slice(0,150)}{task.raw_commitment.length > 150 ? '...' : ''}"
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:'0.4rem', flexShrink:0 }} onClick={e=>e.stopPropagation()}>
          {onDelegate && <button onClick={onDelegate} style={{ background:'rgba(0,181,165,0.1)', border:'1px solid rgba(0,181,165,0.25)', borderRadius:3, padding:'0.25rem 0.6rem', color:'#00B5A5', fontSize:'0.58rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase' }}>Del</button>}
          <button onClick={onComplete} style={{ background:'#22c55e', border:'none', borderRadius:3, padding:'0.25rem 0.75rem', color:'white', fontSize:'0.58rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.06em', textTransform:'uppercase' }}>✓ Done</button>
        </div>
      </div>
    </div>
  )
}

export default function TasksTab() {
  const [data, setData] = useState<TasksData|null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'today'|'overdue'|'backlog'|'done'>('today')
  const [filter, setFilter] = useState('')
  const [expanded, setExpanded] = useState<string|null>(null)
  const [delegateFor, setDelegateFor] = useState<Task|null>(null)
  const [addingTask, setAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({ title:'', due_date:'', priority:'2', source:'manual', description:'' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tasks-data')
      const d = await res.json() as TasksData
      setData(d)
    } catch { setData(null) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const complete = async (taskId: string) => {
    await fetch('/api/tasks-data', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ taskId, action:'complete' })})
    load()
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    await fetch('/api/tasks-data', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'create', ...newTask })})
    setNewTask({ title:'', due_date:'', priority:'2', source:'manual', description:'' })
    setAddingTask(false)
    load()
  }

  const allTasks = tab === 'today' ? (data?.todayTasks || []) : tab === 'overdue' ? (data?.overdue || []) : tab === 'backlog' ? (data?.backlog || []) : (data?.completed || [])
  const filtered = filter ? allTasks.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()) || t.client_name.toLowerCase().includes(filter.toLowerCase())) : allTasks

  const stats = data ? [
    { label:'Today',     val: data.todayTasks.length,   sub:`${data.maxJoeCapacity} cap`,    color: data.todayTasks.length > data.maxJoeCapacity ? '#ef4444' : '#00B5A5' },
    { label:'Overdue',   val: data.overdue.length,        sub: data.overdue.length > 0 ? 'act now' : 'all clear', color: data.overdue.length > 0 ? '#ef4444' : '#22c55e' },
    { label:'Backlog',   val: data.totalBacklog,          sub:'scheduled',                    color:'rgba(255,255,255,0.5)' },
    { label:'Completed', val: data.totalCompleted,        sub:`${data.completionRate7d}% 7d rate`, color:'#22c55e' },
  ] : []

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      {/* HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', margin:0 }}>Task Command Centre</p>
          <p style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.65rem', margin:'0.2rem 0 0' }}>MS To Do · emails · meetings · voice · AI prioritised</p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <button onClick={()=>setAddingTask(true)} style={{ background:'#00B5A5', border:'none', padding:'0.4rem 0.9rem', cursor:'pointer', fontFamily:'inherit', fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'white', borderRadius:4 }}>+ Add Task</button>
          <button onClick={load} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', padding:'0.4rem 0.8rem', cursor:'pointer', fontFamily:'inherit', fontSize:'0.62rem', color:'rgba(255,255,255,0.4)', borderRadius:4 }}>Refresh</button>
        </div>
      </div>

      {/* STATS ROW */}
      {stats.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, padding:'0.875rem', textAlign:'center' }}>
              <div style={{ fontSize:'1.5rem', fontWeight:900, color:s.color, lineHeight:1 }}>{s.val}</div>
              <div style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.35)', margin:'0.3rem 0 0.15rem' }}>{s.label}</div>
              <div style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.2)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* ADD TASK FORM */}
      {addingTask && (
        <form onSubmit={addTask} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(0,181,165,0.25)', borderRadius:8, padding:'1.25rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:'0.5rem', marginBottom:'0.75rem' }}>
            <input value={newTask.title} onChange={e=>setNewTask(t=>({...t,title:e.target.value}))} placeholder='Task title...' required style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem 0.75rem', color:'white', fontSize:'0.8rem', fontFamily:'inherit', flex:1 }} />
            <input value={newTask.due_date} onChange={e=>setNewTask(t=>({...t,due_date:e.target.value}))} type='date' style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem 0.5rem', color:'white', fontSize:'0.75rem', fontFamily:'inherit' }} />
            <select value={newTask.priority} onChange={e=>setNewTask(t=>({...t,priority:e.target.value}))} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem', color:'white', fontSize:'0.75rem', fontFamily:'inherit' }}>
              <option value='1'>High</option><option value='2'>Medium</option><option value='3'>Low</option>
            </select>
          </div>
          <textarea value={newTask.description} onChange={e=>setNewTask(t=>({...t,description:e.target.value}))} placeholder='Notes (optional)...' rows={2} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'0.5rem 0.75rem', color:'white', fontSize:'0.75rem', fontFamily:'inherit', width:'100%', resize:'vertical', marginBottom:'0.75rem' }} />
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <button type='submit' style={{ background:'#00B5A5', border:'none', padding:'0.5rem 1.2rem', cursor:'pointer', color:'white', fontFamily:'inherit', fontWeight:700, fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4 }}>Save Task</button>
            <button type='button' onClick={()=>setAddingTask(false)} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', padding:'0.5rem 1rem', cursor:'pointer', color:'rgba(255,255,255,0.4)', fontFamily:'inherit', fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', borderRadius:4 }}>Cancel</button>
          </div>
        </form>
      )}

      {/* TAB + FILTER */}
      <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap' }}>
        {(['today','overdue','backlog','done'] as const).map(t => {
          const count = t === 'today' ? data?.todayTasks.length : t === 'overdue' ? data?.overdue.length : t === 'backlog' ? data?.backlog.length : data?.completed.length
          return (
            <button key={t} onClick={()=>setTab(t)} style={{
              background: tab === t ? 'rgba(0,181,165,0.15)' : 'rgba(255,255,255,0.04)',
              border: tab === t ? '1px solid rgba(0,181,165,0.4)' : '1px solid rgba(255,255,255,0.08)',
              color: tab === t ? '#00B5A5' : 'rgba(255,255,255,0.5)',
              padding:'0.4rem 0.9rem', borderRadius:4, cursor:'pointer', fontFamily:'inherit',
              fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase'
            }}>
              {t.charAt(0).toUpperCase()+t.slice(1)} {count !== undefined ? `(${count})` : ''}
            </button>
          )
        })}
        <div style={{ flex:1 }} />
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder='Filter tasks...' style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, padding:'0.4rem 0.75rem', color:'rgba(255,255,255,0.7)', fontSize:'0.72rem', fontFamily:'inherit', width:180, outline:'none' }} />
      </div>

      {/* TASK LIST */}
      {loading && <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.3)', fontSize:'0.85rem' }}>Loading...</div>}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.25)' }}>
          <p style={{ fontSize:'0.85rem', marginBottom:'0.75rem' }}>No {tab} tasks.</p>
          {tab === 'done' && <button onClick={()=>setAddingTask(true)} style={{ background:'#00B5A5', border:'none', padding:'0.5rem 1.2rem', cursor:'pointer', color:'white', fontFamily:'inherit', fontWeight:700, fontSize:'0.7rem', borderRadius:4 }}>+ Add First Task</button>}
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div>
          {filtered.map(task => (
            <TaskCard key={task.id} task={task} expanded={expanded === task.id}
              onToggle={() => setExpanded(expanded === task.id ? null : task.id)}
              onComplete={() => complete(task.id)}
              onDelegate={task.can_delegate ? () => setDelegateFor(task) : undefined}
            />
          ))}
        </div>
      )}

      {/* DELEGATE MODAL */}
      {delegateFor && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }}>
          <div style={{ background:'#111', border:'1px solid rgba(0,181,165,0.3)', borderRadius:8, padding:'1.75rem', maxWidth:420, width:'100%' }}>
            <p style={{ color:'white', fontWeight:700, fontSize:'0.9rem', margin:'0 0 0.3rem' }}>Delegate Task</p>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem', margin:'0 0 1.25rem', lineHeight:1.5 }}>{delegateFor.title}</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', marginBottom:'1rem' }}>
              {[
                { id:'inbox-ea', label:'Inbox EA', desc:'Email follow-ups, scheduling, admin' },
                { id:'hubspot-revops', label:'HubSpot RevOps', desc:'Quotes, proposals, CRM' },
                { id:'finance', label:'Finance', desc:'Invoices, payments, Xero' },
                { id:'cleaning-bdm', label:'Cleaning BDM', desc:'Cleaning leads and proposals' },
                { id:'chief-of-staff', label:'Chief of Staff', desc:'Coordination, research' },
              ].map(a => (
                <button key={a.id} onClick={async () => {
                  await fetch('/api/tasks-data', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ taskId: delegateFor.id, action:'delegate', agent:a.id })})
                  setDelegateFor(null); load()
                }} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, padding:'0.75rem 1rem', textAlign:'left', cursor:'pointer', color:'white', fontFamily:'inherit' }}>
                  <div style={{ fontSize:'0.8rem', fontWeight:600 }}>{a.label}</div>
                  <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', marginTop:'0.1rem' }}>{a.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>setDelegateFor(null)} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:4, padding:'0.5rem 1rem', color:'rgba(255,255,255,0.4)', fontSize:'0.72rem', cursor:'pointer', width:'100%', fontFamily:'inherit' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
