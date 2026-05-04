/**
 * POST /api/blog/publish-scheduled
 * Called by a daily cron at 6am AEST.
 * Reads approved blog-posts from the queue archive where scheduledFor <= today,
 * writes them to Redis (yos:blog:live), and marks them as published.
 *
 * Auth: x-queue-secret header
 */

import { NextResponse } from 'next/server'
import type { BlogPost, Division } from '@/lib/blog'

const ARCHIVE_KEY = 'yos:queue:archive'
const LIVE_KEY    = 'yos:blog:live'

const VALID_DIVISIONS = ['tenant-rep', 'buyers-agency', 'furniture', 'cleaning', 'general', 'lease-intel']

function getRedisBase() {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  }
}

async function redisGet(url: string, token: string, path: string) {
  const res = await fetch(`${url}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const d = await res.json() as { result: unknown }
  return d.result
}

async function redisPost(url: string, token: string, path: string, body: unknown) {
  const res = await fetch(`${url}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const d = await res.json() as { result: unknown }
  return d.result
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-queue-secret')
  const QUEUE_SECRET = process.env.QUEUE_SECRET || 'yos-queue-2026'
  if (secret !== QUEUE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { url, token } = getRedisBase()
  if (!url || !token) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
  }

  // Get today's date in AEST (UTC+10)
  const nowAEST = new Date(Date.now() + 10 * 60 * 60 * 1000)
  const todayStr = nowAEST.toISOString().split('T')[0] // YYYY-MM-DD

  // Read all items from archive
  const rawItems = await redisGet(url, token, `/lrange/${ARCHIVE_KEY}/0/-1`) as string[] | null
  if (!rawItems || rawItems.length === 0) {
    return NextResponse.json({ ok: true, published: 0, message: 'No items in archive' })
  }

  const items = rawItems
    .map(s => { try { return JSON.parse(s) } catch { return null } })
    .filter(Boolean) as Array<{
      id: string
      type: string
      title: string
      content: string
      status: string
      metadata?: {
        division?: string
        slug?: string
        excerpt?: string
        targetKeyword?: string
        scheduledFor?: string
        author?: string
        tags?: string[]
      }
      publishedAt?: string
    }>

  // Filter: approved blog-posts with scheduledFor <= today, not yet published
  const due = items.filter(item =>
    item.type === 'blog-post' &&
    item.status === 'approved' &&
    !item.publishedAt &&
    item.metadata?.scheduledFor &&
    item.metadata.scheduledFor <= todayStr
  )

  if (due.length === 0) {
    return NextResponse.json({ ok: true, published: 0, message: `No posts due for ${todayStr}` })
  }

  const published: string[] = []
  const failed: string[] = []

  for (const item of due) {
    try {
      const meta = item.metadata || {}
      const slug = meta.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const division = (VALID_DIVISIONS.includes(meta.division || '') ? meta.division : 'general') as Division

      const post: BlogPost = {
        slug,
        title: item.title,
        excerpt: meta.excerpt || item.content.slice(0, 160).replace(/[#\n]/g, ' ').trim(),
        date: meta.scheduledFor || todayStr,
        division,
        author: meta.author || 'Joe Kelley',
        body: item.content,
        tags: meta.tags || [meta.targetKeyword || '', division].filter(Boolean),
      }

      // Write to Redis live hash
      await redisPost(url, token, `/hset/${LIVE_KEY}`, [slug, JSON.stringify(post)])

      // Update the archive item to mark as published
      const updatedItem = { ...item, status: 'published', publishedAt: new Date().toISOString() }

      // Remove old entry and push updated one
      await fetch(`${url}/lrem/${ARCHIVE_KEY}/1/${encodeURIComponent(JSON.stringify(item))}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      await redisGet(url, token, `/rpush/${ARCHIVE_KEY}/${encodeURIComponent(JSON.stringify(updatedItem))}`)

      published.push(slug)
    } catch (err) {
      console.error('Failed to publish post:', item.title, err)
      failed.push(item.title)
    }
  }

  return NextResponse.json({
    ok: true,
    published: published.length,
    publishedSlugs: published,
    failed: failed.length > 0 ? failed : undefined,
    date: todayStr,
  })
}
