import { NextResponse } from 'next/server'
import { timingSafeEqual, randomUUID } from 'node:crypto'
import { Resend } from 'resend'
import { checklistRedis, checklistDueKey, checklistKey, checklistCanSend, saveChecklistRecord, type ChecklistRecord } from '@/lib/checklist-store'
import { checklistFollowUpEmail } from '@/lib/checklist-email'
export const runtime = 'nodejs'
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET, supplied = req.headers.get('authorization') || ''
  const expected = `Bearer ${secret || ''}`
  const suppliedBytes = Buffer.from(supplied), expectedBytes = Buffer.from(expected)
  if (!secret || secret.length < 32 || suppliedBytes.length !== expectedBytes.length || !timingSafeEqual(suppliedBytes, expectedBytes)) return NextResponse.json({ ok: false }, { status: 401 })
  if (process.env.VERCEL_ENV !== 'production' || process.env.SERVICE_CHECKLISTS_ENABLED !== 'true') return NextResponse.json({ ok: true, disabled: true })
  try {
    const redis = checklistRedis(), now = Date.now()
    const ids = await redis.zrange<string[]>(checklistDueKey, 0, now, { byScore: true, offset: 0, count: 20 })
    let sent = 0, suppressed = 0
    for (const id of ids) {
      const lock = 'yos:checklist:v1:send-lock:' + id, owner = randomUUID()
      if (!(await redis.set(lock, owner, { nx: true, ex: 120 }))) continue
      try {
        const record = await redis.get<ChecklistRecord>(checklistKey(id))
        if (!record) { await redis.zrem(checklistDueKey, id); continue }
        if (!(await checklistCanSend(redis, record, now))) {
          if (record.dueAt > now) continue
          record.status = 'suppressed'; await saveChecklistRecord(redis, record); await redis.zrem(checklistDueKey, id); suppressed++; continue
        }
        if (record.followUpAttemptedAt && now - record.followUpAttemptedAt > 23 * 3600000) {
          record.status = 'suppressed'; await saveChecklistRecord(redis, record); await redis.zrem(checklistDueKey, id); suppressed++; continue
        }
        record.followUpAttemptedAt = record.followUpAttemptedAt || now
        await saveChecklistRecord(redis, record)
        const result = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: 'Your Office Space <notifications@yourofficespace.au>', to: record.email, replyTo: 'jk@yourofficespace.au', ...checklistFollowUpEmail(record.service, record.unsubscribeToken) }, { idempotencyKey: record.id + '-checklist-follow-up' })
        if (result.error || !result.data?.id) throw Error('Follow-up delivery unavailable')
        record.status = 'sent'; await saveChecklistRecord(redis, record); await redis.zrem(checklistDueKey, id); sent++
      } finally { await redis.eval("if redis.call('get',KEYS[1])==ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end", [lock], [owner]) }
    }
    return NextResponse.json({ ok: true, sent, suppressed })
  } catch { return NextResponse.json({ ok: false }, { status: 502 }) }
}
