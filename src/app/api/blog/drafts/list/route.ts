/**
 * GET /api/blog/drafts/list
 * Returns all pending blog-post items from the v2 queue.
 * Used by the blog drafts panel in the dashboard.
 *
 * Auth: requireAuth session cookie
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_KEY_V2 = 'yos:queue:pending:v2'

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

// ── GET ────────────────────────────────────────────────────────────────────

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL!
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

  try {
    const rawQueue = normaliseValue(await redisGet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2))
    const queue: Record<string, unknown>[] = Array.isArray(rawQueue) ? rawQueue as Record<string, unknown>[] : []

    const drafts = queue
      .filter(i => i.type === 'blog-post')
      .map(item => {
        const meta = (item.metadata as Record<string, unknown>) || {}
        return {
          id:            String(item.id),
          title:         String(item.title),
          status:        String(item.status || 'pending'),
          excerpt:       String(meta.excerpt || ''),
          division:      String(meta.division || ''),
          targetKeyword: String(meta.targetKeyword || ''),
          tags:          Array.isArray(meta.tags) ? meta.tags as string[] : [],
          author:        String(meta.author || ''),
          scheduledFor:  String(meta.scheduledFor || ''),
          generatedAt:   String(item.createdAt || ''),
          updatedAt:     String(item.updatedAt || ''),
        }
      })

    return NextResponse.json({ ok: true, count: drafts.length, drafts })
  } catch (e) {
    console.error('[blog/drafts/list] Error:', e)
    return NextResponse.json({ ok: false, error: 'Failed to load drafts' }, { status: 500 })
  }
}
