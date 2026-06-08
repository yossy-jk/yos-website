import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY   = 'yos:queue:pending'
const ARCHIVE_KEY = 'yos:queue:archive'

async function redisFetch(url: string, token: string, path: string, method = 'GET', body?: unknown) {
  const res = await fetch(`${url}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const d = await res.json()
  return d.result
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

// Serialize for Redis — match what the agent writes (double-encoded)
function serializeForRedis(obj: Record<string, unknown>): string {
  return JSON.stringify(JSON.stringify(obj))
}

export async function POST(req: Request) {
  const body = await req.json()
  const { id, action, feedback, editedContent } = body

  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  if (!id || !action) {
    return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })
  }

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

  const rawItems = await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${QUEUE_KEY}/0/-1`)
  const items = (rawItems || [])
    .map((s: string) => parseQueueItem(s))
    .filter(Boolean) as Record<string, unknown>[]

  const itemIndex = items.findIndex((i: Record<string, unknown>) => String(i.id) === id)
  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  const item = items[itemIndex]

  if (action === 'approve') {
    const contentToApprove = editedContent || item.content
    const updated = {
      ...item,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedContent: contentToApprove,
      content: contentToApprove,
    }
    // Remove double-encoded item from Redis
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lrem/${QUEUE_KEY}/1/${encodeURIComponent(serializeForRedis(item))}`, 'POST')
    // Archive as double-encoded
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/rpush/${ARCHIVE_KEY}/${encodeURIComponent(serializeForRedis(updated))}`, 'POST')
    return NextResponse.json({ ok: true, action: 'approved', id })

  } else if (action === 'skip') {
    const updated = {
      ...item,
      status: 'skipped',
      skippedAt: new Date().toISOString(),
      skipReason: feedback || '',
    }
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lrem/${QUEUE_KEY}/1/${encodeURIComponent(serializeForRedis(item))}`, 'POST')
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/rpush/${ARCHIVE_KEY}/${encodeURIComponent(serializeForRedis(updated))}`, 'POST')
    return NextResponse.json({ ok: true, action: 'skipped', id })

  } else if (action === 'edit') {
    const updated = {
      ...item,
      content: editedContent || item.content,
      status: 'pending-revised',
      revisionNote: feedback || '',
      updatedAt: new Date().toISOString(),
      editCount: (item.editCount as number || 0) + 1,
    }
    // Replace item in list (lset needs raw string, not double-encoded)
    const rawItems = await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${QUEUE_KEY}/0/-1`) as string[]
    const rawIndex = rawItems.findIndex(s => {
      const p = parseQueueItem(s)
      return p && String(p.id) === id
    })
    if (rawIndex !== -1) {
      await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lset/${QUEUE_KEY}/${rawIndex}/${encodeURIComponent(serializeForRedis(updated))}`, 'POST')
    }
    return NextResponse.json({ ok: true, action: 'edited', id })

  } else if (action === 'revision') {
    const updated = {
      ...item,
      status: 'pending-revision',
      revisionNote: feedback || '',
      updatedAt: new Date().toISOString(),
      revisionCount: (item.revisionCount as number || 0) + 1,
    }
    const rawItems = await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${QUEUE_KEY}/0/-1`) as string[]
    const rawIndex = rawItems.findIndex(s => {
      const p = parseQueueItem(s)
      return p && String(p.id) === id
    })
    if (rawIndex !== -1) {
      await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lset/${QUEUE_KEY}/${rawIndex}/${encodeURIComponent(serializeForRedis(updated))}`, 'POST')
    }
    return NextResponse.json({ ok: true, action: 'revision-requested', id })

  } else {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  }
}
