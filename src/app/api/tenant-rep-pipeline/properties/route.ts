/**
 * GET /api/tenant-rep-pipeline/properties — all properties
 * POST /api/tenant-rep-pipeline/properties — create property
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const KEY = 'tr:properties'

async function redisGet(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  })
  if (!r.ok) return null
  const d = await r.json() as { result?: string | null }
  return d.result ?? null
}

async function redisSet(key: string, value: string): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return
  await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    body: JSON.stringify({ key, value })
  })
}

interface Property { id: string; client_id: string; address: string; suburb: string; size_sqm: number|null; asking_rent: number|null; stage: string; notes: string; disqualified_reason: string|null; created_at: string; updated_at: string }

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const raw = await redisGet(KEY)
    const properties: Property[] = raw ? JSON.parse(raw) : []
    return NextResponse.json(properties)
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const body = await req.json()
    const raw = await redisGet(KEY)
    const properties: Property[] = raw ? JSON.parse(raw) : []
    const now = new Date().toISOString()
    const prop: Property = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      client_id: body.client_id || '',
      address: body.address || '',
      suburb: body.suburb || '',
      size_sqm: body.size_sqm || null,
      asking_rent: body.asking_rent || null,
      stage: 'Evaluation',
      notes: body.notes || '',
      disqualified_reason: null,
      created_at: now,
      updated_at: now,
    }
    properties.unshift(prop)
    await redisSet(KEY, JSON.stringify(properties))
    return NextResponse.json(prop, { status: 201 })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'failed' }, { status: 500 })
  }
}
