import { renderEnquiryEmail } from './enquiry-email'
import type { LeaseAttachment } from './lease-request'
import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactLimiter, getIp } from '@/lib/ratelimit'

export const ENQUIRY_ROUTING = { recipient: 'jk@yourofficespace.au', channel: 'email', yosOsEnabled: false } as const
export type Enquiry = {
  name: string; email: string; phone?: string; company?: string
  source: string; enquiryPage?: string; entryPage?: string; message?: string; details?: unknown; submissionId?: string
  marketingConsent?: boolean; submittedAt?: string; attachment?: LeaseAttachment
}
export function enquirySubmissionId(value: unknown): string {
  return typeof value === 'string' && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value) ? value : randomUUID()
}
const clean = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : ''
// Only public route shapes may enter the enquiry record. Queries, fragments and
// private token paths are never retained as page attribution.
export function enquiryPage(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const path = value.split(/[?#]/)[0]
  return /^\/(?:$|(?:contact|tenant-rep|buyers-agency|office-fitout|commercial-construction|furniture|cleaning|flourish|resources|blog|catalogues|tools|lease-health-check|lease-checklist)(?:\/[a-z0-9-]+)*$)/.test(path)
    && !/^\/tenant-rep\/(?:brief|payment)(?:\/|$)/.test(path) && path.length <= 200 ? path : undefined
}
export function normaliseEnquiry(raw: Record<string, unknown>): Enquiry {
  const email = clean(raw.email, 254).toLowerCase()
  const phone = clean(raw.phone, 80)
  if ((!email && !phone) || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw Error('Valid contact details required')
  return {
    name: clean(raw.name || raw.firstname || raw.firstName, 200), email, phone,
    company: clean(raw.company, 200), source: clean(raw.source, 200) || 'Website enquiry',
    enquiryPage: enquiryPage(raw.enquiryPage), entryPage: enquiryPage(raw.entryPage),
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
  const content = renderEnquiryEmail({ ...data, submissionId })
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: 'YOS Website <notifications@yourofficespace.au>',
    to: routing?.recipient || ENQUIRY_ROUTING.recipient,
    ...(routing?.cc ? { cc: routing.cc } : {}),
    ...(data.email ? { replyTo: data.email } : {}),
    ...(data.attachment ? { attachments: [{ filename: data.attachment.filename, content: data.attachment.content }] } : {}),
    subject: `YOS ${data.source.replace(/[\r\n]/g, ' ')} — ${(data.name || data.email || data.phone || 'Enquiry').replace(/[\r\n]/g, ' ')}`,
    ...content,
  }, { idempotencyKey: `${submissionId}-owner` })
  if (result.error || !result.data?.id) throw Error('Email delivery was not accepted')
  if (process.env.SERVICE_CHECKLISTS_ENABLED === 'true' && data.email && data.source !== 'Service checklist request') {
    try {
      const { suppressChecklistFollowUps } = await import('./checklist-store')
      await suppressChecklistFollowUps(data.email)
    } catch { console.warn('Checklist suppression storage needs attention; enquiry was delivered.') }
  }
  return { id: result.data.id, preview: false }
}

export async function enquiryResponse(req: Request, source?: string, attachment?: LeaseAttachment) {
  try {
    const text = await req.text()
    if (text.length > 100000) return NextResponse.json({ ok: false, error: 'Request too large' }, { status: 413 })
    let data: Enquiry
    try {
      const raw = JSON.parse(text)
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('Invalid request')
      if (raw._honey || raw.honeypot) return NextResponse.json({ ok: false }, { status: 400 })
      data = { ...normaliseEnquiry({ ...raw, ...(source ? { source } : {}) }), ...(attachment ? { attachment } : {}) }
    } catch {
      return NextResponse.json({ ok: false, error: 'Check your contact details.' }, { status: 400 })
    }
    if (process.env.VERCEL_ENV === 'preview') return NextResponse.json({ ok: true, success: true, preview: true })
    try {
      const limiter = contactLimiter()
      if (limiter && !(await limiter.limit(getIp(req))).success) return NextResponse.json({ ok: false }, { status: 429 })
    } catch { /* An unavailable rate-limit store must not discard an enquiry. */ }
    data.submissionId = enquirySubmissionId(data.submissionId)
    await sendOwnerEnquiry(data)
    return NextResponse.json({ ok: true, success: true, reference: data.submissionId })
  } catch {
    return NextResponse.json({ ok: false, error: 'We could not confirm email delivery. Please retry or call 02 4092 0733.' }, { status: 502 })
  }
}
