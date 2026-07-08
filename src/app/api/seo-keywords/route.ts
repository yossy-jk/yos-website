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
    const r = await fetch(`${RURL}/get/yos:seo:keywords`, { headers: { Authorization: `Bearer ${RTOK}` } })
    if (!r.ok) throw new Error(`redis ${r.status}`)
    const d = await r.json() as { result?: string }
    const keywords = d.result ? JSON.parse(d.result) : []
    return NextResponse.json({
      keywords,
      total: keywords.length,
      byCluster: keywords.reduce((acc: Record<string, number>, k: { cluster: string }) => { acc[k.cluster] = (acc[k.cluster] || 0) + 1; return acc }, {}),
      p1Count: keywords.filter((k: { priority: string }) => k.priority === 'P1').length,
      generatedAt: new Date().toISOString(),
    })
  } catch (e) {
    return NextResponse.json({ keywords: [], error: e instanceof Error ? e.message : 'failed' })
  }
}
