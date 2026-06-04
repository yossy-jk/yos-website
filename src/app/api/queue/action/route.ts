import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY = 'yos:queue:pending'
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

// POST /api/queue/action
// Body: { id, action: 'approve'|'skip'|'edit'|'revision', feedback?, editedContent? }
export async function POST(req: Request) {
  const body = await req.json()
  const { id, action, feedback, editedContent } = body

  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  if (!id || !action) {
    return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

  // Get all pending items
  const rawItems = await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lrange/${QUEUE_KEY}/0/-1`)
  const items = (rawItems || []).map((s: string) => {
    try { return JSON.parse(s) } catch { return null }
  }).filter(Boolean)

  const itemIndex = items.findIndex((i: {id: string}) => i.id === id)
  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  const item = items[itemIndex]

  if (action === 'approve') {
    // Move item to archive with status=approved
    // Use approvedContent if edits were made, otherwise use current content
    const contentToApprove = editedContent || item.content
    const updated = {
      ...item,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedContent: contentToApprove,
      content: contentToApprove, // sync content field too
    }
    // Remove from pending queue
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lrem/${QUEUE_KEY}/1/${encodeURIComponent(JSON.stringify(item))}`, 'POST')
    // Push to archive
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/rpush/${ARCHIVE_KEY}/${encodeURIComponent(JSON.stringify(updated))}`, 'POST')
    return NextResponse.json({ ok: true, action: 'approved', id })

  } else if (action === 'skip') {
    // Move to archive with status=skipped
    const updated = {
      ...item,
      status: 'skipped',
      skippedAt: new Date().toISOString(),
      skipReason: feedback || '',
    }
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lrem/${QUEUE_KEY}/1/${encodeURIComponent(JSON.stringify(item))}`, 'POST')
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/rpush/${ARCHIVE_KEY}/${encodeURIComponent(JSON.stringify(updated))}`, 'POST')
    return NextResponse.json({ ok: true, action: 'skipped', id })

  } else if (action === 'edit') {
    // Update content in place, keep in pending queue as 'pending-revised'
    const updated = {
      ...item,
      content: editedContent || item.content,
      status: 'pending-revised',
      revisionNote: feedback || '',
      updatedAt: new Date().toISOString(),
      editCount: (item.editCount || 0) + 1,
    }
    // Replace item at current index
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lset/${QUEUE_KEY}/${itemIndex}/${encodeURIComponent(JSON.stringify(updated))}`, 'POST')
    return NextResponse.json({ ok: true, action: 'edited', id })

  } else if (action === 'revision') {
    // Request revision: send back to queue with feedback note
    // Same as edit but with explicit revision status
    const updated = {
      ...item,
      status: 'pending-revision',
      revisionNote: feedback || '',
      updatedAt: new Date().toISOString(),
      revisionCount: (item.revisionCount || 0) + 1,
    }
    await redisFetch(UPSTASH_URL, UPSTASH_TOKEN, `/lset/${QUEUE_KEY}/${itemIndex}/${encodeURIComponent(JSON.stringify(updated))}`, 'POST')
    return NextResponse.json({ ok: true, action: 'revision-requested', id })

  } else {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  }
}