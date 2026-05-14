/**
 * GET /api/tenant-intel
 * 
 * Surfaces new commercial listings and market activity in Newcastle/Hunter Valley.
 * Data comes from YOS agents' last weekly research + Redis cache.
 * 
 * Returns:
 * - newListings: commercial spaces listed in last 7 days in Newcastle/Hunter
 * - upcomingExpiries: leases expiring within 90 days (from tenant-rep agent research)
 * - marketPulse: summary of activity level + notable movements
 * 
 * Freshness: cached in Redis, refreshed daily by tenant-rep-bdm-weekly job.
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL   || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

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

interface Listing {
  address: string
  suburb: string
  size: string
  type: string
  price: string
  listedDaysAgo: number
  source: string
  url: string
}

interface TenantIntel {
  generatedAt: string
  newListings: Listing[]
  upcomingExpiries: Array<{ address: string; suburb: string; expiryDate: string; daysUntil: number; note?: string }>
  marketPulse: string
  opportunityCount: number
  note: string
  error?: string
}

export async function GET(): Promise<NextResponse> {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const [intelRaw, listingsRaw] = await Promise.all([
    redisGet('yos:tenant-intel:weekly'),
    redisGet('yos:tenant-intel:new-listings'),
  ])

  const now = new Date()
  const intel = intelRaw ? JSON.parse(intelRaw) : null
  const listings = listingsRaw ? JSON.parse(listingsRaw) : null

  // Calculate freshness
  const lastUpdated = intel?.generatedAt
    ? Math.floor((now.getTime() - new Date(intel.generatedAt).getTime()) / 86400000)
    : null

  const response: TenantIntel = {
    generatedAt: now.toISOString(),
    newListings: listings?.listings || [],
    upcomingExpiries: intel?.expiries || [],
    marketPulse: intel?.marketPulse || 'Run tenant-rep-bdm-weekly to generate market intel.',
    opportunityCount: (listings?.listings?.length || 0) + (intel?.expiries?.length || 0),
    note: lastUpdated !== null
      ? `Last refreshed ${lastUpdated === 0 ? 'today' : lastUpdated + ' days ago'} by Tenant Rep BDM`
      : 'No intel generated yet. Tenant Rep BDM runs every Monday at 9:30am.',
  }

  if (!intel && !listings) {
    response.error = 'No tenant intel data yet. Run tenant-rep-bdm-weekly to generate.'
  }

  return NextResponse.json(response)
}
