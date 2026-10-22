import { Redis } from '@upstash/redis'
import { createHash, randomBytes } from 'node:crypto'
import type { ChecklistService } from './service-checklists'
import { checklistFollowUpEligible, type ChecklistFollowUpRecord } from './checklist-email'
const PREFIX = 'yos:checklist:v1:'
const RETENTION = 90 * 24 * 60 * 60
export type ChecklistRecord = ChecklistFollowUpRecord & { id: string; email: string; service: ChecklistService; createdAt: number; unsubscribeToken: string; ownerDelivered: boolean; deliveryAttemptedAt?: number; followUpAttemptedAt?: number }
export function checklistRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw Error('Checklist storage unavailable')
  return new Redis({ url, token })
}
export const checklistEmailHash = (email: string) => createHash('sha256').update(email.trim().toLowerCase()).digest('hex')
export const checklistKey = (id: string) => PREFIX + 'request:' + id
export const checklistDueKey = PREFIX + 'due'
export const checklistLockKey = (id: string) => PREFIX + 'lock:' + id
export const checklistCancelledKey = (id: string) => PREFIX + 'cancelled:' + id
export const checklistFollowUpClaimKey = (email: string) => PREFIX + 'follow-up-claim:' + checklistEmailHash(email)
export const checklistSuppressionKey = (email: string) => PREFIX + 'suppressed:' + checklistEmailHash(email)
export const checklistUnsubscribeKey = (token: string) => PREFIX + 'unsubscribe:' + createHash('sha256').update(token).digest('hex')
export function newChecklistRecord(id: string, email: string, service: ChecklistService, consent: boolean, now = Date.now()): ChecklistRecord {
  return { id, email: email.trim().toLowerCase(), service, consent, createdAt: now, deliveredAt: null, dueAt: now + 86400000, status: 'pending', unsubscribed: false, enquiryReceived: false, paymentReceived: false, ownerDelivered: false, unsubscribeToken: randomBytes(32).toString('base64url') }
}
export async function saveChecklistRecord(redis: Redis, record: ChecklistRecord) { await redis.set(checklistKey(record.id), record, { ex: RETENTION }) }
export async function registerChecklistUnsubscribe(redis: Redis, record: ChecklistRecord) {
  await redis.set(checklistUnsubscribeKey(record.unsubscribeToken), record.email, { ex: RETENTION })
}
/** Caller holds the same request lock used by capture and follow-up delivery. */
export async function cancelChecklistRequest(redis: Redis, id: string, email: string, service: ChecklistService) {
  const record = await redis.get<ChecklistRecord>(checklistKey(id))
  if (record && (record.email !== email || record.service !== service)) return null
  // Also blocks a delayed original request that has not reached storage yet.
  await redis.set(checklistCancelledKey(id), { emailHash: checklistEmailHash(email), service }, { ex: RETENTION })
  if (record) {
    record.consent = false; record.unsubscribed = true
    if (record.status !== 'sent') record.status = 'suppressed'
    await saveChecklistRecord(redis, record)
    await redis.zrem(checklistDueKey, id)
  }
  return record
}
export async function queueChecklistFollowUp(redis: Redis, record: ChecklistRecord) {
  if (!record.consent || record.deliveredAt === null || record.status !== 'pending') return
  await registerChecklistUnsubscribe(redis, record)
  await redis.zadd(checklistDueKey, { score: record.dueAt, member: record.id })
}
export async function suppressChecklistFollowUps(email: string) {
  if (process.env.VERCEL_ENV !== 'production' || !email) return
  await checklistRedis().set(checklistSuppressionKey(email), true, { ex: RETENTION })
}
export async function checklistCanSend(redis: Redis, record: ChecklistRecord, now: number) { return checklistFollowUpEligible(record, now) && !(await redis.exists(checklistSuppressionKey(record.email))) }
