/**
 * GET /api/tasks-data — returns task summary from Redis
 * POST /api/tasks-data — updates task status (complete/delegate/snooze)
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const TASKS_KEY = 'yos:tasks:summary'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ error: 'Redis not configured' })
  }

  try {
    const res = await fetch(
      `${UPSTASH_URL}/get/${encodeURIComponent(TASKS_KEY)}`,
      { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }, cache: 'no-store' }
    )
    if (res.ok) {
      const d = await res.json() as { result?: string | null }
      if (d.result) return NextResponse.json(JSON.parse(d.result))
    }
  } catch { /* fall through */ }

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    todayTasks: [],
    overdue: [],
    delegated: [],
    completed: [],
    completionRate7d: 0,
    totalOpen: 0,
    totalCompleted: 0,
    joeCapacityToday: 0,
    maxJoeCapacity: 10,
    sources: { meeting: 0, email: 0, call: 0, voice_memo: 0 },
    error: 'No tasks yet — add webhook URL in Fireflies settings',
  })
}

export async function POST(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const body = await req.json() as { taskId: string; action: string; note?: string }
  const { taskId, action, note } = body

  if (!taskId || !action) {
    return NextResponse.json({ error: 'Missing taskId or action' }, { status: 400 })
  }

  const update = JSON.stringify({
    taskId, action, note,
    timestamp: new Date().toISOString()
  })

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    await fetch(
      `${UPSTASH_URL}/lpush/${encodeURIComponent('yos:tasks:actions')}/${encodeURIComponent(update)}`,
      { method: 'POST', headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } }
    )
  }

  return NextResponse.json({ ok: true })
}
