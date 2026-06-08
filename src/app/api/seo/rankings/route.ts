/**
 * GET /api/seo/rankings
 * Fetches Google Search Console query performance via Maton GSC connection.
 * Returns current 28-day position + movement vs previous 28 days.
 * Falls back to Maton GSC API (live, confirmed working 2026-06-08).
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const MATON_KEY    = process.env.MATON_API_KEY || ''
const GSC_CONN     = '2561bc54-7747-471a-afd7-36ab4e39de47'
const SITE_URL_RAW = 'https://yourofficespace.au/'   // URL-encoded in path
const SITE_URL_RAW_ENCODE = encodeURIComponent(SITE_URL_RAW)

// All keywords we track — YOS services and commercial property Newcastle
const TRACKED_KEYWORDS = [
  'tenant representation Newcastle',
  'commercial tenant representative NSW',
  'commercial lease negotiation Newcastle',
  'what is make good in a commercial lease',
  'commercial lease review Newcastle',
  'how to negotiate a commercial lease Australia',
  'tenant rights commercial lease NSW',
  'commercial lease expiry 12 months what to do',
  'commercial cleaning Newcastle',
  'office cleaning Newcastle',
  'medical cleaning Newcastle',
  'commercial cleaning contract Hunter Valley',
  'what does a good commercial cleaning contract include',
  'office fitout Newcastle',
  'office furniture Newcastle',
  'how much does an office fitout cost Australia',
  'sit stand desk Newcastle',
  'commercial buyers agent Newcastle',
  'how to buy commercial property Australia',
  'buying vs leasing commercial property Newcastle',
  'commercial lease risk checker',
  'lease review service Australia',
  'your office space',
  'office design newcastle',
  'office fit out newcastle',
  'yos newcastle',
  'commercial office space newcastle',
  'office space newcastle',
  'newcastle commercial cleaning',
  'office fitout hunter valley',
  'commercial property newcastle',
  'office furniture',
  'commercial furniture',
  'commercial furniture newcastle',
  'office furniture newcastle',
  'office chair newcastle',
]

function dateStr(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

interface GSCRow {
  keys: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

async function fetchGSC(startDate: string, endDate: string): Promise<GSCRow[]> {
  const url = `https://gateway.maton.ai/google-search-console/webmasters/v3/sites/${SITE_URL_RAW_ENCODE}/searchAnalytics/query`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MATON_KEY}`,
      'Maton-Connection': GSC_CONN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 500,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GSC API ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json() as { rows?: GSCRow[] }
  return data.rows || []
}

export async function GET(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  if (!MATON_KEY) {
    return NextResponse.json({
      connected: false,
      error: 'MATON_API_KEY not set',
      rankings: [],
      topQueries: [],
    })
  }

  try {
    // Current: last 28 days. Previous: 29-56 days ago.
    // GSC data lags ~2-3 days, so shift window: current=16-44 days ago, previous=45-72 days ago
    const [currentRows, previousRows] = await Promise.all([
      fetchGSC(dateStr(44), dateStr(4)),
      fetchGSC(dateStr(72), dateStr(45)),
    ])

    // Build lookup maps: query → position
    const currentMap: Record<string, { position: number; clicks: number; impressions: number }> = {}
    for (const row of currentRows) {
      const q = row.keys[0].toLowerCase()
      currentMap[q] = { position: row.position, clicks: row.clicks, impressions: row.impressions }
    }

    const previousMap: Record<string, number> = {}
    for (const row of previousRows) {
      previousMap[row.keys[0].toLowerCase()] = row.position
    }

    // Build rankings for our tracked keywords
    const rankings = TRACKED_KEYWORDS.map(kw => {
      const key = kw.toLowerCase()
      const current = currentMap[key]
      const prevPosition = previousMap[key] ?? null

      const position = current ? Math.round(current.position * 10) / 10 : null
      const movement = (position !== null && prevPosition !== null)
        ? Math.round((prevPosition - position) * 10) / 10   // positive = moved up
        : null

      return {
        keyword:     kw,
        position,
        prevPosition,
        movement,
        clicks:      current?.clicks ?? 0,
        impressions: current?.impressions ?? 0,
      }
    })

    // Top performing queries (not just tracked ones)
    const topQueries = currentRows
      .filter(r => r.impressions >= 1)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 30)
      .map(r => ({
        keyword:    r.keys[0],
        position:   Math.round(r.position * 10) / 10,
        clicks:     r.clicks,
        impressions: r.impressions,
        movement:   (() => {
          const prev = previousMap[r.keys[0].toLowerCase()]
          return prev != null ? Math.round((prev - r.position) * 10) / 10 : null
        })(),
      }))

    return NextResponse.json({
      connected: true,
      updatedAt:  new Date().toISOString(),
      periodCurrent: `${dateStr(44)} → ${dateStr(4)}`,
      periodPrev:    `${dateStr(72)} → ${dateStr(45)}`,
      rankings,
      topQueries,
    })
  } catch (err) {
    return NextResponse.json({
      connected: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      rankings: [],
      topQueries: [],
    })
  }
}
