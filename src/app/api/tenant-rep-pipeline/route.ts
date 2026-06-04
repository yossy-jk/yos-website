/**
 * GET /api/tenant-rep-pipeline — list clients
 * POST /api/tenant-rep-pipeline — create client
 */
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const KEY = 'tr:clients'

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

interface Client { id: string; name: string; email: string; phone: string; brief_summary: string; created_at: string; updated_at: string }

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const raw = await redisGet(KEY)
    const clients: Client[] = raw ? JSON.parse(raw) : []
    return NextResponse.json(clients)
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
    const clients: Client[] = raw ? JSON.parse(raw) : []
    const now = new Date().toISOString()
    const client: Client = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      brief_summary: body.brief_summary || '',
      created_at: now,
      updated_at: now,
    }
    clients.unshift(client)
    await redisSet(KEY, JSON.stringify(clients))
    return NextResponse.json(client, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
