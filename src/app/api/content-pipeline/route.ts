import { NextResponse } from 'next/server'

const URL = process.env.UPSTASH_REDIS_REST_URL!
const TOK = process.env.UPSTASH_REDIS_REST_TOKEN!
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const r = await fetch(`${URL}/get/content:pipeline`, {
      headers: { Authorization: `Bearer ${TOK}` }, cache: 'no-store' })
    const raw = await r.json()
    if (!raw?.result) return NextResponse.json(null)
    return NextResponse.json(JSON.parse(raw.result))
  } catch { return NextResponse.json(null) }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await fetch(`${URL}/lpush/content:actions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOK}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.stringify(body)),
    })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: false }) }
}
