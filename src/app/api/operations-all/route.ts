import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL   || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

const JOBS = [
  { id: 'compliance-sweep',            name: 'Compliance Sweep',            schedule: '6:00am daily',        owner: 'Chief of Staff' },
  { id: 'inbox-ea',                    name: 'Inbox EA',                    schedule: '4am + 12pm daily',     owner: 'Inbox EA' },
  { id: 'innovation',                  name: 'Innovation',                  schedule: '6:30am Mon–Fri',      owner: 'Innovation' },
  { id: 'health-wellness-daily',       name: 'Health & Wellness',           schedule: '5:00am Mon–Fri',      owner: 'Health & Wellness' },
  { id: 'linkedin-drafts-morning',     name: 'LinkedIn — Morning Drafts',   schedule: '7:00am Mon–Fri',      owner: 'Brand Marketing' },
  { id: 'blog-writer-morning',         name: 'Blog Writer — Morning',        schedule: '6:00am Mon–Fri',      owner: 'Brand Marketing' },
  { id: 'furniture-website-ux',        name: 'Furniture Site UX Audit',     schedule: '8:00am Mon/Wed/Fri',  owner: 'Furniture Website' },
  { id: 'tenant-rep-portal-check',     name: 'Tenant Rep Portal Monitor',   schedule: '9:30am Mon–Fri',     owner: 'Tenant Rep' },
  { id: 'email-commitment-extractor',  name: 'Email Commitment Scan',       schedule: 'Every hour 9am–5pm',  owner: 'Inbox EA' },
  { id: 'hubspot-revops',              name: 'HubSpot RevOps',               schedule: 'Hourly',               owner: 'HubSpot RevOps' },
  { id: 'finance',                     name: 'Finance',                     schedule: 'Daily 7am',           owner: 'Finance' },
  { id: 'lease-intel',                name: 'LeaseIntel',                   schedule: 'Daily',               owner: 'LeaseIntel' },
  { id: 'outreach-drafter',            name: 'Outreach Drafter',             schedule: 'Mon/Wed/Fri',         owner: 'Tenant Rep' },
  { id: 'outreach-followup',           name: 'Outreach Follow-up',           schedule: 'Daily',               owner: 'Tenant Rep' },
  { id: 'memory-compaction',          name: 'Memory Compaction',            schedule: '9:00pm daily',        owner: 'Chief of Staff' },
  { id: 'day-review',                  name: 'Day Review',                   schedule: '9:30pm daily',        owner: 'Chief of Staff' },
  { id: 'push-outreach',               name: 'Push Outreach to Redis',      schedule: 'Daily',               owner: 'Tenant Rep' },
  { id: 'cleaning-manager-weekly',     name: 'Cleaning Manager',            schedule: '8am Monday',          owner: 'Cleaning Manager' },
  { id: 'tenant-rep-bdm-weekly',       name: 'Tenant Rep BDM',              schedule: '9:30am Monday',       owner: 'Tenant Rep BDM' },
  { id: 'blog-writer-afternoon',       name: 'Blog Writer — Afternoon',      schedule: '2pm Mon–Fri',         owner: 'Brand Marketing' },
  { id: 'linkedin-drafts-afternoon',   name: 'LinkedIn — Afternoon Drafts', schedule: '2pm Mon–Fri',         owner: 'Brand Marketing' },
  { id: 'weekly-l10',                  name: 'Weekly L10',                   schedule: '6pm Sunday',          owner: 'Chief of Staff' },
  { id: 'compliance-sync',             name: 'Compliance Sync',              schedule: 'Weekly',              owner: 'Chief of Staff' },
  { id: 'proposal-followup',           name: 'Proposal Follow-up Check',     schedule: 'Weekly',              owner: 'Tenant Rep' },
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

function parseState(raw: string | null) {
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const results = await Promise.all(
    JOBS.map(async (job) => {
      const [stateRaw, outputRaw] = await Promise.all([
        redisGet(`yos:automation:${job.id}:state`),
        redisGet(`yos:automation:${job.id}:output`),
      ])
      const state = parseState(stateRaw)
      let status: 'ok' | 'stale' | 'failed' | 'unknown' = 'unknown'
      if (state) {
        if (state.consecutive_failures >= 1) status = 'failed'
        else if (state.last_run_status === 'ok' || state.last_run_status === 'success') status = 'ok'
        else status = 'stale'
      }
      // Jobs never written to Redis (e.g. OpenClaw cron jobs) = unknown, not stale
      return { id: job.id, name: job.name, schedule: job.schedule, owner: job.owner, state, output: outputRaw, status }
    })
  )

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    summary: {
      total: results.length,
      ok:     results.filter(r => r.status === 'ok').length,
      stale:  results.filter(r => r.status === 'stale').length,
      failed: results.filter(r => r.status === 'failed').length,
    },
    jobs: results,
  })
}
