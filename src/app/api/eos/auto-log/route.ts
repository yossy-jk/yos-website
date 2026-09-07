/**
 * POST /api/eos/auto-log
 * 
 * Agents call this to auto-log KPI values to the EOS scorecard.
 * Authenticates via X-EOS-AGENT-TOKEN header (not cookie — agents can't use cookies).
 * 
 * Body: {
 *   metricId: string        // e.g. "kpi-blog"
 *   value: number | null    // actual value, or null to clear
 *   weekEnding?: string     // ISO date of the Friday week to update (default: current or last Friday)
 *   note?: string           // optional note stored alongside
 * }
 * 
 * Also supports bulk:
 * Body: { metrics: [{ metricId, value, weekEnding? }, ...] }
 */
import { NextResponse } from 'next/server'

const AGENT_TOKEN = process.env.EOS_AGENT_TOKEN
const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL   || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const EOS_KEY       = 'yos:eos:data'

function lastFriday(): string {
  const d = new Date()
  const dow = d.getDay() // 0=Sun
  const toFri = dow <= 5 ? 5 - dow : 12 - dow
  d.setDate(d.getDate() + toFri)
  return d.toISOString().split('T')[0]
}

async function getEOS() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(EOS_KEY)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const d = await res.json() as { result?: string | null }
  return d.result ? JSON.parse(d.result) : null
}

async function saveEOS(data: unknown) {
  await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(EOS_KEY)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(data)),
  })
}

export async function POST(req: Request) {
  // Agent token auth
  const agentToken = req.headers.get('x-eos-agent-token')
  if (agentToken !== AGENT_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const weekEnding = body.weekEnding || lastFriday()

    // Bulk or single?
    const items = body.metrics
      ? body.metrics.map((m: {metricId: string; value: number | null; weekEnding?: string}) => ({
          metricId: m.metricId,
          value:    m.value,
          weekEnding: m.weekEnding || weekEnding,
        }))
      : [{ metricId: body.metricId, value: body.value, weekEnding }]

    const eos = await getEOS()
    if (!eos) return NextResponse.json({ error: 'EOS not found in Redis' }, { status: 404 })

    const updated: string[] = []
    const notFound: string[] = []

    for (const item of items) {
      const metric = eos.scorecard?.find((m: {id: string}) => m.id === item.metricId)
      if (!metric) { notFound.push(item.metricId); continue }

      // Update the week entry
      if (!metric.weeks) metric.weeks = []
      const weekEntry = metric.weeks.find((w: {weekEnding: string}) => w.weekEnding === item.weekEnding)
      if (weekEntry) {
        weekEntry.actual = item.value
      } else {
        metric.weeks.push({ weekEnding: item.weekEnding, actual: item.value })
        metric.weeks.sort((a: {weekEnding: string}, b: {weekEnding: string}) => a.weekEnding.localeCompare(b.weekEnding))
      }
      updated.push(item.metricId)
    }

    eos.updatedAt = new Date().toISOString()
    await saveEOS(eos)

    return NextResponse.json({
      ok: true,
      weekEnding,
      updated,
      notFound,
      totalUpdated: updated.length,
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
