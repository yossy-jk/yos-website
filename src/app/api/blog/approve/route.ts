/**
 * POST /api/blog/approve
 *
 * Immediately approves a blog post from the v2 queue and publishes it live.
 * Mirrors queue/action 'approve' but is the direct path called by the UI
 * Approve button in approvals-tab.tsx.
 *
 * Reads and writes: yos:queue:pending:v2
 * Publishes to: yos:blog:live (hash)
 * Archives to: yos:queue:archive
 *
 * Auth: requireAuth session cookie
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY_V2 = 'yos:queue:pending:v2'
const ARCHIVE_KEY  = 'yos:queue:archive'
const LIVE_KEY     = 'yos:blog:live'

const VALID_DIVISIONS = ['tenant-rep', 'buyers-agency', 'furniture', 'cleaning', 'general', 'lease-intel']

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

// ── Slug helper ─────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

// ── POST ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const { id, editedContent } = body as { id?: string; editedContent?: string }

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

  // ── Load from v2 queue ─────────────────────────────────────────────────
  const rawQueue = normaliseValue(await redisGet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2))
  const queue: Record<string, unknown>[] = Array.isArray(rawQueue) ? rawQueue as Record<string, unknown>[] : []

  const itemIndex = queue.findIndex(i => String(i.id) === id)
  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found in queue' }, { status: 404 })
  }

  const item = queue[itemIndex]

  if ((item.type as string) !== 'blog-post') {
    return NextResponse.json({ error: 'Only blog-post items can be approved here' }, { status: 400 })
  }

  const content = (editedContent || item.content) as string
  const meta    = (item.metadata as Record<string, unknown>) || {}

  // ── Build and publish post ───────────────────────────────────────────────
  const slug     = (meta.slug as string) || slugify(item.title as string)
  const division: string = VALID_DIVISIONS.includes(meta.division as string)
    ? (meta.division as string) : 'general'
  const excerpt = (meta.excerpt as string) ||
    content.replace(/[#\n\r*_]/g, ' ').trim().slice(0, 160) ||
    (content.split('.')[0] || '') + '.'

  const post = {
    slug,
    title:  item.title as string,
    excerpt: excerpt.slice(0, 200),
    date:   (meta.scheduledFor as string) || new Date().toISOString().split('T')[0],
    division,
    author: (meta.author as string) || 'Joe Kelley',
    body:   content,
    tags:   (meta.tags as string[]) || [(meta.targetKeyword as string || ''), division].filter(Boolean),
    heroImage:       meta.heroImage       as string | undefined,
    metaTitle:       meta.metaTitle       as string | undefined,
    metaDescription: meta.metaDescription as string | undefined,
  }

  // Publish to live blog hash
  await fetch(`${UPSTASH_URL}/hset/${encodeURIComponent(LIVE_KEY)}`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify([post.slug, JSON.stringify(post)]),
  })

  // ── Remove from v2 queue ────────────────────────────────────────────────
  queue.splice(itemIndex, 1)
  await redisSet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2, JSON.stringify(queue))

  // ── Archive ──────────────────────────────────────────────────────────────
  const archiveRaw = normaliseValue(await redisGet(UPSTASH_URL, UPSTASH_TOKEN, ARCHIVE_KEY))
  const archive: Record<string, unknown>[] = Array.isArray(archiveRaw) ? archiveRaw as Record<string, unknown>[] : []
  archive.push({
    ...item,
    status:         'approved',
    approvedAt:     new Date().toISOString(),
    approvedContent: content,
    content,
    publishedAt:    new Date().toISOString(),
  })
  await redisSet(UPSTASH_URL, UPSTASH_TOKEN, ARCHIVE_KEY, JSON.stringify(archive))

  return NextResponse.json({
    ok: true,
    action: 'published',
    id,
    slug,
    title:  item.title,
    message: `Published to ${post.division}/${post.slug}`,
  })
}
