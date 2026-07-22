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

  // Bulk ops + delete, applied server-side in one pass
  if (action === 'bulk' || action === 'delete') {
    try {
      const ids: string[] = action === 'delete' ? [id] : (body.ids as string[] || []).map(String)
      const op = action === 'delete' ? 'delete' : String(body.op || 'complete')
      if (!ids.length) return NextResponse.json({ ok: true, n: 0 })
      const now = new Date().toISOString().slice(0, 19)
      const listRaw = await rget('tasks:v1')
      const list: Task[] = Array.isArray(listRaw) ? (listRaw as Task[]) : []
      const compRaw = await rget('tasks:completed:v1')
      const comp: Task[] = Array.isArray(compRaw) ? (compRaw as Task[]) : []
      const delRaw = await rget('tasks:deleted:v1')
      const del: Task[] = Array.isArray(delRaw) ? (delRaw as Task[]) : []
      const set = new Set(ids)
      const keep: Task[] = []
      let n = 0
      for (const t of list) {
        if (!set.has(String(t.id))) { keep.push(t); continue }
        n++
        if (op === 'delete') { t.status = 'deleted'; t.deleted_at = now; del.unshift({ ...t }) }
        else if (op === 'due') { t.due_date = String(body.due || ''); keep.push(t) }
        else { t.status = 'done'; t.completed_at = now
               if (!comp.some(c => String(c.id) === String(t.id))) comp.unshift({ ...t }) }
      }
      if (keep.length >= Math.min(5, list.length)) await rset('tasks:v1', keep)
      if (op === 'delete') await rset('tasks:deleted:v1', del.slice(0, 300))
      if (op === 'complete') await rset('tasks:completed:v1', comp.slice(0, 300))
      const boardRaw = await rget('yos:tasks:board')
      if (boardRaw && typeof boardRaw === 'object') {
        const board = boardRaw as { tasks?: Task[]; stats?: Record<string, number> }
        if (Array.isArray(board.tasks)) {
          board.tasks = board.tasks.filter(t => !(set.has(String(t.id)) && op === 'delete'))
          for (const t of board.tasks) {
            if (set.has(String(t.id))) {
              if (op === 'complete') { t.status = 'done'; t.completed_at = now }
              if (op === 'due') t.due_date = String(body.due || '')
            }
          }
          const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Sydney' })
          board.stats = { ...(board.stats || {}),
            open: board.tasks.filter(t => !CLOSED.includes(String(t.status))).length,
            done_today: board.tasks.filter(t => DONE.includes(String(t.status)) &&
              String(t.completed_at || '').slice(0, 10) === today).length }
        }
        await rset('yos:tasks:board', board)
      }
      return NextResponse.json({ ok: true, n, op })
    } catch (e) {
      return NextResponse.json({ ok: false, error: String(e) })
    }
  }

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
