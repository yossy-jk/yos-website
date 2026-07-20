import { NextResponse } from 'next/server'
const RURL = process.env.UPSTASH_REDIS_REST_URL!
const RTOK = process.env.UPSTASH_REDIS_REST_TOKEN!
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { q } = await req.json()
    const id = Math.random().toString(36).slice(2, 10)
    await fetch(`${RURL}/lpush/chat:q`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RTOK}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.stringify({ id, q })),
    })
    return NextResponse.json({ id })
  } catch { return NextResponse.json({ id: null }) }
}

export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get('id')
    const r = await fetch(`${RURL}/get/chat:a:${id}`, {
      headers: { Authorization: `Bearer ${RTOK}` }, cache: 'no-store' })
    const raw = await r.json()
    if (!raw?.result) return NextResponse.json(null)
    let v = JSON.parse(raw.result)
    if (typeof v === 'string') v = JSON.parse(v)
    return NextResponse.json(v)
  } catch { return NextResponse.json(null) }
}
