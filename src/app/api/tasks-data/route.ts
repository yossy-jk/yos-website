/**
 * GET /api/tasks-data — returns tasks from local SQLite DB
 * POST /api/tasks-data — create/complete/delegate tasks
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'

const DB = '/Users/yourofficespace-main/.openclaw/tasks/tasks.db'

function getDb() {
  const { init } = require('better-sqlite3')
  return init(DB)
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const db = getDb()
    const today = new Date().toISOString().split('T')[0]

    const allTasks = db.prepare('SELECT * FROM tasks WHERE status NOT IN ("completed","done") ORDER BY priority ASC, created_at DESC').all() as any[]

    const pending = allTasks.filter(t => t.due_date && t.due_date < today)
    const todayTasks = allTasks.filter(t => t.due_date === today)
    const backlog = allTasks.filter(t => t.due_date && t.due_date > today).slice(0, 20)
    const completed = db.prepare('SELECT * FROM tasks WHERE status IN ("completed","done") ORDER BY updated_at DESC LIMIT 20').all() as any[]

    // Completion rate last 7 days
    const totalLast7 = db.prepare("SELECT COUNT(*) FROM tasks WHERE completed_at >= datetime('now', '-7 days')").get() as any
    const doneLast7 = db.prepare("SELECT COUNT(*) FROM tasks WHERE status IN ('completed','done') AND completed_at >= datetime('now', '-7 days')").get() as any
    const rate = totalLast7[0] > 0 ? Math.round((doneLast7[0] / totalLast7[0]) * 100) : 0

    // Source breakdown
    const sources: Record<string, number> = {}
    allTasks.forEach(t => { sources[t.source] = (sources[t.source] || 0) + 1 })

    const totalBacklog = allTasks.filter(t => t.due_date && t.due_date > today).length

    db.close()
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      todayTasks,
      overdue: pending,
      backlog,
      delegated: [],
      completed,
      completionRate7d: rate,
      totalOpen: allTasks.length,
      totalCompleted: db.prepare("SELECT COUNT(*) FROM tasks WHERE status IN ('completed','done')").get()[0] || 0,
      totalBacklog,
      maxJoeCapacity: 10,
      sources,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message, todayTasks: [], overdue: [], backlog: [], delegated: [], completed: [], completionRate7d: 0, totalOpen: 0, totalCompleted: 0, totalBacklog: 0, maxJoeCapacity: 10, sources: {} })
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const body = await req.json() as { taskId?: string; action: string; agent?: string; title?: string; due_date?: string; priority?: string; source?: string; description?: string; note?: string }
    const db = getDb()
    const now = new Date().toISOString()

    if (body.action === 'create') {
      const id = require('crypto').randomUUID().replace(/-/g, '').slice(0, 16)
      db.prepare("INSERT INTO tasks (id,title,description,source,priority,due_date,can_delegate,created_at,updated_at) VALUES (?,?,?,?,?,?,0,?,?)").run(
        id, body.title || 'Untitled', body.description || '', body.source || 'manual', body.priority || '2', body.due_date || null, now, now
      )
      const task = db.prepare('SELECT * FROM tasks WHERE id=?').get(id)
      db.close()
      return NextResponse.json({ ok: true, task })
    }

    if (body.action === 'complete' && body.taskId) {
      db.prepare("UPDATE tasks SET status='completed',completed_at=?,updated_at=? WHERE id=?").run(now, now, body.taskId)
      db.close()
      return NextResponse.json({ ok: true })
    }

    if (body.action === 'delegate' && body.taskId && body.agent) {
      db.prepare("UPDATE tasks SET assigned_to=?,updated_at=? WHERE id=?").run(body.agent, now, body.taskId)
      // Log
      db.prepare("INSERT INTO task_log (task_id,action,actor,note,created_at) VALUES (?,?,?,?,?)").run(body.taskId, 'delegate', body.agent, body.note || '', now)
      db.close()
      return NextResponse.json({ ok: true })
    }

    db.close()
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
