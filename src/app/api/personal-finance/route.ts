import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL!
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!

export const dynamic   = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  try {
    const res = await fetch(`${REDIS_URL}/get/pf:cashflow:latest`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      cache: 'no-store',
    })
    const raw = await res.json()
    if (!raw?.result) return NextResponse.json(null)
    const data = JSON.parse(raw.result)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json(null)
  }
}
