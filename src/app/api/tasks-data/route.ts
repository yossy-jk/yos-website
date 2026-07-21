import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET  /api/tasks-data  — reads tasks from Upstash Redis
 * POST /api/tasks-data  — create/complete/delegate/standby/unstandby tasks
 *
 * Data model:
 *   tasks:v1            — canonical active task list (all non-completed tasks)
 *   tasks:completed:v1  — last 100 completed tasks
 *   tasks:standby:v1    — tasks on hold/standby
 *   yos:tasks:summary   — dashboard reads from here; rebuilt from tasks:v1 on every mutation
 *
 * All mutations write to tasks:v1 AND rebuild yos:tasks:summary
 * so the dashboard stays fresh without waiting for Inbox EA's next sync.
 *
 * Key invariant: yos:tasks:summary is ALWAYS rebuilt from tasks:v1.
 * tasks:v1 is the single source of truth; never the other way around.
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
  if (!r.ok) throw new Error(`redis-read-failed: HTTP ${r.status} for ${key}`)
  const d = await r.json() as { result?: unknown }
  return (d.result as string) ?? null
}

async function redisSet(key: string, value: string): Promise<void> {
  // WIPE-GUARD: never let a bad read shrink task lists catastrophically
  if (key === 'tasks:v1' || key === 'tasks:completed:v1') {
    try {
      const curRaw = await redisGet(key)
      const cur = safeJsonParse<any[]>(curRaw, [])
      const next = JSON.parse(value)
      if (Array.isArray(cur) && Array.isArray(next) && cur.length >= 10 && next.length < cur.length * 0.5) {
        console.error('wipe-guard refused ' + key + ': ' + cur.length + ' -> ' + next.length)
        return
      }
    } catch {}
  }
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

interface SummaryRaw {
  todayTasks: Task[]; overdue: Task[]; backlog: Task[]
  delegated: Task[]; completed: Task[]; onHold: Task[]
  [key: string]: unknown
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
  try {
    let v: any = JSON.parse(raw)
    for (let i = 0; i < 4; i++) {
      if (typeof v === 'string') { v = JSON.parse(v); continue }
      if (v && typeof v === 'object' && !Array.isArray(v) && 'value' in v && 'key' in v) {
        v = typeof v.value === 'string' ? JSON.parse(v.value) : v.value; continue
      }
      break
    }
    return (v ?? fallback) as T
  } catch { return fallback }
}

// ---------------------------------------------------------------------------
// Summary rebuild — called after every mutation
// Builds todayTasks/overdue/backlog/delegated from tasks:v1
// then writes both tasks:v1 (normalised) and yos:tasks:summary to Redis.
//
// tasks:v1 is the source of truth. Always rebuild summary from tasks:v1,
// never let the two diverge.
// ---------------------------------------------------------------------------
async function rebuildSummary(): Promise<void> {
  const raw          = await redisGet(TASKS_KEY)
  const standbyRaw   = await redisGet(STANDBY_KEY)
  const completedRaw = await redisGet(COMPLETED_KEY)

  const standby:   Task[] = safeJsonParse(standbyRaw,   [])
  const completed: Task[] = safeJsonParse(completedRaw, [])
  const allTasks:  Task[] = safeJsonParse(raw,          [])

  const today        = todayStr()
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  // Canonical active tasks (not completed, not on standby)
  const active     = allTasks.filter(t => t.status !== 'completed' && t.status !== 'standby')
  const todayTasks  = active.filter(t => t.due_date === today)
  const overdue    = active.filter(t => t.due_date !== null && t.due_date < today)
  const backlog    = active.filter(t => t.due_date !== null && t.due_date > today)
  const delegated  = active.filter(t => t.status === 'delegated')

  const completed7d = completed.filter(t =>
    t.completed_date && t.completed_date >= sevenDaysAgo
  )
  const rate7d = completed.length > 0
    ? Math.round((completed7d.length / Math.max(completed.length, 1)) * 100)
    : 0

  const sources: Record<string, number> = {}
  active.forEach(t => { sources[t.source] = (sources[t.source] || 0) + 1 })

  const summary = {
    generatedAt:     nowISO(),
    todayTasks,
    overdue,
    backlog,
    delegated,
    completed,
    onHold:         standby,
    completionRate7d: rate7d,
    totalOpen:       active.length,
    totalCompleted:  completed.length,
    totalBacklog:    backlog.length,
    joeCapacityToday: todayTasks.length,
    maxJoeCapacity:  10,
    sources,
  }

  // Write summary
  await redisSet(SUMMARY_KEY, JSON.stringify(summary))

  // Canonicalise and re-write tasks:v1 — keeps it in sync with summary
  // (active + standby, no completed)
  const canonical: Task[] = [
    ...active,
    ...standby.map(t => ({ ...t, status: 'standby' } as Task)),
  ]
  await redisSet(TASKS_KEY, JSON.stringify(canonical))
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
      const s = safeJsonParse<SummaryRaw>(summaryRaw, {} as SummaryRaw)
      if ((((s.backlog || []) as unknown[]).length === 0) && (((s.totalOpen as number) || 0) === 0)) throw new Error('summary-wiped: falling back to task lists')
      return NextResponse.json({
        generatedAt:     (s.generatedAt as string) || nowISO(),
        todayTasks:      ((s.todayTasks  || []) as Task[]).map(deepClone),
        overdue:         ((s.overdue     || []) as Task[]).map(deepClone),
        backlog:         ((s.backlog     || []) as Task[]).map(deepClone),
        delegated:       ((s.delegated   || []) as Task[]).map(deepClone),
        completed:       ((s.completed   || []) as Task[]).map(deepClone),
        onHold:          ((s.onHold      || []) as Task[]).map(deepClone),
        completionRate7d: (s.completionRate7d as number) || 0,
        totalOpen:       (s.totalOpen      as number) || 0,
        totalCompleted:  (s.totalCompleted as number) || 0,
        totalBacklog:    (s.totalBacklog   as number) || 0,
        joeCapacityToday: (s.joeCapacityToday as number) ?? ((s.todayTasks || []).length),
        maxJoeCapacity:  (s.maxJoeCapacity  as number) || 10,
        sources:         (s.sources         as Record<string, number>) || {},
      } as TasksData)
    } catch { /* fall through to legacy */ }
  }

  // Fallback: build from tasks:v1
  const raw          = await redisGet(TASKS_KEY)
  const standbyRaw   = await redisGet(STANDBY_KEY)
  const completedRaw = await redisGet(COMPLETED_KEY)

  const allTasks:  Task[] = safeJsonParse(raw,          [])
  const standby:   Task[] = safeJsonParse(standbyRaw,   [])
  const completed: Task[] = safeJsonParse(completedRaw, [])

  const today        = todayStr()
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  const active     = allTasks.filter(t => t.status !== 'completed' && t.status !== 'standby')
  const todayTasks  = active.filter(t => t.due_date === today)
  const overdue    = active.filter(t => t.due_date !== null && t.due_date < today)
  const backlog    = active.filter(t => t.due_date !== null && t.due_date > today)
  const delegated  = active.filter(t => t.status === 'delegated')

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
      const raw   = await redisGet(TASKS_KEY)
      const tasks: Task[] = safeJsonParse(raw, [])
      const newTask: Task = {
        id: makeId(),
        title:         body.title || 'Untitled',
        description:   body.description || '',
        source:        body.source || 'manual',
        status:        'pending',
        priority:      body.priority || '2',
        due_date:      body.due_date || null,
        due_time:      null,
        assigned_to:   '', revenue_value: null, client_name: '', client_id: '',
        can_delegate:  0, raw_commitment: '', tags: '',
        completed_at:  null, completed_date: null,
        created_at:    now, updated_at: now,
        committed_to:  '', meeting_title: '', completion_note: '',
        delegated_to:  '', hold_reason: '', on_hold_at: null,
        notes:         '', notes_updated_at: null,
      }
      tasks.unshift(newTask)
      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      await rebuildSummary()
      return NextResponse.json({ ok: true, task: newTask }, { status: 201 })
    }

    // ---- COMPLETE ----
    if (body.action === 'complete' && body.taskId) {
      const raw          = await redisGet(TASKS_KEY)
      const standbyRaw   = await redisGet(STANDBY_KEY)
      const completedRaw = await redisGet(COMPLETED_KEY)
      const summaryRaw   = await redisGet(SUMMARY_KEY)

      const tasks:    Task[] = safeJsonParse(raw,          [])
      const standby:  Task[] = safeJsonParse(standbyRaw,   [])
      const completed: Task[] = safeJsonParse(completedRaw, [])

      // Search tasks:v1 first, then standby, then summary (Microsoft To Do tasks)
      let idx  = tasks.findIndex(t => t.id === body.taskId)
      let done: Task | null = null

      if (idx !== -1) {
        [done] = tasks.splice(idx, 1)
      } else {
        idx = standby.findIndex(t => t.id === body.taskId)
        if (idx !== -1) {
          [done] = standby.splice(idx, 1)
        } else {
          // Task may live only in yos:tasks:summary (from MS To Do / Inbox EA sync)
          const summaryData = safeJsonParse<SummaryRaw>(summaryRaw, {
            todayTasks: [], overdue: [], backlog: [],
            delegated: [], completed: [], onHold: [],
          })

          const allSummaryLists = [
            ...(summaryData.todayTasks  || []),
            ...(summaryData.overdue     || []),
            ...(summaryData.backlog     || []),
            ...(summaryData.delegated   || []),
            ...(summaryData.onHold      || []),
          ]

          const sumIdx = allSummaryLists.findIndex(t => t.id === body.taskId)
          if (sumIdx !== -1) {
            done = { ...allSummaryLists[sumIdx] }
            // Also remove from the appropriate summary list to keep summary consistent
            const removeFrom = (arr: Task[]) => {
              const i = arr.findIndex(t => t.id === body.taskId)
              if (i !== -1) arr.splice(i, 1)
            }
            removeFrom(summaryData.todayTasks)
            removeFrom(summaryData.overdue)
            removeFrom(summaryData.backlog)
            removeFrom(summaryData.delegated)
            removeFrom(summaryData.onHold)
            // Persist the updated summary immediately since tasks:v1 won't have it
            await redisSet(SUMMARY_KEY, JSON.stringify(summaryData))
          }
        }
      }

      if (done) {
        done.status         = 'completed'
        done.completed_at   = now
        done.completed_date = now.split('T')[0]
        done.updated_at     = now
        if (body.completionNote) done.completion_note = body.completionNote
        completed.unshift(done)
        if (completed.length > 100) completed.splice(100)

        // Persist all stores and rebuild summary to sync tasks:v1 + summary
        await redisSet(COMPLETED_KEY, JSON.stringify(completed))
        await redisSet(STANDBY_KEY,   JSON.stringify(standby))
        await redisSet(TASKS_KEY,     JSON.stringify(tasks))
        await rebuildSummary()
        return NextResponse.json({ ok: true })
      }

      // Task not found anywhere — return ok to avoid UI errors, include warning for debugging
      return NextResponse.json({ ok: true, warning: 'task not found' })
    }

    // ---- STANDBY ----
    if (body.action === 'standby' && body.taskId) {
      const raw        = await redisGet(TASKS_KEY)
      const standbyRaw = await redisGet(STANDBY_KEY)
      const tasks:   Task[] = safeJsonParse(raw,        [])
      const standby: Task[] = safeJsonParse(standbyRaw, [])

      const idx = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        const [stby] = tasks.splice(idx, 1)
        stby.status       = 'standby'
        stby.hold_reason  = body.holdReason || ''
        stby.on_hold_at   = now
        stby.updated_at   = now
        standby.unshift(stby)
      }

      await redisSet(TASKS_KEY,   JSON.stringify(tasks))
      await redisSet(STANDBY_KEY, JSON.stringify(standby))
      await rebuildSummary()
      return NextResponse.json({ ok: true })
    }

    // ---- UNSTANDBY ----
    if (body.action === 'unstandby' && body.taskId) {
      const raw        = await redisGet(TASKS_KEY)
      const standbyRaw = await redisGet(STANDBY_KEY)
      const tasks:   Task[] = safeJsonParse(raw,        [])
      const standby: Task[] = safeJsonParse(standbyRaw, [])

      const idx = standby.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        const [active] = standby.splice(idx, 1)
        active.status      = 'pending'
        active.hold_reason = ''
        active.on_hold_at  = null
        active.updated_at  = now
        tasks.unshift(active)
      }

      await redisSet(TASKS_KEY,   JSON.stringify(tasks))
      await redisSet(STANDBY_KEY, JSON.stringify(standby))
      await rebuildSummary()
      return NextResponse.json({ ok: true })
    }

    // ---- DELEGATE ----
    if (body.action === 'delegate' && body.taskId && body.agentId) {
      const raw   = await redisGet(TASKS_KEY)
      const tasks: Task[] = safeJsonParse(raw, [])
      const idx   = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        tasks[idx].assigned_to  = body.agentId
        tasks[idx].delegated_to = body.agentId
        tasks[idx].status      = 'delegated'
        tasks[idx].updated_at  = now
      }
      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      await rebuildSummary()
      return NextResponse.json({ ok: true })
    }

    // ---- SAVE NOTES ----
    if (body.action === 'save-notes' && body.taskId) {
      const raw        = await redisGet(TASKS_KEY)
      const standbyRaw = await redisGet(STANDBY_KEY)
      const tasks:   Task[] = safeJsonParse(raw,        [])
      const standby: Task[] = safeJsonParse(standbyRaw, [])

      let found = false
      let idx   = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        tasks[idx].notes            = body.completionNote || ''
        tasks[idx].notes_updated_at = now
        tasks[idx].updated_at       = now
        found = true
      }
      if (!found) {
        idx = standby.findIndex(t => t.id === body.taskId)
        if (idx !== -1) {
          standby[idx].notes            = body.completionNote || ''
          standby[idx].notes_updated_at = now
          standby[idx].updated_at       = now
          found = true
        }
      }

      if (found) {
        await redisSet(TASKS_KEY,   JSON.stringify(tasks))
        await redisSet(STANDBY_KEY, JSON.stringify(standby))
        // Notes don't need summary rebuild — no structural change
      }
      return NextResponse.json({ ok: true, updated: found })
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
