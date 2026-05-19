import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL   || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

// Real OpenClaw cron jobs — mirrored from ~/.openclaw/cron/jobs.json
// This is the authoritative list. Script pushes state to Upstash every 15min.
const REAL_JOBS = [
  { id: '211728a4-1475-4bff-963f-304f338c240a', name: 'Memory Compaction — 10pm',      schedule: '0 22 * * *',        owner: 'Chief of Staff' },
  { id: 'a536dc7c-a69f-4b50-9f05-c3eaf39eb5c2', name: 'Day Review — 9pm',              schedule: '0 21 * * *',        owner: 'Chief of Staff' },
  { id: '0c66dfc0-43b1-482a-840c-4c3b52e00069', name: 'Weekly L10 — Sunday 6pm',      schedule: '0 18 * * 0',        owner: 'Chief of Staff' },
  { id: 'a237f43e-262d-41b9-b041-bc8cbae29e80', name: 'Compliance Sweep',              schedule: '0 6 * * *',         owner: 'Chief of Staff' },
  { id: 'eed3a71c-797a-4912-835b-a0cddced5057', name: 'Finance',                       schedule: '5 7,17 * * 1-5',   owner: 'Finance' },
  { id: 'e824758a-0f06-4aa5-af05-1166ca478272', name: 'Inbox EA',                      schedule: '5 4,12 * * *',     owner: 'Inbox EA' },
  { id: '0d99c0d6-6255-437f-bf97-290d7f176e06', name: 'Innovation',                   schedule: '0 6 * * 1',        owner: 'Innovation' },
  { id: '88143d76-2242-4022-b4a2-2a5fb5a7b178', name: 'Cleaning BDM',                  schedule: '15 8 * * 1-5',     owner: 'Cleaning BDM' },
  { id: '15dc372a-5dcc-4e46-80fa-7dbc4ad3e508', name: 'LeaseIntel',                   schedule: '0 9 * * 1-5',      owner: 'LeaseIntel' },
  { id: '379bdd26-22ad-4198-9905-c4728376b9d1', name: 'Tenant Rep Lead Gen',           schedule: '30 8 * * 1',       owner: 'Tenant Rep BDM' },
  { id: '2f2ea5f8-bcf9-4e9a-b2dc-b6321170b772', name: 'Reputation Monitoring',          schedule: '0 16 * * 5',        owner: 'Innovation' },
  { id: 'a14a3838-b161-4f56-b93c-542715732ed1', name: 'Financial Health',              schedule: '30 7 * * 1',        owner: 'Financial Planner' },
  { id: '2e0166e0-e04d-47b1-91e4-634823133790', name: 'Risk Review',                  schedule: '0 8 * * 1',        owner: 'Risk' },
  { id: '96e5f5e3-cf22-4231-b9ed-5c91d6dc88dc', name: 'HubSpot RevOps',               schedule: '0 7,15 * * 1-5',   owner: 'HubSpot RevOps' },
]

async function redisGet(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const d = await res.json() as { result?: string | null }
    return d.result ?? null
  } catch { return null }
}

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  // Try Upstash for live state first (pushed by Mac Mini every 15min)
  const redisStateRaw = await redisGet('yos:openclaw:cron:state')
  let redisJobs: Array<{
    id: string; name: string; lastRunStatus?: string; lastRunEnded?: string
    lastRunStarted?: string; consecutiveFailures?: number; lastError?: string
    nextRunAt?: string; schedule?: string; owner?: string
  }> = []
  if (redisStateRaw) {
    try {
      const parsed = JSON.parse(redisStateRaw)
      redisJobs = parsed.jobs || []
    } catch { /* invalid JSON, ignore */ }
  }

  const results = REAL_JOBS.map(job => {
    const live = redisJobs.find(r => r.id === job.id)
    const hasLive = !!live
    const lastRunStatus = live?.lastRunStatus || null
    const lastRunEnded  = live?.lastRunEnded  || live?.nextRunAt || null
    const consecutiveErrors = live?.consecutiveFailures ?? 0
    const lastError = live?.lastError || ''
    const nextRunAt = live?.nextRunAt || null

    let status: 'ok' | 'stale' | 'failed' | 'unknown' = 'unknown'
    if (consecutiveErrors > 0) status = 'failed'
    else if (hasLive && lastRunStatus === 'ok') status = 'ok'
    else if (hasLive) status = 'stale'

    return {
      id: job.id,
      name: job.name,
      schedule: job.schedule,
      owner: job.owner,
      state: {
        last_run_status: lastRunStatus,
        last_run_ended: lastRunEnded,
        consecutive_failures: consecutiveErrors,
        last_error: lastError,
        next_run_at: nextRunAt,
      } as Record<string, unknown>,
      output: null,
      status,
      _hasLive: hasLive,
    }
  })

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    summary: {
      total: results.length,
      ok:     results.filter(r => r.status === 'ok').length,
      stale:  results.filter(r => r.status === 'stale').length,
      failed: results.filter(r => r.status === 'failed').length,
      noData: results.filter(r => !r._hasLive).length,
    },
    jobs: results.map(({ _hasLive, ...rest }) => rest),
  })
}
