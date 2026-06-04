import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const KEY = 'tr:properties'

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await params
  try {
    const { note } = await req.json()
    const raw = await redisGet(KEY)
    const properties: any[] = raw ? JSON.parse(raw) : []
    const idx = properties.findIndex(p => p.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const now = new Date().toISOString()
    const prev = properties[idx].notes ? properties[idx].notes + '\n' : ''
    properties[idx].notes = prev + '[' + now.slice(0,16) + '] ' + (note || '')
    properties[idx].updated_at = now
    await redisSet(KEY, JSON.stringify(properties))
    return NextResponse.json(properties[idx])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
