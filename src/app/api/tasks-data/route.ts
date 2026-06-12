import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

/**
 * GET  /api/tasks-data  — reads tasks from Upstash Redis
 * POST /api/tasks-data  — create/complete/delegate/standby/unstandby tasks
 *
 * Data model:
 *   tasks:v1            — all active tasks (manual + Inbox EA)
 *   tasks:completed:v1  — last 100 completed tasks
 *   tasks:standby:v1    — tasks on hold/standby
 *   yos:tasks:summary    — Inbox EA writes Microsoft To Do tasks here (primary source)
 *
 * All mutations write to tasks:v1 AND rebuild yos:tasks:summary
 * so the dashboard stays fresh without waiting for Inbox EA's next sync.
 */

const UPSTASH_URL    = process.env.UPSTASH_REDIS_REST_URL    || ''
const UPSTASH_TOKEN  = process.env.UPSTASH_REDIS_REST_TOKEN  || ''
const TASKS_KEY      = 'tasks:v1'
const SUMMARY_KEY    = 'yos:tasks:summary'
const COMPLETED_KEY  = 'tasks:completed:v1'
const STANDBY_KEY    = 'tasks:standby:v1'

// ---------------------------------------------------------------------------
// Redis helpers
// ---------------------------------------------------------------------------
async function redisGet(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  const r = await fetch(`${UPSTASH_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  })
  if (!r.ok) return null
  const d = await r.json() as { result?: unknown }
  return (d.result as string) ?? null
}

async function redisSet(key: string, value: string): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return
  await fetch(`${UPSTASH_URL}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  })
}

