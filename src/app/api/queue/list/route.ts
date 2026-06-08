import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

// Primary: yos:queue:pending:v2 — JSON array of all pending items (base64 set, handles large values)
// Fallback: yos:queue:pending — Redis list (may have encoding issues for large items)
const QUEUE_KEY_V2    = '***'
const QUEUE_KEY_LEGACY = '***'
const ARCHIVE_KEY      = '***'

async function redisGet(url: string, token: string, path: string) {
  const res = await fetch(`${url}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Redis error ${res.status}`)
  const d = await res.json()
  return d.result
}

async function redisGetJson(url: string, token: string, key: string) {
  // GET /get/{key} — returns base64-encoded JSON for large values
  const res = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Redis error ${res.status}`)
  const d = await res.json()
  const result = d.result
  if (!result) return null
  // result is base64-encoded JSON
  const decoded = Buffer.from(result, 'base64').toString('utf-8')
  return JSON.parse(decoded)
}

function parseQueueItem(s: string | null): Record<string, unknown> | null {
  if (!s) return null
  try {
    const parsed = JSON.parse(s)
    if (typeof parsed === 'string') return JSON.parse(parsed)
    return parsed
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const UPSTASH_URL    = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN  = proces…OKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ items: [], pending: [], archive: [] })
  }

  try {
    // Try v2 key first (JSON array of all pending items)
    const v2Data = await redisGetJson(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2)
    if (v2Data && Array.isArray(v2Data)) {
      const items = v2Data.filter(Boolean)
      return NextResponse.json({ items, pending: items, archive: [] })
    }

    // Fallback: legacy Redis list
    const pendingRaw = await redisGet(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${QUEUE_KEY_LEGACY}/0/-1`)
    const pending = (pendingRaw || [])
      .map(parseQueueItem)
      .filter(Boolean) as Record<string, unknown>[]

    const archiveRaw = await redisGet(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${ARCHIVE_KEY}/-20/-1`)
    const archive = (archiveRaw || [])
      .map(parseQueueItem)
      .filter(Boolean)
      .reverse() as Record<string, unknown>[]

    return NextResponse.json({ items: pending, pending, archive })
  } catch (e) {
    console.error('Queue list error:', e)
    return NextResponse.json({ items: [], pending: [], archive: [] })
  }
}
