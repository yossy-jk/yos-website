import { NextResponse } from 'next/server'

const QUEUE_KEY = 'yos:queue:pending'
const ARCHIVE_KEY = 'yos:queue:archive'

async function redis(url: string, token: string, path: string) {
  const res = await fetch(`${url}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Redis error ${res.status}`)
  const d = await res.json()
  return d.result
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'yos-joe-2026'
  if (token !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ pending: [], archive: [] })
  }

  try {
    // Get all pending items
    const pendingRaw = await redis(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${QUEUE_KEY}/0/-1`)
    const pending = (pendingRaw || []).map((s: string) => {
      try { return JSON.parse(s) } catch { return null }
    }).filter(Boolean)

    // Get recent archive (last 20)
    const archiveRaw = await redis(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${ARCHIVE_KEY}/-20/-1`)
    const archive = (archiveRaw || []).map((s: string) => {
      try { return JSON.parse(s) } catch { return null }
    }).filter(Boolean).reverse()

    return NextResponse.json({ pending, archive })
  } catch (e) {
    console.error('Queue list error:', e)
    return NextResponse.json({ pending: [], archive: [] })
  }
}
