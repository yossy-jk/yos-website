import { NextResponse } from 'next/server'
import { enquiryResponse } from '@/lib/enquiry-delivery'
import { normaliseSpacePlan } from '@/lib/free-space-plan'
export async function POST(req: Request) {
  let data
  try {
    const body = await req.text()
    if (body.length > 16000) return NextResponse.json({ ok: false, error: 'Request too large.' }, { status: 413 })
    const raw = JSON.parse(body)
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Check your request details.')
    data = normaliseSpacePlan(raw)
  } catch (error) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Check your request details.' }, { status: 400 }) }
  const headers = new Headers(req.headers); headers.delete('content-length'); headers.set('content-type', 'application/json')
  return enquiryResponse(new Request(req.url, { method: 'POST', headers, body: JSON.stringify(data) }), 'Free space plan')
}
