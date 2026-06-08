/**
 * GET /api/tasks-data — reads/writes tasks from Upstash Redis
 * POST /api/tasks-data — create/complete/delegate tasks
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

const TASKS_KEY = 'tasks:v1'
const COMPLETED_KEY = 'tasks:completed:v1'

async function redisGet(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  })
  if (!res.ok) return null
  const d = await res.json() as { result?: string | null }
  return d.result ?? null
}

async function redisSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return
  const body: Record<string, string | number> = { key, value }
  if (ttlSeconds) body['ex'] = ttlSeconds
  await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    body: JSON.stringify(body)
  })
}

interface Task {
  id: string; title: string; description: string; source: string; status: string
  priority: string; due_date: string | null; due_time: string | null
  assigned_to: string; revenue_value: number | null; client_name: string; client_id: string
  can_delegate: number; raw_commitment: string; tags: string; completed_at: string | null
  created_at: string; updated_at: string
}

function nowISO(): string {
  return new Date().toISOString()
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function makeId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const raw = await redisGet(TASKS_KEY)
  const tasks: Task[] = raw ? JSON.parse(raw) : []
  const completedRaw = await redisGet(COMPLETED_KEY)
  const completed: Task[] = completedRaw ? JSON.parse(completedRaw) : []

  const today = todayStr()
  const overdue = tasks.filter(t => t.status === 'pending' && t.due_date && t.due_date < today)
  const todayTasks = tasks.filter(t => t.status === 'pending' && t.due_date === today)
  const backlog = tasks.filter(t => t.status === 'pending' && t.due_date && t.due_date > today).slice(0, 20)
  const delegated = tasks.filter(t => t.status === 'delegated')

  const totalDoneLast7 = completed.filter(t => t.completed_at && t.completed_at > nowISO()).length
  const rate = tasks.length > 0 ? Math.round((completed.length / (tasks.length + completed.length)) * 100) : 0

  const sources: Record<string, number> = {}
  tasks.forEach(t => { sources[t.source] = (sources[t.source] || 0) + 1 })

  return NextResponse.json({
    generatedAt: nowISO(),
    todayTasks,
    overdue,
    backlog,
    delegated,
    completed,
    completionRate7d: rate,
    totalOpen: tasks.length,
    totalCompleted: completed.length,
    totalBacklog: backlog.length,
    maxJoeCapacity: 10,
    sources,
  })
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  try {
    const body = await req.json() as {
      taskId?: string; action: string; agent?: string
      title?: string; due_date?: string; priority?: string; source?: string; description?: string
      note?: string
    }
    const now = nowISO()

    if (body.action === 'create') {
      const raw = await redisGet(TASKS_KEY)
      const tasks: Task[] = raw ? JSON.parse(raw) : []
      const newTask: Task = {
        id: makeId(),
        title: body.title || 'Untitled',
        description: body.description || '',
        source: body.source || 'manual',
        status: 'pending',
        priority: body.priority || '2',
        due_date: body.due_date || null,
        due_time: null,
        assigned_to: '',
        revenue_value: null,
        client_name: '',
        client_id: '',
        can_delegate: 0,
        raw_commitment: '',
        tags: '',
        completed_at: null,
        created_at: now,
        updated_at: now,
      }
      tasks.unshift(newTask)
      await redisSet(TASKS_KEY, JSON.stringify(tasks))
      return NextResponse.json({ ok: true, task: newTask }, { status: 201 })
    }

    if (body.action === 'complete' && body.taskId) {
      // Move from active to completed
      const raw = await redisGet(TASKS_KEY)
      const tasks: Task[] = raw ? JSON.parse(raw) : []
      const completedRaw = await redisGet(COMPLETED_KEY)
      const completed: Task[] = completedRaw ? JSON.parse(completedRaw) : []

      const idx = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        const [done] = tasks.splice(idx, 1)
        done.status = 'completed'
        done.completed_at = now
        done.updated_at = now
        completed.unshift(done)
        // Keep completed list at 50
        if (completed.length > 50) completed.splice(50)
        await redisSet(TASKS_KEY, JSON.stringify(tasks))
        await redisSet(COMPLETED_KEY, JSON.stringify(completed))
      }
      return NextResponse.json({ ok: true })
    }

    if (body.action === 'delegate' && body.taskId && body.agent) {
      const raw = await redisGet(TASKS_KEY)
      const tasks: Task[] = raw ? JSON.parse(raw) : []
      const idx = tasks.findIndex(t => t.id === body.taskId)
      if (idx !== -1) {
        tasks[idx].assigned_to = body.agent
        tasks[idx].status = 'delegated'
        tasks[idx].updated_at = now
        await redisSet(TASKS_KEY, JSON.stringify(tasks))
      }
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}