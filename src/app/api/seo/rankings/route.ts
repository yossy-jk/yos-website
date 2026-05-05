/**
 * GET /api/seo/rankings?token=***
 * Fetches Google Search Console query performance for tracked keywords.
 * Returns current 7-day position + movement vs previous 7 days.
 */
import { NextResponse } from 'next/server'

const CLIENT_ID       = process.env.GSC_CLIENT_ID || ''
const CLIENT_SECRET   = process.env.GSC_CLIENT_SECRET || ''
const REFRESH_TOKEN   = process.env.GSC_REFRESH_TOKEN || ''
const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'yos-joe-2026'
const SITE_URL        = 'https://www.yourofficespace.au/'

// All keywords we track (must match the SEO tab's list)
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
]

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  })
  const data = await res.json() as { access_token?: string; error?: string }
  if (!data.access_token) throw new Error(data.error || 'Token refresh failed')
  return data.access_token
}

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

async function fetchGSC(token: string, startDate: string, endDate: string): Promise<GSCRow[]> {
  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 1000,
        dataState: 'all',
      }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GSC API ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json() as { rows?: GSCRow[] }
  return data.rows || []
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!REFRESH_TOKEN) {
    return NextResponse.json({
      connected: false,
      error: 'GSC_REFRESH_TOKEN not set',
      authUrl: `/api/auth/gsc?token=${DASHBOARD_TOKEN}`,
      rankings: [],
    })
  }

  try {
    const accessToken = await getAccessToken()

    // Fetch current 7 days and previous 7 days in parallel
    // GSC data lags ~2-3 days, so use 3–9 days ago as "current", 10–16 as "previous"
    const [currentRows, previousRows] = await Promise.all([
      fetchGSC(accessToken, dateStr(9), dateStr(3)),
      fetchGSC(accessToken, dateStr(16), dateStr(10)),
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

      const position   = current ? Math.round(current.position * 10) / 10 : null
      const movement   = (position !== null && prevPosition !== null)
        ? Math.round((prevPosition - position) * 10) / 10   // positive = improved (moved up)
        : null

      return {
        keyword:     kw,
        position,                          // current avg position (null = not ranking in top 100)
        prevPosition,                      // previous period avg position
        movement,                          // + = moved up, - = moved down
        clicks:      current?.clicks ?? 0,
        impressions: current?.impressions ?? 0,
      }
    })

    // Also pull top performing queries (not just our tracked ones)
    const topQueries = currentRows
      .filter(r => r.impressions >= 5)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 20)
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
      periodCurrent: `${dateStr(9)} → ${dateStr(3)}`,
      periodPrev:    `${dateStr(16)} → ${dateStr(10)}`,
      rankings,
      topQueries,
    })
  } catch (err) {
    return NextResponse.json({
      connected: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      authUrl: `/api/auth/gsc?token=${DASHBOARD_TOKEN}`,
      rankings: [],
      topQueries: [],
    })
  }
}
