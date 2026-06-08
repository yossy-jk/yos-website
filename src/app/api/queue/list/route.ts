import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY   = 'yos:queue:pending'
const ARCHIVE_KEY = 'yos:queue:archive'

async function redis(url: string, token: string, path: string) {
  const res = await fetch(`${url}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Redis error ${res.status}`)
  const d = await res.json()
  return d.result
}

function parseQueueItem(s: string | null): Record<string, unknown> | null {
  if (!s) return null
  try {
    const parsed = JSON.parse(s)
    // Handle double-encoded items (agent bug — writes JSON.stringify twice)
    if (typeof parsed === 'string') {
      return JSON.parse(parsed)
    }
    return parsed
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const UPSTASH_URL    = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN  = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ items: [], pending: [], archive: [] })
  }

  try {
    const pendingRaw = await redis(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${QUEUE_KEY}/0/-1`)
    const pending = (pendingRaw || [])
      .map(parseQueueItem)
      .filter(Boolean) as Record<string, unknown>[]

    const archiveRaw = await redis(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${ARCHIVE_KEY}/-20/-1`)
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
