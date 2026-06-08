import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

/**
 * GET  /api/tasks-data  — reads from yos:tasks:summary (Inbox EA writes this)
 * POST /api/tasks-data  — create/complete/delegate tasks (writes to tasks:v1 for Inbox EA to pick up)
 */
const UPSTASH_URL    = process.env.UPSTASH_REDIS_REST_URL    || ''
const UPSTASH_TOKEN  = process.env.UPSTASH_REDIS_REST_TOKEN  || ''
const TASKS_KEY       = 'tasks:v1'
const TASKS_SUMMARY_KEY = 'yos:tasks:summary'
const COMPLETED_KEY   = 'tasks:completed:v1'

async function redisGetRaw(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  const res = await fetch(`${UPSTASH_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  })
  if (!res.ok) return null
  const d = await res.json() as { result?: unknown }
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

interface Task {
  id: string; title: string; description: string; source: string; status: string
  priority: string; due_date: string | null; due_time: string | null
  assigned_to: string; revenue_value: number | null; client_name: string; client_id: string
  can_delegate: number; raw_commitment: string; tags: string; completed_at: string | null
  created_at: string; updated_at: string
  // extra fields from yos:tasks:summary
  committed_to: string; meeting_title: string; completion_note: string; delegated_to: string
}

function nowISO(): string { return new Date().toISOString() }
function todayStr(): string { return new Date().toISOString().split('T')[0] }
function makeId(): string { return Math.random().toString(36).slice(2) + Date.now().toString(36) }

function mapTask(raw: Record<string, unknown>): Task {
  return {
    id:             String(raw.id || makeId()),
    title:          String(raw.title || ''),
    description:    String(raw.description || ''),
    source:         String(raw.source || 'manual'),
    status:         String(raw.status || 'pending'),
    priority:       String(raw.priority || '2'),
    due_date:        raw.due_date  ? String(raw.due_date)  : null,
    due_time:        raw.due_time  ? String(raw.due_time)  : null,
    assigned_to:    String(raw.assigned_to || ''),
    revenue_value:   raw.revenue_value ? Number(raw.revenue_value) : null,
    client_name:    String(raw.client_name || ''),
    client_id:      String(raw.client_id || ''),
    can_delegate:   Number(raw.can_delegate || 0),
    raw_commitment: '',
    tags:           '',
    completed_at:    raw.completed_at ? String(raw.completed_at) : null,
    created_at:      nowISO(),
    updated_at:      nowISO(),
    // summary fields
    committed_to:   String(raw.committed_to || ''),
    meeting_title: String(raw.meeting_title || ''),
    completion_note: String(raw.completion_note || ''),
    delegated_to:   String(raw.delegated_to || ''),
  }
}

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  // Primary: yos:tasks:summary (written by Inbox EA)
  const raw = await redisGetRaw(TASKS_SUMMARY_KEY)
  if (raw) {
    try {
      const summary = JSON.parse(raw)
      return NextResponse.json({
        generatedAt:     summary.generatedAt || nowISO(),
        todayTasks:      (summary.todayTasks  || []).map(mapTask),
        overdue:         (summary.overdue     || []).map(mapTask),
        backlog:         (summary.backlog       || []).map(mapTask),
        delegated:       (summary.delegated     || []).map(mapTask),
        completed:       (summary.completed     || []).map(mapTask),
        completionRate7d: summary.completionRate7d || 0,
        totalOpen:       summary.totalOpen      || 0,
        totalCompleted:  summary.totalCompleted || 0,
        totalBacklog:    summary.totalBacklog   || 0,
        joeCapacityToday: summary.joeCapacityToday ?? (summary.todayTasks || []).length,
        maxJoeCapacity:  summary.maxJoeCapacity  || 10,
        sources:         summary.sources         || {},
      })
    } catch {
      // fall through to legacy
    }
  }

  // Fallback: tasks:v1 (manual creates)
  const legacyRaw = await redisGetRaw(TASKS_KEY)
  const tasks: Task[] = legacyRaw ? JSON.parse(legacyRaw) : []
  const completedRaw = await redisGetRaw(COMPLETED_KEY)
  const completed: Task[] = completedRaw ? JSON.parse(completedRaw) : []

  const today = todayStr()
  const overdue  = tasks.filter(t => t.status === 'pending' && t.due_date && t.due_date < today)
  const todayTasks = tasks.filter(t => t.status === 'pending' && t.due_date === today)
  const backlog = tasks.filter(t => t.status === 'pending' && t.due_date && t.due_date > today).slice(0, 20)
  const delegated = tasks.filter(t => t.status === 'delegated')
  const sources: Record<string, number> = {}
  tasks.forEach(t => { sources[t.source] = (sources[t.source] || 0) + 1 })

  return NextResponse.json({
    generatedAt: nowISO(),
    todayTasks, overdue, backlog, delegated, completed,
    completionRate7d: 0, totalOpen: tasks.length,
    totalCompleted: completed.length, totalBacklog: backlog.length,
    joeCapacityToday: todayTasks.length, maxJoeCapacity: 10, sources,
  })
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  try {
    const body = await req.json() as {
      taskId?: string; action: string; agent?: string
      title?: string; due_date?: string; priority?: string; source?: string; description?: string
      completionNote?: string
    }
    const now = nowISO()

    if (body.action === 'create') {
      const raw = await redisGetRaw(TASKS_KEY)
      const tasks: Task[] = raw ? JSON.parse(raw) : []
      const newTask: Task = {
        id: makeId(), title: body.title || 'Untitled',
        description: body.description || '', source: body.source || 'manual',
        status: 'pending', priority: body.priority || '2',
        due_date: body.due_date || null, due_time: null,
        assigned_to: '', revenue_value: null, client_name: '', client_id: '',
        can_delegate: 0, raw_commitment: '', tags: '',
        completed_at: null, created_at: now, updated_at: now,
        committed_to: '', meeting_title: '', completion_note: '', delegated_to: '',
      }
      tasks.unshift(newTask)
      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      return NextResponse.json({ ok: true, task: newTask }, { status: 201 })
    }

    if (body.action === 'complete' && body.taskId) {
      const raw = await redisGetRaw(TASKS_KEY)
      const tasks: Task[] = raw ? JSON.parse(raw) : []
      const completedRaw = await redisGetRaw(COMPLETED_KEY)
      const completed: Task[] = completedRaw ? JSON.parse(completedRaw) : []
      const idx = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        const [done] = tasks.splice(idx, 1)
        done.status = 'completed'
        done.completed_at = now
        done.updated_at = now
        if (body.completionNote) done.completion_note = body.completionNote
        completed.unshift(done)
        if (completed.length > 50) completed.splice(50)
        await redisSet(TASKS_KEY, JSON.stringify(tasks))
        await redisSet(COMPLETED_KEY, JSON.stringify(completed))
      }
      return NextResponse.json({ ok: true })
    }

    if (body.action === 'delegate' && body.taskId && body.agent) {
      const raw = await redisGetRaw(TASKS_KEY)
      const tasks: Task[] = raw ? JSON.parse(raw) : []
      const idx = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        tasks[idx].assigned_to  = body.agent
        tasks[idx].delegated_to = body.agent
        tasks[idx].status = 'delegated'
        tasks[idx].updated_at = now
        await redisSet(TASKS_KEY, JSON.stringify(tasks))
      }
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}