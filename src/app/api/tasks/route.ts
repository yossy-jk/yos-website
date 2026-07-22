import { NextResponse } from 'next/server'
const RURL = process.env.UPSTASH_REDIS_REST_URL!
const RTOK = process.env.UPSTASH_REDIS_REST_TOKEN!
export const dynamic = 'force-dynamic'
export const revalidate = 0

type Task = Record<string, unknown>

function unwrap(raw: unknown): unknown {
  let v: unknown = raw
  for (let i = 0; i < 5; i++) {
    if (typeof v === 'string') {
      try { v = JSON.parse(v as string) } catch { return v }
      continue
    }
    if (v && typeof v === 'object' && !Array.isArray(v) && 'value' in (v as object) && 'key' in (v as object)) {
      v = (v as { value: unknown }).value
      continue
    }
    break
  }
  return v
}

async function rget(key: string): Promise<unknown> {
  const r = await fetch(`${RURL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${RTOK}` }, cache: 'no-store',
  })
  if (!r.ok) return null
  const d = await r.json()
  if (d?.result == null) return null
  return unwrap(d.result)
}

async function rset(key: string, value: unknown): Promise<void> {
  await fetch(`${RURL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${RTOK}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  })
}

const DONE = ['done', 'completed']
const CLOSED = ['done', 'completed', 'standby', 'delegated', 'cancelled']

export async function GET() {
  try {
    const v = await rget('yos:tasks:board')
    return NextResponse.json(v ?? null)
  } catch { return NextResponse.json(null) }
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {}
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'bad json' }) }

  // Always queue for the local worker (handles tasks.db sync, agent bus, notes)
  try {
    await fetch(`${RURL}/lpush/task:actions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RTOK}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.stringify(body)),
    })
  } catch {}

  const action = String(body.action || '')
  const id = String(body.id || body.taskId || '')

  // Complete server-side immediately so a stopped cron can never swallow it
  if (action !== 'complete' || !id) return NextResponse.json({ ok: true, queued: true })

  try {
    const now = new Date().toISOString().slice(0, 19)
    const listRaw = await rget('tasks:v1')
    const list: Task[] = Array.isArray(listRaw) ? (listRaw as Task[]) : []
    const compRaw = await rget('tasks:completed:v1')
    const comp: Task[] = Array.isArray(compRaw) ? (compRaw as Task[]) : []

    let hit: Task | null = null
    for (const t of list) {
      if (String(t.id) === id) {
        t.status = 'done'; t.completed_at = now; hit = t
      }
    }
    if (!hit) return NextResponse.json({ ok: true, warning: 'not found in tasks:v1', queued: true })

    if (!comp.some(c => String(c.id) === id)) comp.unshift({ ...hit })

    // Wipe guard: never shrink the active list catastrophically
    if (list.length >= 10) await rset('tasks:v1', list)
    await rset('tasks:completed:v1', comp.slice(0, 200))

    // Keep the board (what the dashboard renders) in step
    const boardRaw = await rget('yos:tasks:board')
    if (boardRaw && typeof boardRaw === 'object') {
      const board = boardRaw as { tasks?: Task[]; stats?: Record<string, number> }
      if (Array.isArray(board.tasks)) {
        for (const t of board.tasks) {
          if (String(t.id) === id) { t.status = 'done'; t.completed_at = now }
        }
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Sydney' })
        const open = board.tasks.filter(t => !CLOSED.includes(String(t.status))).length
        const doneToday = board.tasks.filter(t =>
          DONE.includes(String(t.status)) && String(t.completed_at || '').slice(0, 10) === today).length
        board.stats = { ...(board.stats || {}), open, done_today: doneToday }
      }
      await rset('yos:tasks:board', board)
    }
    return NextResponse.json({ ok: true, completed: id })
  } catch (e) {
    return NextResponse.json({ ok: true, queued: true, error: String(e) })
  }
}
