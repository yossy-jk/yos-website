/**
 * POST /api/tasks/sync
 * Accepts task sync payload from local sync script.
 * Auth via x-queue-secret header matching QUEUE_SECRET env var.
 * Pushes task data to Upstash Redis for the dashboard tasks tab.
 */
import { NextRequest, NextResponse } from 'next/server'

const TASKS_KEY = 'yos:tasks:summary'
const ALERTS_KEY = 'yos_alerts_tasks_updated'

async function redisPost(url: string, token: string, path: string, body?: object) {
  const res = await fetch(`${url}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Redis error ${res.status}: ${await res.text()}`)
  const d = await res.json()
  return d.result
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-queue-secret')
  const QUEUE_SECRET = process.env.QUEUE_SECRET
  if (secret !== QUEUE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    todayTasks?: Array<Record<string, unknown>>
    backlog?: Array<Record<string, unknown>>
    overdue?: Array<Record<string, unknown>>
    completed?: Array<Record<string, unknown>>
    totalOpen?: number
    totalCompleted?: number
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
  }

  try {
    let completedStore: Array<Record<string, unknown>> = []
    try {
      const cr = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent('tasks:completed:v1')}`, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } })
      const cd = await cr.json()
      let cv: unknown = cd.result
      for (let i = 0; i < 4; i++) {
        if (typeof cv === 'string') { cv = JSON.parse(cv as string); continue }
        if (cv && typeof cv === 'object' && !Array.isArray(cv) && 'value' in (cv as object) && 'key' in (cv as object)) { const o = cv as { value: unknown }; cv = typeof o.value === 'string' ? JSON.parse(o.value) : o.value; continue }
        break
      }
      if (Array.isArray(cv)) completedStore = cv as Array<Record<string, unknown>>
    } catch {}
    const doneIds = new Set(completedStore.map(t => String((t as { id?: unknown }).id)))
    const notDone = (arr?: Array<Record<string, unknown>>) => (arr || []).filter(t => !doneIds.has(String((t as { id?: unknown }).id)))
    const tasks_data = {
      generatedAt: new Date().toISOString(),
      todayTasks: notDone(body.todayTasks),
      backlog: notDone(body.backlog),
      overdue: notDone(body.overdue),
      delegated: [],
      completed: completedStore.length ? completedStore.slice(0, 100) : (body.completed || []),
      completionRate7d: 0,
      totalOpen: notDone(body.todayTasks).length + notDone(body.backlog).length,
      totalCompleted: completedStore.length || (body.totalCompleted || 0),
      totalBacklog: notDone(body.backlog).length,
      joeCapacityToday: notDone(body.todayTasks).length,
      maxJoeCapacity: 10,
      sources: { 'local-sync': notDone(body.todayTasks).length },
    }
    await redisPost(UPSTASH_URL, UPSTASH_TOKEN,
      `/set/${encodeURIComponent(TASKS_KEY)}`,
      tasks_data
    )

    await redisPost(UPSTASH_URL, UPSTASH_TOKEN,
      `/lpush/${encodeURIComponent(ALERTS_KEY)}/${encodeURIComponent(JSON.stringify({
        type: 'tasks-updated',
        count: tasks_data.todayTasks.length,
        overdueCount: tasks_data.overdue.length,
        generatedAt: tasks_data.generatedAt,
      }))}`
    )

    return NextResponse.json({ ok: true, todayTasks: tasks_data.todayTasks.length })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 })
  }
}