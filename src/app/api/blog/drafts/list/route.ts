/**
 * GET /api/blog/drafts/list
 * Returns all pending blog drafts from the queue for Joe's review.
 * Auth: auth-v2 session cookie
 */
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY = 'yos:queue:pending'

export async function GET() {
  // Auth
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const url = process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!

  // Get all items in the pending queue
  const res = await fetch(`${url}/lrange/${QUEUE_KEY}/0/-1`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  const rawItems: string[] = data.result || []

  // Filter to blog-post type only, parse each
  const drafts = rawItems
    .map(s => {
      try { return JSON.parse(s) } catch { return null }
    })
    .filter((item): item is Record<string, unknown> =>
      item !== null && (item as Record<string, unknown>)['type'] === 'blog-post'
    )
    .map(item => ({
      id: item.id,
      title: item.title,
      status: item.status,
      excerpt: (item.metadata as Record<string, unknown> | null)?.excerpt || '',
      division: (item.metadata as Record<string, unknown> | null)?.division || '',
      targetKeyword: (item.metadata as Record<string, unknown> | null)?.targetKeyword || '',
      tags: (item.metadata as Record<string, unknown> | null)?.tags || [],
      author: (item.metadata as Record<string, unknown> | null)?.author || '',
      scheduledFor: (item.metadata as Record<string, unknown> | null)?.scheduledFor || '',
      generatedAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))

  return NextResponse.json({ ok: true, count: drafts.length, drafts })
}