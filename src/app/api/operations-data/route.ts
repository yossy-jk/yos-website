/**
 * GET /api/operations-data
 * Returns YOS automation system status for the Operations dashboard tab.
 *
 * Data source: Upstash Redis keys written by the Mac Mini automation wrapper:
 *   yos:automation:{job}:state   — last run state (status, timing, failures)
 *   yos:automation:{job}:output  — latest agent output text
 *   yos:automation:{job}:health  — latest health check JSON (compliance-sweep only)
 *
 * Falls back gracefully if Redis is unconfigured or keys are missing.
 */
import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const JOBS = ['compliance-sweep', 'memory-compaction', 'day-review', 'weekly-l10'] as const
type JobName = typeof JOBS[number]

interface JobState {
  last_run_date: string | null
  last_run_status: string | null
  last_run_started: string | null
  last_run_ended: string | null
  consecutive_failures: number
}

interface JobData {
  name: JobName
  schedule: string
  state: JobState | null
  output: string | null
  health: Record<string, unknown> | null
  error?: string
}

const JOB_SCHEDULES: Record<JobName, string> = {
  'compliance-sweep':  '06:00 daily',
  'memory-compaction': '21:00 daily',
  'day-review':        '21:30 daily',
  'weekly-l10':        '18:00 Sunday',
}

async function redisGet(url: string, token: string, key: string): Promise<string | null> {
  try {
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json() as { result?: string | null }
    return data.result ?? null
  } catch {
    return null
  }
}

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL   || ''
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({
      error: 'Redis not configured',
      jobs: [],
      generatedAt: new Date().toISOString(),
    })
  }

  const jobs: JobData[] = await Promise.all(
    JOBS.map(async (name): Promise<JobData> => {
      const [stateRaw, outputRaw, healthRaw] = await Promise.all([
        redisGet(REDIS_URL, REDIS_TOKEN, `yos:automation:${name}:state`),
        redisGet(REDIS_URL, REDIS_TOKEN, `yos:automation:${name}:output`),
        name === 'compliance-sweep'
          ? redisGet(REDIS_URL, REDIS_TOKEN, `yos:automation:${name}:health`)
          : Promise.resolve(null),
      ])

      let state: JobState | null = null
      let health: Record<string, unknown> | null = null

      try { state = stateRaw ? JSON.parse(stateRaw) : null } catch { /* ignore */ }
      try { health = healthRaw ? JSON.parse(healthRaw) : null } catch { /* ignore */ }

      return {
        name,
        schedule: JOB_SCHEDULES[name],
        state,
        output: outputRaw,
        health,
      }
    })
  )

  return NextResponse.json({
    jobs,
    generatedAt: new Date().toISOString(),
  })
}
