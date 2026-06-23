/**
 * POST /api/queue/submit
 *
 * Agents call this to submit items to Joe's approval queue.
 * All items are written to yos:queue:pending:v2 (JSON array).
 *
 * Body: { type, title, content, agentId, metadata?, priority? }
 * Auth: x-queue-secret header matching QUEUE_SECRET env var
 */
import { NextResponse } from 'next/server'

const QUEUE_KEY_V2 = 'yos:queue:pending:v2'
const VALID_TYPES   = ['linkedin-post', 'proposal', 'cold-email', 'invoice-chaser', 'tender-decision', 'blog-post', 'blog-request', 'email-draft', 'other']

// ── Upstash helpers ───────────────────────────────────────────────────────

async function redisGet(url: string, token: string, key: string): Promise<unknown> {
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const d = await res.json() as { result?: unknown }
  return d.result ?? null
}

function normaliseValue(raw: unknown): unknown {
  if (!raw) return null
  if (typeof raw === 'object' && raw !== null && 'result' in (raw as object)) {
    return normaliseValue((raw as { result: unknown }).result)
  }
  if (typeof raw === 'object' && raw !== null && 'value' in (raw as object)) {
    const val = String((raw as { value: unknown }).value)
    try {
      const decoded = Buffer.from(val, 'base64').toString('utf-8')
      const parsed = JSON.parse(decoded)
      if (typeof parsed === 'string') return JSON.parse(parsed)
      return parsed
    } catch {
      try { return JSON.parse(val) } catch { return val }
    }
  }
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return raw }
  }
  return raw
}

async function redisSet(url: string, token: string, key: string, value: string): Promise<void> {
  await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  })
}

// ── POST ────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const secret = req.headers.get('x-queue-secret')
  const QUEUE_SECRET = process.env.QUEUE_SECRET || 'yos-queue-2026'
  if (secret !== QUEUE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { type, title, content, agentId, metadata, priority } = body

  if (!type || !title) {
    return NextResponse.json({ error: 'Missing required fields: type, title' }, { status: 400 })
  }

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 })
  }

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
  }

  const newItem: Record<string, unknown> = {
    id: crypto.randomUUID(),
    type,
    title,
    content,
    agentId: agentId || 'unknown',
    metadata: metadata || {},
    priority: priority || 'normal',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Load existing v2 queue, append new item, write back
  const rawQueue = normaliseValue(await redisGet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2))
  const queue: Record<string, unknown>[] = Array.isArray(rawQueue) ? rawQueue as Record<string, unknown>[] : []
  queue.push(newItem)
  await redisSet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2, JSON.stringify(queue))

  return NextResponse.json({ ok: true, id: newItem.id })
}
