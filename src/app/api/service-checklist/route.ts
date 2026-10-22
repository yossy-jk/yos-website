import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { randomUUID } from 'node:crypto'
import { SERVICE_CHECKLISTS, CHECKLIST_FOLLOWUP_PERMISSION, type ChecklistService } from '@/lib/service-checklists'
import { checklistDeliveryEmail } from '@/lib/checklist-email'
import { checklistRedis, checklistKey, checklistLockKey, checklistCancelledKey, checklistEmailHash, cancelChecklistRequest, newChecklistRecord, saveChecklistRecord, queueChecklistFollowUp, registerChecklistUnsubscribe, type ChecklistRecord } from '@/lib/checklist-store'
import { sendOwnerEnquiry } from '@/lib/enquiry-delivery'
import { checklistLimiter, getIp } from '@/lib/ratelimit'
export const runtime = 'nodejs'
export const maxDuration = 60
export async function POST(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) return NextResponse.json({ ok: false }, { status: 403 })
  try {
    const raw = await req.text()
    if (raw.length > 4000) return NextResponse.json({ ok: false }, { status: 413 })
    let body
    try { body = JSON.parse(raw) } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const service = body?.service as ChecklistService
    if (!Object.hasOwn(SERVICE_CHECKLISTS, service) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(body.submissionId || '') || body._honey) return NextResponse.json({ ok: false }, { status: 400 })
    const replaces = body.replaces ?? []
    if (!Array.isArray(replaces) || replaces.length > 8 || replaces.some(item => !item || typeof item.email !== 'string' || item.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email) || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(item.submissionId || '') || item.submissionId === body.submissionId)) return NextResponse.json({ ok: false }, { status: 400 })
    if (process.env.VERCEL_ENV === 'preview') return NextResponse.json({ ok: true, preview: true })
    if (process.env.SERVICE_CHECKLISTS_ENABLED !== 'true' || process.env.VERCEL_ENV !== 'production') return NextResponse.json({ ok: false }, { status: 503 })
    const limiter = checklistLimiter('request')
    if (limiter && !(await limiter.limit(getIp(req))).success) return NextResponse.json({ ok: false }, { status: 429 })
    const redis = checklistRedis(), lock = checklistLockKey(body.submissionId), lockOwner = randomUUID()
    if (!(await redis.set(lock, lockOwner, { nx: true, ex: 120 }))) return NextResponse.json({ ok: false, retry: true }, { status: 409 })
    try {
      const cancelled = await redis.get<{ emailHash: string; service: ChecklistService }>(checklistCancelledKey(body.submissionId))
      if (cancelled?.emailHash === checklistEmailHash(email) && cancelled.service === service) return NextResponse.json({ ok: false, replaced: true }, { status: 409 })
      let previousDelivery: ChecklistRecord | null = null
      for (const previous of replaces) {
        const previousLock = checklistLockKey(previous.submissionId), previousOwner = randomUUID()
        if (!(await redis.set(previousLock, previousOwner, { nx: true, ex: 120 }))) return NextResponse.json({ ok: false, retry: true }, { status: 409 })
        try {
          const old = await cancelChecklistRequest(redis, previous.submissionId, previous.email.trim().toLowerCase(), service)
          if (old && old.email === email && old.deliveredAt !== null) previousDelivery = old
        } finally { await redis.eval("if redis.call('get',KEYS[1])==ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end", [previousLock], [previousOwner]) }
      }
      let record = await redis.get<ChecklistRecord>(checklistKey(body.submissionId))
      if (record && (record.email !== email || record.service !== service || record.consent !== (body.followUpConsent === true))) return NextResponse.json({ ok: false }, { status: 409 })
      record = record || newChecklistRecord(body.submissionId, email, service, body.followUpConsent === true)
      if (record.deliveredAt === null && previousDelivery) {
        record.deliveredAt = previousDelivery.deliveredAt
        record.dueAt = Math.max(record.deliveredAt! + 86400000, Date.now() + 86400000)
      }
      await saveChecklistRecord(redis, record)
      if (record.deliveredAt === null) {
        if (record.deliveryAttemptedAt && Date.now() - record.deliveryAttemptedAt > 23 * 3600000) throw Error('Delivery needs manual verification')
        if (!record.deliveryAttemptedAt) {
          const recipientLimiter = checklistLimiter('recipient')
          if (recipientLimiter && !(await recipientLimiter.limit(checklistEmailHash(email))).success) return NextResponse.json({ ok: false }, { status: 429 })
        }
        record.deliveryAttemptedAt = record.deliveryAttemptedAt || Date.now()
        await saveChecklistRecord(redis, record)
        await registerChecklistUnsubscribe(redis, record)
        const result = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: 'Your Office Space <notifications@yourofficespace.au>', to: email, replyTo: 'jk@yourofficespace.au', ...checklistDeliveryEmail(service, record.unsubscribeToken) }, { idempotencyKey: record.id + '-checklist' })
        if (result.error || !result.data?.id) throw Error('Checklist delivery unavailable')
        record.deliveredAt = Date.now(); record.dueAt = record.deliveredAt + 86400000
        await saveChecklistRecord(redis, record)
      }
      await queueChecklistFollowUp(redis, record)
      if (!record.ownerDelivered) {
        await sendOwnerEnquiry({ name: '', email, source: 'Service checklist request', submissionId: record.id, marketingConsent: record.consent, details: { service: SERVICE_CHECKLISTS[service].label, checklist: SERVICE_CHECKLISTS[service].title, followUpPermission: record.consent ? CHECKLIST_FOLLOWUP_PERMISSION : 'Not requested' } }, { recipient: 'jk@yourofficespace.au', cc: '' })
        record.ownerDelivered = true; await saveChecklistRecord(redis, record)
      }
      return NextResponse.json({ ok: true })
    } finally { await redis.eval("if redis.call('get',KEYS[1])==ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end", [lock], [lockOwner]) }
  } catch { return NextResponse.json({ ok: false, error: 'Please try again or call 02 4092 0733.' }, { status: 502 }) }
}
