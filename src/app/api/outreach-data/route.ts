/**
 * GET /api/outreach-data
 * Returns outreach pipeline metrics from Upstash Redis.
 * Data pushed by push-outreach-to-redis.py daily + after each drafter run.
 */
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL   || ''
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const OUTREACH_KEY = 'yos:outreach:summary'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({ error: 'Redis not configured' })
  }

  try {
    const res = await fetch(
      `${REDIS_URL}/get/${encodeURIComponent(OUTREACH_KEY)}`,
      { headers: { Authorization: `Bearer ${REDIS_TOKEN}` }, cache: 'no-store' }
    )
    if (res.ok) {
      const d = await res.json() as { result?: string | null }
      if (d.result) {
        return NextResponse.json(JSON.parse(d.result))
      }
    }
  } catch { /* fall through */ }

  return NextResponse.json({
    error: 'No outreach data yet',
    total: 0, drafted: 0, replied: 0, bounced: 0, new: 0,
    recentDrafts: [], topOrgs: []
  })
}
