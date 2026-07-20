import { NextResponse } from 'next/server'
const RURL = process.env.UPSTASH_REDIS_REST_URL!
const RTOK = process.env.UPSTASH_REDIS_REST_TOKEN!
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const r = await fetch(`${RURL}/get/yos:whs:latest`, {
      headers: { Authorization: `Bearer ${RTOK}` }, cache: 'no-store' })
    const raw = await r.json()
    if (!raw?.result) return NextResponse.json(null)
    let v = JSON.parse(raw.result)
    if (typeof v === 'string') v = JSON.parse(v)
    return NextResponse.json(v)
  } catch { return NextResponse.json(null) }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await fetch(`${RURL}/lpush/whs:actions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RTOK}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.stringify(body)),
    })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: false }) }
}
