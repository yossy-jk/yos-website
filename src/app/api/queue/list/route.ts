import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY_V2     = 'yos:queue:pending:v2'
const QUEUE_KEY_LEGACY = 'yos:queue:pending'
const ARCHIVE_KEY       = 'yos:queue:archive'

// GET /get/{key} — single key (v2)
async function redisGet(url: string, token: string, key: string): Promise<unknown> {
  const res = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const d = await res.json() as { result?: unknown }
  return d.result ?? null
}

// LRANGE — list items
async function redisLrange(url: string, token: string, key: string, start: number, stop: number): Promise<string[]> {
  const res = await fetch(`${url}/lrange/${key}/${start}/${stop}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return []
  const d = await res.json() as { result?: unknown }
  const result = d.result
  if (!result) return []
  return (Array.isArray(result) ? result : []) as string[]
}

function decodeUpstashValue(result: unknown): unknown {
  if (!result) return null
  if (typeof result === 'object' && result !== null && 'value' in (result as object)) {
    const val = String((result as { value: unknown }).value)
    try {
      const decoded = Buffer.from(val, 'base64').toString('utf-8')
      return JSON.parse(decoded)
    } catch {
      return JSON.parse(val)
    }
  }
  return result
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

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ items: [], pending: [], archive: [] })
  }

  try {
    // Primary: v2 key (JSON array, base64-encoded)
    const v2Result = await redisGet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2)
    const v2Decoded = decodeUpstashValue(v2Result)
    if (v2Decoded && Array.isArray(v2Decoded)) {
      const items = (v2Decoded as unknown[]).filter(Boolean) as Record<string, unknown>[]
      return NextResponse.json({ items, pending: items, archive: [] })
    }

    // Fallback: legacy Redis list
    const pendingRaw = await redisLrange(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_LEGACY, 0, -1)
    const pending = pendingRaw.map(parseQueueItem).filter(Boolean) as Record<string, unknown>[]

    const archiveRaw = await redisLrange(UPSTASH_URL, UPSTASH_TOKEN, ARCHIVE_KEY, -20, -1)
    const archive = pendingRaw.length > 0
      ? [...archiveRaw].reverse().map(parseQueueItem).filter(Boolean) as Record<string, unknown>[]
      : []

    return NextResponse.json({ items: pending, pending, archive })
  } catch (e) {
    console.error('Queue list error:', e)
    return NextResponse.json({ items: [], pending: [], archive: [] })
  }
}