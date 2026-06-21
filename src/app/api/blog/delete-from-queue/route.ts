/**
 * POST /api/blog/delete-from-queue
 * Permanently removes a blog post from the queue without archiving it.
 * Use when a post is not suitable for the website.
 *
 * Auth: requireAuth session cookie
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY   = 'yos:queue:pending'
const ARCHIVE_KEY = 'yos:queue:archive'

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

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const body = await req.json()
  const { id } = body as { id?: string }

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

  // Find the item
  const rawItems = await redisFetch(
    UPSTASH_URL, UPSTASH_TOKEN,
    `/lrange/${QUEUE_KEY}/0/-1`
  ) as string[] | null

  const items = (rawItems || [])
    .map((s: string) => parseQueueItem(s))
    .filter(Boolean) as Record<string, unknown>[]

  const item = items.find((i: Record<string, unknown>) => String(i.id) === id)
  if (!item) {
    return NextResponse.json({ error: 'Item not found in queue' }, { status: 404 })
  }

  // Remove from pending — don't archive
  const removed = await redisFetch(
    UPSTASH_URL, UPSTASH_TOKEN,
    `/lrem/${QUEUE_KEY}/1/${encodeURIComponent(serializeForRedis(item))}`, 'POST'
  )

  return NextResponse.json({
    ok: true,
    action: 'deleted',
    id,
    removed: Number(removed) > 0,
  })
}
