import { NextResponse } from 'next/server'
import { enquirySubmissionId, normaliseEnquiry, sendOwnerEnquiry } from '@/lib/enquiry-delivery'
import { contactLimiter, getIp } from '@/lib/ratelimit'

export async function POST(req: Request) {
  try {
    const text = await req.text()
    if (text.length > 100000) return NextResponse.json({ ok: false }, { status: 413 })
    let data, body
    try {
      body = JSON.parse(text)
      if (body._honey || !['employee', 'contractor', 'sales-partner'].includes(body.type) || !body.name?.trim() || !body.phone?.trim() || !body.email?.trim()) throw Error('Required fields')
      data = normaliseEnquiry({ ...body, submissionId: enquirySubmissionId(body.submissionId), source: `${body.type === 'sales-partner' ? 'Sales partner' : `Cleaning ${body.type}`} application`, details: body })
    } catch { return NextResponse.json({ ok: false, error: 'Check your required details.' }, { status: 400 }) }
    if (process.env.VERCEL_ENV === 'preview') return NextResponse.json({ ok: true, preview: true })
    try {
      const limiter = contactLimiter()
      if (limiter && !(await limiter.limit(getIp(req))).success) return NextResponse.json({ ok: false }, { status: 429 })
    } catch { /* Keep email available on a rate-limit store outage. */ }
    const joe = 'jk@yourofficespace.au', sarah = 'sarah.kelley@yourofficespace.au'
    await sendOwnerEnquiry(data, body.type === 'sales-partner' ? { recipient: joe, cc: sarah } : { recipient: sarah, cc: joe })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'We could not confirm delivery. Please try again.' }, { status: 502 })
  }
}
