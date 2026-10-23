import { NextResponse } from 'next/server'
import { enquirySubmissionId, normaliseEnquiry, sendOwnerEnquiry } from '@/lib/enquiry-delivery'
import { contactLimiter, getIp } from '@/lib/ratelimit'
import { parseTeamInterest } from '@/lib/team-interest'

export async function POST(req: Request) {
  const headers = { 'Cache-Control': 'private, no-store' }
  const origin = req.headers.get('origin')
  if (origin && origin !== new URL(req.url).origin) return NextResponse.json({ ok: false }, { status: 403, headers })
  try {
    const text = await req.text()
    if (text.length > 16000) return NextResponse.json({ ok: false }, { status: 413, headers })
    let details, raw
    try {
      raw = JSON.parse(text)
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Invalid request')
      details = parseTeamInterest(raw)
    } catch { return NextResponse.json({ ok: false, error: 'Check your required details.' }, { status: 400, headers }) }
    if (process.env.VERCEL_ENV === 'preview') return NextResponse.json({ ok: true, preview: true }, { headers })
    try {
      const limiter = contactLimiter()
      if (limiter && !(await limiter.limit(getIp(req))).success) return NextResponse.json({ ok: false, error: 'Please wait a few minutes before trying again.' }, { status: 429, headers })
    } catch { /* Inbox delivery remains available if the rate-limit store is unavailable. */ }
    const submissionId = enquirySubmissionId(raw.submissionId)
    const data = normaliseEnquiry({ ...details, submissionId, source: `Work or Partner with YOS: ${details.role}`, enquiryPage: '/about/work-with-yos', submittedAt: raw.submittedAt, details: { ...details, contactPermission: true, purpose: 'Contact about working or partnering with YOS; no marketing opt-in' } })
    await sendOwnerEnquiry(data, details.role === 'Contract cleaner' ? { recipient: 'sarah.kelley@yourofficespace.au', cc: 'jk@yourofficespace.au' } : undefined)
    return NextResponse.json({ ok: true, reference: submissionId }, { headers })
  } catch { return NextResponse.json({ ok: false, error: 'We could not confirm delivery. Please retry or email jk@yourofficespace.au.' }, { status: 502, headers }) }
}
