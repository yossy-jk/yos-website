import { NextResponse } from 'next/server'
const RURL = process.env.UPSTASH_REDIS_REST_URL!
const RTOK = process.env.UPSTASH_REDIS_REST_TOKEN!
export const dynamic = 'force-dynamic'
export const revalidate = 0
export async function GET() {
  try {
    const r = await fetch(`${RURL}/get/yos:seo:dashboard`, {
      headers: { Authorization: `Bearer ${RTOK}` }, cache: 'no-store' })
    const raw = await r.json()
    if (!raw?.result) return NextResponse.json(null)
    return NextResponse.json(JSON.parse(raw.result))
  } catch { return NextResponse.json(null) }
}