async function redisDel(key: string): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return
  await fetch(`${UPSTASH_URL}/del/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ keys: [key] }),
  })
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Task {
  id: string; title: string; description: string; source: string; status: string
  priority: string; due_date: string | null; due_time: string | null
  assigned_to: string; revenue_value: number | null; client_name: string; client_id: string
  can_delegate: number; raw_commitment: string; tags: string
  completed_at: string | null; completed_date: string | null
  created_at: string; updated_at: string
  // extra fields
  committed_to: string; meeting_title: string; completion_note: string
  delegated_to: string; hold_reason: string; on_hold_at: string | null
  notes: string; notes_updated_at: string | null
}

interface TasksData {
  generatedAt: string
  todayTasks: Task[]; overdue: Task[]; backlog: Task[]
  delegated: Task[]; completed: Task[]; onHold: Task[]
  completionRate7d: number; totalOpen: number; totalCompleted: number
  totalBacklog: number; joeCapacityToday: number; maxJoeCapacity: number
  sources: Record<string, number>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function nowISO(): string { return new Date().toISOString() }
function todayStr(): string { return new Date().toISOString().split('T')[0] }
function makeId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}

// ---------------------------------------------------------------------------
// Summary rebuild — called after every mutation
// Rebuilds yos:tasks:summary from tasks:v1 so dashboard stays fresh
// ---------------------------------------------------------------------------
async function rebuildSummary(): Promise<void> {
  const raw = await redisGet(TASKS_KEY)
  const standbyRaw = await redisGet(STANDBY_KEY)
  const completedRaw = await redisGet(COMPLETED_KEY)
  const standby: Task[] = safeJsonParse(standbyRaw, [])
  const completed: Task[] = safeJsonParse(completedRaw, [])
  const allTasks: Task[] = safeJsonParse(raw, [])

  // Active tasks (not standby, not completed)
  const active = allTasks.filter(t => t.status !== 'completed' && t.status !== 'standby')
  const today = todayStr()
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  const todayTasks = active.filter(t => t.due_date === today)
  const overdue   = active.filter(t => t.due_date !== null && t.due_date < today)
  const backlog   = active.filter(t => t.due_date !== null && t.due_date > today)
  const delegated = active.filter(t => t.status === 'delegated')

  const completed7d = completed.filter(t =>
    t.completed_date && t.completed_date >= sevenDaysAgo
  )
  const rate7d = completed.length > 0
    ? Math.round((completed7d.length / Math.max(completed.length, 1)) * 100)
    : 0

  const sources: Record<string, number> = {}
  active.forEach(t => { sources[t.source] = (sources[t.source] || 0) + 1 })

  const summary = {
    generatedAt: nowISO(),
    todayTasks,
    overdue,
    backlog,
    delegated,
    completed,
    onHold: standby,
    completionRate7d: rate7d,
    totalOpen: active.length,
    totalCompleted: completed.length,
    totalBacklog: backlog.length,
    joeCapacityToday: todayTasks.length,
    maxJoeCapacity: 10,
    sources,
  }

  await redisSet(SUMMARY_KEY, JSON.stringify(summary))
}

// ---------------------------------------------------------------------------
// GET — read tasks
// ---------------------------------------------------------------------------
export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  // Primary: yos:tasks:summary (Inbox EA writes from Microsoft To Do)
  const summaryRaw = await redisGet(SUMMARY_KEY)
  if (summaryRaw) {
    try {
      const s = JSON.parse(summaryRaw)
      return NextResponse.json({
        generatedAt:     s.generatedAt || nowISO(),
        todayTasks:      (s.todayTasks  || []).map(deepClone),
        overdue:         (s.overdue     || []).map(deepClone),
        backlog:         (s.backlog     || []).map(deepClone),
        delegated:       (s.delegated   || []).map(deepClone),
        completed:       (s.completed   || []).map(deepClone),
        onHold:          (s.onHold      || []).map(deepClone),
        completionRate7d: s.completionRate7d || 0,
        totalOpen:       s.totalOpen      || 0,
        totalCompleted:  s.totalCompleted || 0,
        totalBacklog:    s.totalBacklog   || 0,
        joeCapacityToday: s.joeCapacityToday ?? ((s.todayTasks || []).length),
        maxJoeCapacity:  s.maxJoeCapacity  || 10,
        sources:         s.sources         || {},
      } as TasksData)
    } catch { /* fall through to legacy */ }
  }

  // Fallback: build from tasks:v1
  const raw = await redisGet(TASKS_KEY)
  const standbyRaw = await redisGet(STANDBY_KEY)
  const completedRaw = await redisGet(COMPLETED_KEY)

  const allTasks: Task[]  = safeJsonParse(raw, [])
  const standby: Task[]   = safeJsonParse(standbyRaw, [])
  const completed: Task[] = safeJsonParse(completedRaw, [])

  const today = todayStr()
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  const active = allTasks.filter(t => t.status !== 'completed' && t.status !== 'standby')
  const overdue   = active.filter(t => t.due_date !== null && t.due_date < today)
  const todayTasks = active.filter(t => t.due_date === today)
  const backlog   = active.filter(t => t.due_date !== null && t.due_date > today)
  const delegated = active.filter(t => t.status === 'delegated')

  const completed7d = completed.filter(t =>
    t.completed_date && t.completed_date >= sevenDaysAgo
  )
  const rate7d = completed.length > 0
    ? Math.round((completed7d.length / Math.max(completed.length, 1)) * 100)
    : 0

  const sources: Record<string, number> = {}
  active.forEach(t => { sources[t.source] = (sources[t.source] || 0) + 1 })

  return NextResponse.json({
    generatedAt: nowISO(),
    todayTasks, overdue, backlog, delegated, completed,
    onHold: standby,
    completionRate7d: rate7d,
    totalOpen: active.length,
    totalCompleted: completed.length,
    totalBacklog: backlog.length,
    joeCapacityToday: todayTasks.length,
    maxJoeCapacity: 10,
    sources,
  } as TasksData)
}

// ---------------------------------------------------------------------------
// POST — mutations
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  try {
    const body = await req.json() as {
      taskId?: string; action: string
      title?: string; due_date?: string; priority?: string; source?: string; description?: string
      completionNote?: string; agentId?: string; holdReason?: string
    }

    const now = nowISO()

    // ---- CREATE ----
    if (body.action === 'create') {
      const raw = await redisGet(TASKS_KEY)
      const tasks: Task[] = safeJsonParse(raw, [])
      const newTask: Task = {
        id: makeId(),
        title: body.title || 'Untitled',
        description: body.description || '',
        source: body.source || 'manual',
        status: 'pending',
        priority: body.priority || '2',
        due_date: body.due_date || null,
        due_time: null,
        assigned_to: '', revenue_value: null, client_name: '', client_id: '',
        can_delegate: 0, raw_commitment: '', tags: '',
        completed_at: null, completed_date: null,
        created_at: now, updated_at: now,
        committed_to: '', meeting_title: '', completion_note: '',
        delegated_to: '', hold_reason: '', on_hold_at: null,
        notes: '', notes_updated_at: null,
      }
      tasks.unshift(newTask)
      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      await rebuildSummary()
      return NextResponse.json({ ok: true, task: newTask }, { status: 201 })
    }

    // ---- COMPLETE ----
    if (body.action === 'complete' && body.taskId) {
      const raw = await redisGet(TASKS_KEY)
      const standbyRaw = await redisGet(STANDBY_KEY)
      const tasks: Task[] = safeJsonParse(raw, [])
      const standby: Task[] = safeJsonParse(standbyRaw, [])
      const completedRaw = await redisGet(COMPLETED_KEY)
      const completed: Task[] = safeJsonParse(completedRaw, [])

      // Try active tasks
      let idx = tasks.findIndex(t => t.id === body.taskId)
      let done: Task | null = null
      if (idx !== -1) {
        [done] = tasks.splice(idx, 1)
      } else {
        // Try standby
        idx = standby.findIndex(t => t.id === body.taskId)
        if (idx !== -1) [done] = standby.splice(idx, 1)
      }

      if (done) {
        done.status = 'completed'
        done.completed_at = now
        done.completed_date = now.split('T')[0]
        done.updated_at = now
        if (body.completionNote) done.completion_note = body.completionNote
        completed.unshift(done)
        if (completed.length > 100) completed.splice(100)
      }

      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      await redisSet(STANDBY_KEY, JSON.stringify(standby))
      await redisSet(COMPLETED_KEY, JSON.stringify(completed))
      await rebuildSummary()
      return NextResponse.json({ ok: true })
    }

    // ---- STANDBY ----
    if (body.action === 'standby' && body.taskId) {
      const raw = await redisGet(TASKS_KEY)
      const tasks: Task[] = safeJsonParse(raw, [])
      const standbyRaw = await redisGet(STANDBY_KEY)
      const standby: Task[] = safeJsonParse(standbyRaw, [])

      const idx = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        const [stby] = tasks.splice(idx, 1)
        stby.status = 'standby'
        stby.hold_reason = body.holdReason || ''
        stby.on_hold_at = now
        stby.updated_at = now
        standby.unshift(stby)
      }

      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      await redisSet(STANDBY_KEY, JSON.stringify(standby))
      await rebuildSummary()
      return NextResponse.json({ ok: true })
    }

    // ---- UNSTANDBY ----
    if (body.action === 'unstandby' && body.taskId) {
      const raw = await redisGet(TASKS_KEY)
      const tasks: Task[] = safeJsonParse(raw, [])
      const standbyRaw = await redisGet(STANDBY_KEY)
      const standby: Task[] = safeJsonParse(standbyRaw, [])

      const idx = standby.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        const [active] = standby.splice(idx, 1)
        active.status = 'pending'
        active.hold_reason = ''
        active.on_hold_at = null
        active.updated_at = now
        tasks.unshift(active)
      }

      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      await redisSet(STANDBY_KEY, JSON.stringify(standby))
      await rebuildSummary()
      return NextResponse.json({ ok: true })
    }

    // ---- DELEGATE ----
    if (body.action === 'delegate' && body.taskId && body.agentId) {
      const raw = await redisGet(TASKS_KEY)
      const tasks: Task[] = safeJsonParse(raw, [])
      const idx = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        tasks[idx].assigned_to = body.agentId
        tasks[idx].delegated_to = body.agentId
        tasks[idx].status = 'delegated'
        tasks[idx].updated_at = now
      }
      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      await rebuildSummary()
      return NextResponse.json({ ok: true })
    }

    // ---- SAVE NOTES ----
    if (body.action === 'save-notes' && body.taskId) {
      const raw = await redisGet(TASKS_KEY)
      const tasks: Task[] = safeJsonParse(raw, [])
      const standbyRaw = await redisGet(STANDBY_KEY)
      const standby: Task[] = safeJsonParse(standbyRaw, [])

      let idx = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        tasks[idx].notes = body.completionNote || ''
        tasks[idx].updated_at = now
      } else {
        idx = standby.findIndex(t => t.id === body.taskId)
        if (idx !== -1) {
          standby[idx].notes = body.completionNote || ''
          standby[idx].updated_at = now
        }
      }

      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      await redisSet(STANDBY_KEY, JSON.stringify(standby))
      // Notes don't need summary rebuild — no structural change
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}