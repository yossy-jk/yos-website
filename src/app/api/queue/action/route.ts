/**
 * POST /api/queue/action
 *
 * Performs an action on a queue item:
 *   - approve   → publish to live blog + remove from v2 queue + archive
 *   - edit      → update item in v2 queue (stays in queue)
 *   - revision  → update item in v2 queue (stays in queue, flagged)
 *   - skip      → remove from v2 queue + archive as skipped
 *
 * All reads and writes go to yos:queue:pending:v2 (JSON array).
 *
 * Auth: requireAuth session cookie
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY_V2 = 'yos:queue:pending:v2'
const ARCHIVE_KEY  = 'yos:queue:archive'
const LIVE_KEY     = 'yos:blog:live'

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

// Archive is stored as a Redis LIST (items appended with RPUSH, read with LRANGE)
async function redisRpush(url: string, token: string, key: string, value: string): Promise<void> {
  await fetch(`${url}/rpush/${encodeURIComponent(key)}/${encodeURIComponent(value)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
}

// ── Blog post publish ───────────────────────────────────────────────────────

const VALID_DIVISIONS = ['tenant-rep', 'buyers-agency', 'furniture', 'cleaning', 'general', 'lease-intel']

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

async function publishToLive(item: Record<string, unknown>, content: string): Promise<string> {
  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!
  const meta = (item.metadata as Record<string, unknown>) || {}

  const slug = (meta.slug as string) || slugify(item.title as string)
  const division: string = VALID_DIVISIONS.includes(meta.division as string)
    ? (meta.division as string) : 'general'
  const excerpt = (meta.excerpt as string) ||
    content.replace(/[#\n\r*_]/g, ' ').trim().slice(0, 160) || content.split('.')[0] + '.'

  const post = {
    slug,
    title: item.title as string,
    excerpt: excerpt.slice(0, 200),
    date: (meta.scheduledFor as string) || new Date().toISOString().split('T')[0],
    division,
    author: (meta.author as string) || 'Joe Kelley',
    body: content,
    tags: (meta.tags as string[]) || [(meta.targetKeyword as string || ''), division].filter(Boolean),
    heroImage: meta.heroImage as string | undefined,
    metaTitle: meta.metaTitle as string | undefined,
    metaDescription: meta.metaDescription as string | undefined,
  }

  // Set in live blog hash
  await fetch(`${UPSTASH_URL}/hset/${encodeURIComponent(LIVE_KEY)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([post.slug, JSON.stringify(post)]),
  })

  return slug
}

// ── POST ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const { id, action, feedback, editedContent } = body as {
    id?: string
    action?: string
    feedback?: string
    editedContent?: string
  }

  if (!id || !action) {
    return NextResponse.json({ error: 'Missing id or action' }, { status: 400 })
  }

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

  // Load queue from v2 key
  const rawQueue = normaliseValue(await redisGet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2))
  const queue: Record<string, unknown>[] = Array.isArray(rawQueue) ? rawQueue as Record<string, unknown>[] : []

  const itemIndex = queue.findIndex(i => String(i.id) === id)
  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found in queue' }, { status: 404 })
  }

  const item = queue[itemIndex]

  if (action === 'approve') {
    if ((item.type as string) !== 'blog-post') {
      return NextResponse.json({ error: 'Only blog-post items can be approved here' }, { status: 400 })
    }
    const contentToApprove = editedContent || (item.content as string)

    // Publish to live blog
    const slug = await publishToLive(item, contentToApprove)

    // Remove from v2 queue
    queue.splice(itemIndex, 1)
    await redisSet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2, JSON.stringify(queue))

    // Archive — append to list (publish-scheduled reads it as LRANGE list)
    await redisRpush(UPSTASH_URL, UPSTASH_TOKEN, ARCHIVE_KEY, JSON.stringify({
      ...item,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedContent: contentToApprove,
      content: contentToApprove,
      publishedAt: new Date().toISOString(),
    }))

    return NextResponse.json({ ok: true, action: 'approved', id, slug })

  } else if (action === 'edit') {
    if (!editedContent?.trim()) {
      return NextResponse.json({ error: 'editedContent required for edit action' }, { status: 400 })
    }
    queue[itemIndex] = {
      ...item,
      content: editedContent,
      status: 'pending-revised',
      revisionNote: feedback || '',
      updatedAt: new Date().toISOString(),
      editCount: ((item.editCount as number) || 0) + 1,
    }
    await redisSet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2, JSON.stringify(queue))
    return NextResponse.json({ ok: true, action: 'edited', id })

  } else if (action === 'revision') {
    if (!feedback?.trim()) {
      return NextResponse.json({ error: 'feedback required for revision action' }, { status: 400 })
    }
    queue[itemIndex] = {
      ...item,
      status: 'pending-revision',
      revisionNote: feedback,
      updatedAt: new Date().toISOString(),
      revisionCount: ((item.revisionCount as number) || 0) + 1,
    }
    await redisSet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2, JSON.stringify(queue))
    return NextResponse.json({ ok: true, action: 'revision-requested', id })

  } else if (action === 'skip') {
    queue.splice(itemIndex, 1)
    await redisSet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2, JSON.stringify(queue))

    // Archive — append to list
    await redisRpush(UPSTASH_URL, UPSTASH_TOKEN, ARCHIVE_KEY, JSON.stringify({
      ...item,
      status: 'skipped',
      skippedAt: new Date().toISOString(),
      skipReason: feedback || '',
    }))

    return NextResponse.json({ ok: true, action: 'skipped', id })

  } else {
    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  }
}
