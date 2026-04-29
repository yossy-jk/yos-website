import { NextResponse } from 'next/server'

const QUEUE_KEY = 'yos:queue:pending'
const ARCHIVE_KEY = 'yos:queue:archive'

async function redisGet(url: string, token: string, path: string) {
  const res = await fetch(`${url}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const d = await res.json()
  return d.result
}

async function redisPost(url: string, token: string, path: string, body?: object) {
  const res = await fetch(`${url}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const d = await res.json()
  return d.result
}

// POST /api/queue/action
// Body: { id, action: 'approve'|'skip'|'edit', feedback?, token }
export async function POST(req: Request) {
  const body = await req.json()
  const { id, action, feedback, token, editedContent } = body

  const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'yos-joe-2026'
  if (token !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!id || !action) {
    return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

  // Get all pending items
  const rawItems = await redisGet(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${QUEUE_KEY}/0/-1`)
  const items = (rawItems || []).map((s: string) => {
    try { return JSON.parse(s) } catch { return null }
  }).filter(Boolean)

  const itemIndex = items.findIndex((i: {id: string}) => i.id === id)
  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  const item = items[itemIndex]

  if (action === 'approve') {
    // Mark approved, move to archive
    const updated = {
      ...item,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedContent: editedContent || item.content,
    }
    // Remove from pending
    await redisPost(UPSTASH_URL, UPSTASH_TOKEN, `/lrem/${QUEUE_KEY}/1/${encodeURIComponent(JSON.stringify(item))}`)
    // Push to archive
    await redisGet(UPSTASH_URL, UPSTASH_TOKEN, `/rpush/${ARCHIVE_KEY}/${encodeURIComponent(JSON.stringify(updated))}`)
    return NextResponse.json({ ok: true, action: 'approved', id })

  } else if (action === 'skip') {
    const updated = { ...item, status: 'skipped', skippedAt: new Date().toISOString(), skipReason: feedback || '' }
    await redisPost(UPSTASH_URL, UPSTASH_TOKEN, `/lrem/${QUEUE_KEY}/1/${encodeURIComponent(JSON.stringify(item))}`)
    await redisGet(UPSTASH_URL, UPSTASH_TOKEN, `/rpush/${ARCHIVE_KEY}/${encodeURIComponent(JSON.stringify(updated))}`)
    return NextResponse.json({ ok: true, action: 'skipped', id })

  } else if (action === 'edit') {
    // Update content in place with feedback
    const updated = {
      ...item,
      content: editedContent || item.content,
      status: 'pending',
      editFeedback: feedback || '',
      updatedAt: new Date().toISOString(),
      editCount: (item.editCount || 0) + 1,
    }
    // Replace in list — lset by index
    await redisPost(UPSTASH_URL, UPSTASH_TOKEN, `/lset/${QUEUE_KEY}/${itemIndex}/${encodeURIComponent(JSON.stringify(updated))}`)
    return NextResponse.json({ ok: true, action: 'edited', id })

  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
}
