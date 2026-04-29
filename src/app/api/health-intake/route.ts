import { NextResponse } from 'next/server'

// Health Auto Export → YOS Health Intake
// POST /api/health-intake
// Header: x-health-secret: yos-health-2026
// Body: Health Auto Export JSON payload

const HEALTH_KEY = 'yos:health:latest'
const HEALTH_HISTORY_KEY = 'yos:health:history'

export async function POST(req: Request) {
  const secret = req.headers.get('x-health-secret')
  const HEALTH_SECRET = process.env.HEALTH_SECRET || 'yos-health-2026'

  if (secret !== HEALTH_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 })
  }

  let body: Record<string, unknown>
  let rawText = ''
  try {
    rawText = await req.text()
    body = rawText ? JSON.parse(rawText) : {}
  } catch {
    // Store raw even if unparseable
    body = { _raw: rawText }
  }

  // Health Auto Export v2 format:
  // { data: [ { name, units, data: [{qty, date}] } ] }
  // or wrapped differently — handle all variants
  const metrics = Array.isArray(body.data) ? body.data
    : Array.isArray(body.metrics) ? body.metrics
    : Array.isArray(body) ? body
    : []

  const parsed: Record<string, unknown> = {
    receivedAt: new Date().toISOString(),
    raw: body,
  }

  // Extract key metrics we care about
  if (Array.isArray(metrics)) {
    for (const metric of (metrics as Record<string, unknown>[])) {
      const rawName = String(metric.name || metric.metric || metric.metricName || '')
      if (!rawName) continue
      const name = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
      const dataPoints = (metric.data as Record<string, unknown>[]) || []
      if (dataPoints.length > 0) {
        const latest = dataPoints[dataPoints.length - 1]
        parsed[name] = {
          value: latest.qty ?? latest.value ?? latest.Qty ?? latest.quantity,
          unit: metric.units || metric.unit || '',
          date: latest.date || latest.startDate || latest.Date || latest.timestamp,
          samples: dataPoints.length,
        }
      }
    }
  }

  // Store latest snapshot
  const storeLatest = await fetch(
    `${UPSTASH_URL}/set/${HEALTH_KEY}/${encodeURIComponent(JSON.stringify(parsed))}`,
    { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } }
  )
  if (!storeLatest.ok) {
    return NextResponse.json({ error: 'Failed to store health data' }, { status: 500 })
  }

  // Append to history (keep last 30 snapshots)
  await fetch(
    `${UPSTASH_URL}/rpush/${HEALTH_HISTORY_KEY}/${encodeURIComponent(JSON.stringify(parsed))}`,
    { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } }
  )
  await fetch(
    `${UPSTASH_URL}/ltrim/${HEALTH_HISTORY_KEY}/0/29`,
    { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } }
  )

  return NextResponse.json({ ok: true, received: Object.keys(parsed).length - 2 + ' metrics' })
}

// GET — fetch latest health data (dashboard use)
export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'yos-joe-2026'

  if (token !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ data: null })
  }

  const res = await fetch(`${UPSTASH_URL}/get/${HEALTH_KEY}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  })
  const d = await res.json()
  if (!d.result) return NextResponse.json({ data: null })

  try {
    return NextResponse.json({ data: JSON.parse(d.result) })
  } catch {
    return NextResponse.json({ data: null })
  }
}
