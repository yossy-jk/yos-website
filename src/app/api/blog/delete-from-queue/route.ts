/**
 * POST /api/blog/delete-from-queue
 *
 * Permanently removes a blog post from the v2 queue.
 * The item is NOT archived — it's a hard delete.
 * Does NOT delete from yos:blog:live (already-published posts).
 *
 * Auth: requireAuth session cookie
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY_V2 = 'yos:queue:pending:v2'

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

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const { id } = body as { id?: string }

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

  // Load from v2 queue
  const rawQueue = normaliseValue(await redisGet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2))
  const queue: Record<string, unknown>[] = Array.isArray(rawQueue) ? rawQueue as Record<string, unknown>[] : []

  const itemIndex = queue.findIndex(i => String(i.id) === id)
  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found in queue' }, { status: 404 })
  }

  // Remove item
  queue.splice(itemIndex, 1)
  await redisSet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2, JSON.stringify(queue))

  return NextResponse.json({ ok: true, action: 'deleted', id })
}
