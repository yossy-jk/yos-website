/**
 * POST /api/blog/approve
 * Immediately approves a blog post and publishes it to the live blog.
 * Replaces the cron-based publish flow with direct approval → publish.
 *
 * Auth: requireAuth session cookie
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY   = 'yos:queue:pending'
const ARCHIVE_KEY = 'yos:queue:archive'
const LIVE_KEY    = 'yos:blog:live'

const VALID_DIVISIONS = ['tenant-rep', 'buyers-agency', 'furniture', 'cleaning', 'general', 'lease-intel']

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  division: string
  author: string
  body: string
  tags: string[]
  heroImage?: string
  metaTitle?: string
  metaDescription?: string
}

async function redisFetch(
  url: string, token: string,
  path: string, method = 'GET', body?: unknown
): Promise<unknown> {
  const res = await fetch(`${url}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const d = await res.json()
  return d.result
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

function serializeForRedis(obj: Record<string, unknown>): string {
  return JSON.stringify(JSON.stringify(obj))
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export async function POST(req: NextRequest) {
  // Auth
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const { id, editedContent } = body as { id?: string; editedContent?: string }

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

  // ── Find the item in the queue ───────────────────────────────────────────
  const rawItems = await redisFetch(
    UPSTASH_URL, UPSTASH_TOKEN,
    `/lrange/${QUEUE_KEY}/0/-1`
  ) as string[] | null

  const items = (rawItems || [])
    .map((s: string) => parseQueueItem(s))
    .filter(Boolean) as Record<string, unknown>[]

  const itemIndex = items.findIndex(
    (i: Record<string, unknown>) => String(i.id) === id
  )
  if (itemIndex === -1) {
    return NextResponse.json({ error: 'Item not found in queue' }, { status: 404 })
  }

  const item = items[itemIndex]

  if ((item.type as string) !== 'blog-post') {
    return NextResponse.json({ error: 'Only blog-post items can be approved here' }, { status: 400 })
  }

  const content = (editedContent || item.content) as string
  const meta    = (item.metadata as Record<string, unknown>) || {}

  // ── Build the blog post ───────────────────────────────────────────────────
  const slug     = (meta.slug as string) || slugify(item.title as string)
  const division: string = VALID_DIVISIONS.includes(meta.division as string)
    ? (meta.division as string)
    : 'general'
  const excerpt = (meta.excerpt as string) ||
    content.slice(0, 160).replace(/[#\n\r*_]/g, ' ').trim() ||
    content.split('.')[0] + '.'

  const post: BlogPost = {
    slug,
    title:  item.title  as string,
    excerpt: excerpt.slice(0, 200),
    date:   (meta.scheduledFor as string) || new Date().toISOString().split('T')[0],
    division,
    author: (meta.author as string) || 'Joe Kelley',
    body:   content,
    tags:   (meta.tags as string[]) || [(meta.targetKeyword as string || ''), division].filter(Boolean),
    heroImage: meta.heroImage as string | undefined,
    metaTitle:       meta.metaTitle       as string | undefined,
    metaDescription: meta.metaDescription as string | undefined,
  }

  // ── Publish to live blog (Upstash hash) ──────────────────────────────────
  const postJson   = JSON.stringify(post)
  const encodedPost = encodeURIComponent(postJson)
  await fetch(`${UPSTASH_URL}/hset/${LIVE_KEY}/${slug}/${encodedPost}`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
  })

  // ── Remove from pending queue ─────────────────────────────────────────────
  await redisFetch(
    UPSTASH_URL, UPSTASH_TOKEN,
    `/lrem/${QUEUE_KEY}/1/${encodeURIComponent(serializeForRedis(item))}`, 'POST'
  )

  // ── Archive as approved ───────────────────────────────────────────────────
  const updated = {
    ...item,
    status:       'approved',
    approvedAt:   new Date().toISOString(),
    approvedContent: content,
    content,
    publishedAt:  new Date().toISOString(),
  }
  await redisFetch(
    UPSTASH_URL, UPSTASH_TOKEN,
    `/rpush/${ARCHIVE_KEY}/${encodeURIComponent(serializeForRedis(updated as Record<string, unknown>))}`, 'POST'
  )

  return NextResponse.json({
    ok: true,
    action:  'published',
    id,
    slug,
    title:   item.title,
    message: `Published to ${post.division}/${post.slug}`,
  })
}
