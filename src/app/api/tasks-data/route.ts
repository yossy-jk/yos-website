/**
 * GET /api/tasks-data — returns task summary from Redis
 * POST /api/tasks-data — updates task status (complete/delegate/snooze)
 */
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const TASKS_KEY = 'yos:tasks:summary'
const MATON_API_KEY = process.env.MATON_API_KEY || ''
const MATON_CONNECTION = process.env.MATON_TODO_CONNECTION_ID || '111c70ef-60c3-4333-bc7e-a5b4be1a6a96'

// All MS To Do list IDs
const LISTS = [
  { id: 'AAMkADIyYjMzNWFiLWUyNWEtNDIzMi05ZmU4LWIyNDljMzMxMzYwNgAuAAAAAADTJyF1wTFJRZRASvZ91KDJAQDW57amVQ5qQqdp0VpMdqZ2AAAAAAESAAA=', name: 'Tasks' },
  { id: 'AAMkADIyYjMzNWFiLWUyNWEtNDIzMi05ZmU4LWIyNDljMzMxMzYwNgAuAAAAAADTJyF1wTFJRZRASvZ91KDJAQDW57amVQ5qQqdp0VpMdqZ2AADY539yAAA=', name: 'Finance' },
  { id: 'AAMkADIyYjMzNWFiLWUyNWEtNDIzMi05ZmU4LWIyNDljMzMxMzYwNgAuAAAAAADTJyF1wTFJRZRASvZ91KDJAQDW57amVQ5qQqdp0VpMdqZ2AADjR-w8AAA=', name: 'Today' },
  { id: 'AAMkADIyYjMzNWFiLWUyNWEtNDIzMi05ZmU4LWIyNDljMzMxMzYwNgAuAAAAAADTJyF1wTFJRZRASvZ91KDJAQDW57amVQ5qQqdp0VpMdqZ2AADsQiwSAAA=', name: 'Health & Personal' },
  { id: 'AAMkADIyYjMzNWFiLWUyNWEtNDIzMi05ZmU4LWIyNDljMzMxMzYwNgAuAAAAAADTJyF1wTFJRZRASvZ91KDJAQDW57amVQ5qQqdp0VpMdqZ2AADsQiwRAAA=', name: 'Operations' },
  { id: 'AAMkADIyYjMzNWFiLWUyNWEtNDIzMi05ZmU4LWIyNDljMzMxMzYwNgAuAAAAAADTJyF1wTFJRZRASvZ91KDJAQDW57amVQ5qQqdp0VpMdqZ2AADsQiwQAAA=', name: 'Sales & Pipeline' },
]

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ error: 'Redis not configured' })
  }

  // Try Redis first
  try {
    const res = await fetch(
      `${UPSTASH_URL}/get/${encodeURIComponent(TASKS_KEY)}`,
      { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }, cache: 'no-store' }
    )
    if (res.ok) {
      const d = await res.json() as { result?: string | null }
      if (d.result) {
        let parsed: unknown = JSON.parse(d.result)
        if (typeof parsed === 'object' && parsed !== null && 'value' in parsed) {
          const wrapped = parsed as { value: string }
          return NextResponse.json(JSON.parse(wrapped.value))
        }
        return NextResponse.json(parsed)
      }
    }
  } catch { /* fall through */ }

  // Fall back to MS To Do via Maton
  if (!MATON_API_KEY) {
    return NextResponse.json({ generatedAt: new Date().toISOString(), todayTasks: [], overdue: [], delegated: [], completed: [], completionRate7d: 0, totalOpen: 0, totalCompleted: 0, joeCapacityToday: 0, maxJoeCapacity: 10, sources: { ms_todo: 0 }, error: 'Configure MATON_API_KEY env var to connect Microsoft To Do' })
  }

  try {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const allTasks: { id: string; title: string; dueDate: string; importance: string; listName: string; status: string; body: string }[] = []

    await Promise.all(LISTS.map(async (list) => {
      try {
        const r = await fetch(
          `https://gateway.maton.ai/microsoft-to-do/v1.0/me/todo/lists/${list.id}/tasks`,
          { headers: { Authorization: `Bearer ${MATON_API_KEY}`, 'Maton-Connection': MATON_CONNECTION } }
        )
        if (!r.ok) return
        const data = await r.json() as { value: { id: string; title: string; status: string; importance: string; dueDateTime?: { dateTime: string }; body?: { content: string } }[] }
        for (const t of data.value || []) {
          if (t.status === 'completed') continue
          allTasks.push({
            id: t.id,
            title: t.title,
            status: t.status,
            importance: t.importance,
            dueDate: t.dueDateTime?.dateTime?.split('T')[0] || '',
            listName: list.name,
            body: t.body?.content || '',
          })
        }
      } catch { /* skip failed list */ }
    }))

    const overdue = allTasks.filter(t => t.dueDate && t.dueDate < today)
    const todayTasks = allTasks.filter(t => t.dueDate === today)
    const backlog = allTasks.filter(t => t.dueDate && t.dueDate > today).slice(0, 20)

    return NextResponse.json({
      generatedAt: now.toISOString(),
      todayTasks: todayTasks.map(t => ({ id: t.id, title: t.title, dueDate: t.dueDate, importance: t.importance, source: t.listName })),
      overdue: overdue.map(t => ({ id: t.id, title: t.title, dueDate: t.dueDate, importance: t.importance, source: t.listName })),
      backlog: backlog.map(t => ({ id: t.id, title: t.title, dueDate: t.dueDate, importance: t.importance, source: t.listName })),
      delegated: [],
      completed: [],
      completionRate7d: 0,
      totalOpen: allTasks.length,
      totalCompleted: 0,
      joeCapacityToday: todayTasks.length,
      maxJoeCapacity: 10,
      sources: { 'ms-todo': allTasks.length },
    })
  } catch (e) {
    return NextResponse.json({ generatedAt: new Date().toISOString(), todayTasks: [], overdue: [], delegated: [], completed: [], completionRate7d: 0, totalOpen: 0, totalCompleted: 0, joeCapacityToday: 0, maxJoeCapacity: 10, sources: {}, error: 'MS To Do fetch failed' })
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await req.json() as { taskId: string; action: string; note?: string; agent?: string }
  const { taskId, action, note, agent } = body

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
