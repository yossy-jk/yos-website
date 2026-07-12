import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
export const dynamic = 'force-dynamic'
export const revalidate = 0
const RURL = process.env.UPSTASH_REDIS_REST_URL || ''
const RTOK = process.env.UPSTASH_REDIS_REST_TOKEN || ''
export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  try {
    const r = await fetch(`${RURL}/get/yos:tenders:shortlist`, { headers: { Authorization: `Bearer ${RTOK}` } })
    if (!r.ok) throw new Error(`redis ${r.status}`)
    const d = await r.json() as { result?: string }
    return NextResponse.json(d.result ? JSON.parse(d.result) : { items: [], count: 0 })
  } catch (e) {
    return NextResponse.json({ items: [], count: 0, error: e instanceof Error ? e.message : 'failed' })
  }
}
