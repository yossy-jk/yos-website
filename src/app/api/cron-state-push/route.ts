/**
 * POST /api/cron-state-push
 * Receives OpenClaw cron job state from the Mac Mini (via launchd).
 * No auth required — uses a shared secret token in the header.
 *
 * Header:  x-cron-state-token: yos-joe-2026
 * Body:    JSON payload from yos-cron-state-push.js
 *
 * Stores the payload in Upstash Redis at key yos:openclaw:cron:state.
 * The operations-all endpoint reads from this Redis key.
 */

import { NextRequest, NextResponse } from 'next/server'

const CRON_TOKEN  = process.env.CRON_STATE_SECRET || process.env.DASHBOARD_TOKEN || ''
const UPSTASH_URL    = process.env.UPSTASH_REDIS_REST_URL    || ''
const UPSTASH_TOKEN  = process.env.UPSTASH_REDIS_REST_TOKEN  || ''
const KEY = 'yos:openclaw:cron:state'

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-cron-state-token') || req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || token !== CRON_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ error: 'Upstash not configured' }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const url = new URL(`/set/${encodeURIComponent(KEY)}`, UPSTASH_URL)
  const storeRes = await fetch(url.href, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!storeRes.ok) {
    const err = await storeRes.text().catch(() => 'unknown')
    return NextResponse.json({ error: `Upstash write failed: ${err}` }, { status: 500 })
  }

  const jobs = (body.jobs as Array<{name?: string; lastRunStatus?: string; consecutiveFailures?: number}>) || []
  const ok = jobs.filter(j => j.lastRunStatus === 'ok').length
  const err = jobs.filter(j => (j.consecutiveFailures || 0) > 0).length
  return NextResponse.json({ ok: true, jobs: jobs.length, ok: ok, errors: err })
}
