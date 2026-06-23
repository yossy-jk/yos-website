/**
 * GET /api/queue/list
 *
 * Returns all pending items from the queue (v2 JSON array).
 * Falls back to legacy Redis list only if v2 key is empty (migration path).
 * The legacy list is NOT written to — all writes go through v2.
 *
 * Response: { items: BlogItem[], pending: BlogItem[], archive: BlogItem[] }
 *
 * Auth: requireAuth session cookie (v1 — legacy auth)
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY_V2     = 'yos:queue:pending:v2'
const QUEUE_KEY_LEGACY = 'yos:queue:pending'
const ARCHIVE_KEY       = 'yos:queue:archive'

// ── Upstash REST helpers ───────────────────────────────────────────────────

async function redisGet(url: string, token: string, key: string): Promise<unknown> {
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const d = await res.json() as { result?: unknown }
  return d.result ?? null
}

async function redisLrange(url: string, token: string, key: string, start: number, stop: number): Promise<string[]> {
  const res = await fetch(`${url}/lrange/${encodeURIComponent(key)}/${start}/${stop}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  const d = await res.json() as { result?: unknown }
  const result = d.result
  if (!result) return []
  return (Array.isArray(result) ? result : []) as string[]
}

// ── Decode helpers ─────────────────────────────────────────────────────────

/**
 * Upstash REST can store values in two formats:
 *   1. { value: "base64-encoded-json" }   — most common
 *   2. plain JSON string                   — when set directly
 * 3. { result: { ... } }                   — when GET wraps it
 *
 * We normalise all of these to a plain JS value.
 */
function normaliseValue(raw: unknown): unknown {
  if (!raw) return null
  // Upstash GET wraps in { result: ... }
  if (typeof raw === 'object' && raw !== null && 'result' in (raw as object)) {
    return normaliseValue((raw as { result: unknown }).result)
  }
  // Upstash GET single key: { value: "base64string" } or plain string
  if (typeof raw === 'object' && raw !== null && 'value' in (raw as object)) {
    const val = String((raw as { value: unknown }).value)
    // Might be base64-encoded JSON
    try {
      const decoded = Buffer.from(val, 'base64').toString('utf-8')
      const parsed = JSON.parse(decoded)
      // If it's double-encoded, decode again
      if (typeof parsed === 'string') return JSON.parse(parsed)
      return parsed
    } catch {
      // Not base64, try as plain JSON
      try { return JSON.parse(val) } catch { return val }
    }
  }
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return raw }
  }
  return raw
}

function parseQueueItem(s: string | null): Record<string, unknown> | null {
  if (!s) return null
  try {
    const p = JSON.parse(s)
    return typeof p === 'string' ? JSON.parse(p) : p
  } catch {
    return null
  }
}

// ── GET ─────────────────────────────────────────────────────────────────────

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ items: [], pending: [], archive: [] })
  }

  try {
    // ── Primary: v2 JSON array ───────────────────────────────────────────
    const v2Raw = await redisGet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2)
    const v2Val = normaliseValue(v2Raw)

    if (Array.isArray(v2Val)) {
      const items = (v2Val as unknown[]).filter(Boolean) as Record<string, unknown>[]
      // Fetch archive (last 50, reversed to newest first)
      const archiveRaw = await redisLrange(UPSTASH_URL, UPSTASH_TOKEN, ARCHIVE_KEY, -50, -1)
      const archive = [...archiveRaw].reverse().map(parseQueueItem).filter(Boolean) as Record<string, unknown>[]
      return NextResponse.json({ items, pending: items, archive })
    }

    // ── Fallback: legacy Redis list (migration path) ─────────────────────
    // Only hit this if v2 key is absent/empty (first run after migration)
    console.warn('[queue/list] v2 key empty — falling back to legacy list')
    const pendingRaw = await redisLrange(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_LEGACY, 0, -1)
    const pending = pendingRaw.map(parseQueueItem).filter(Boolean) as Record<string, unknown>[]

    // Migrate legacy items to v2 key in background (fire-and-forget)
    if (pending.length > 0) {
      fetch(`${UPSTASH_URL}/set/${encodeURIComponent(QUEUE_KEY_V2)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(JSON.stringify(pending)),
      }).catch(() => {})
    }

    const archiveRaw = await redisLrange(UPSTASH_URL, UPSTASH_TOKEN, ARCHIVE_KEY, -50, -1)
    const archive = [...archiveRaw].reverse().map(parseQueueItem).filter(Boolean) as Record<string, unknown>[]
    return NextResponse.json({ items: pending, pending, archive })

  } catch (e) {
    console.error('[queue/list] Error:', e)
    return NextResponse.json({ items: [], pending: [], archive: [] }, { status: 500 })
  }
}
