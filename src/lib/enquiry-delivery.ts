import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactLimiter, getIp } from '@/lib/ratelimit'

export const ENQUIRY_ROUTING = { recipient: 'jk@yourofficespace.au', channel: 'email', yosOsEnabled: false } as const
export type Enquiry = {
  name: string; email: string; phone?: string; company?: string
  source: string; message?: string; details?: unknown; submissionId?: string
  marketingConsent?: boolean; submittedAt?: string
}
export function enquirySubmissionId(value: unknown): string {
  return typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value) ? value : randomUUID()
}
const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : ''
export function normaliseEnquiry(raw: Record<string, unknown>): Enquiry {
  const email = clean(raw.email, 254).toLowerCase()
  const phone = clean(raw.phone, 80)
  if ((!email && !phone) || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw Error('Valid contact details required')
  return {
    name: clean(raw.name || raw.firstname || raw.firstName, 200), email, phone,
    company: clean(raw.company, 200), source: clean(raw.source, 200) || 'Website enquiry',
    message: clean(raw.message || raw.context, 24000), details: raw.details,
    submissionId: typeof raw.submissionId === 'string' && /^[a-f0-9-]{36}$/i.test(raw.submissionId) ? raw.submissionId : undefined,
    marketingConsent: raw.marketingConsent === true,
    submittedAt: typeof raw.submittedAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(raw.submittedAt) && Number.isFinite(Date.parse(raw.submittedAt)) ? new Date(raw.submittedAt).toISOString() : undefined,
  }
}

// One server-side delivery boundary for future YOS OS integration. Email stays
// authoritative until the live OS endpoint, auth and field mapping are verified.
export async function sendOwnerEnquiry(data: Enquiry, routing?: { recipient: string; cc: string }) {
  if (process.env.VERCEL_ENV === 'preview') return { id: 'preview', preview: true }
  if (!process.env.RESEND_API_KEY) throw Error('Email delivery unavailable')
  const submissionId = enquirySubmissionId(data.submissionId)
  const envelope = {
    schemaVersion: 1, submissionId, source: data.source,
    contact: { name: data.name, email: data.email, phone: data.phone, company: data.company },
    request: { message: data.message, details: data.details },
    marketingConsent: data.marketingConsent === true,
    clientSubmittedAt: data.submittedAt,
  }
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: 'YOS Website <notifications@yourofficespace.au>',
    to: routing?.recipient || ENQUIRY_ROUTING.recipient,
    ...(routing?.cc ? { cc: routing.cc } : {}),
    ...(data.email ? { replyTo: data.email } : {}),
    subject: `YOS ${data.source.replace(/[\r\n]/g, ' ')} — ${(data.name || data.email || data.phone || 'Enquiry').replace(/[\r\n]/g, ' ')}`,
    text: `New website request\n\n${JSON.stringify(envelope, null, 2)}\n\nReply directly to contact this prospect. YOS OS is not connected yet.`,
  }, { idempotencyKey: `${submissionId}-owner` })
  if (result.error || !result.data?.id) throw Error('Email delivery was not accepted')
  return { id: result.data.id, preview: false }
}

export async function enquiryResponse(req: Request, source?: string) {
  try {
    const text = await req.text()
    if (text.length > 100000) return NextResponse.json({ ok: false, error: 'Request too large' }, { status: 413 })
    let data: Enquiry
    try {
      const raw = JSON.parse(text)
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Invalid request')
      if (raw._honey || raw.honeypot) return NextResponse.json({ ok: false }, { status: 400 })
      data = normaliseEnquiry({ ...raw, ...(source ? { source } : {}) })
    } catch {
      return NextResponse.json({ ok: false, error: 'Check your contact details.' }, { status: 400 })
    }
    if (process.env.VERCEL_ENV === 'preview') return NextResponse.json({ ok: true, success: true, preview: true })
    try {
      const limiter = contactLimiter()
      if (limiter && !(await limiter.limit(getIp(req))).success) return NextResponse.json({ ok: false }, { status: 429 })
    } catch { /* An unavailable rate-limit store must not discard an enquiry. */ }
    await sendOwnerEnquiry(data)
    return NextResponse.json({ ok: true, success: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'We could not confirm email delivery. Please retry or call 02 4092 0733.' }, { status: 502 })
  }
}
