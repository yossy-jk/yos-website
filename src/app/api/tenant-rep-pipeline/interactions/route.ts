import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const KEY = 'tr:interactions'

async function redisGet(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  const r = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } })
  if (!r.ok) return null
  const d = await r.json() as { result?: string | null }
  return d.result ?? null
}

async function redisSet(key: string, value: string): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return
  await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST', headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    body: JSON.stringify({ key, value })
  })
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const raw = await redisGet(KEY)
    const interactions: any[] = raw ? JSON.parse(raw) : []
    return NextResponse.json(interactions)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const body = await req.json()
    const raw = await redisGet(KEY)
    const interactions: any[] = raw ? JSON.parse(raw) : []
    const now = new Date().toISOString()
    const interaction = { id: Date.now(), client_id: body.client_id || null, property_id: body.property_id || null, interaction_type: body.interaction_type || 'Other', note: body.note || '', created_at: now }
    interactions.unshift(interaction)
    if (interactions.length > 200) interactions.splice(200)
    await redisSet(KEY, JSON.stringify(interactions))
    return NextResponse.json(interaction, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
