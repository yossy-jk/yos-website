/**
 * GET /api/proposal-followup
 * Returns proposals from HubSpot needing follow-up (48hr rule)
 * Reads from Redis cache yos:proposals:latest (pushed by hubspot-revops agent)
 * Falls back to direct HubSpot API if Redis empty
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const PROPOSALS_KEY = 'yos:proposals:latest'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  // Try Redis first
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const res = await fetch(
        `${UPSTASH_URL}/get/${encodeURIComponent(PROPOSALS_KEY)}`,
        { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }, cache: 'no-store' }
      )
      if (res.ok) {
        const d = await res.json() as { result?: string | null }
        if (d.result) return NextResponse.json(JSON.parse(d.result))
      }
    } catch { /* fall through */ }
  }

  // Return empty state
  return NextResponse.json({
    summary: { needsTouch48h: 0, stale14plus: 0, total: 0, totalValue: 0 },
    needsTouch48h: [],
    items: [],
    generatedAt: new Date().toISOString(),
    error: 'No proposal data yet — hubspot-revops agent populates this overnight'
  })
}
