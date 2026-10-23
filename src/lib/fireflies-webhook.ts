import { createHmac, timingSafeEqual, createHash } from 'node:crypto'

export const FIREFLIES_BODY_LIMIT = 16 * 1024

/** Verify the exact bytes before parsing; both documented webhook versions use this header. */
export function verifyFirefliesSignature(body: Uint8Array, signature: string | null, secret: string): boolean {
  if (!secret || !signature || !/^sha256=[a-fA-F0-9]{64}$/.test(signature)) return false
  const expected = createHmac('sha256', secret).update(body).digest()
  const received = Buffer.from(signature.slice(7), 'hex')
  return received.length === expected.length && timingSafeEqual(received, expected)
}

export async function readFirefliesBody(request: Request): Promise<Uint8Array> {
  const length = request.headers.get('content-length')
  if (length && (!/^\d+$/.test(length) || Number(length) > FIREFLIES_BODY_LIMIT)) throw Error('Body too large')
  const reader = request.body?.getReader()
  if (!reader) return new Uint8Array()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > FIREFLIES_BODY_LIMIT) { await reader.cancel(); throw Error('Body too large') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  return Buffer.concat(chunks)
}

export type FirefliesEvent = { meetingId: string; deduplicationKey: string }

/** Retain V1 compatibility while allowing a deliberate V2 migration. */
export function parseFirefliesEvent(value: unknown, now = Date.now()): FirefliesEvent | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('Invalid payload')
  const p = value as Record<string, unknown>
  const v2 = Object.hasOwn(p, 'event')
  if (v2 ? p.event !== 'meeting.transcribed' : p.eventType !== 'Transcription completed') return null
  const id = v2 ? p.meeting_id : p.meetingId
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,200}$/.test(id)) throw Error('Invalid meeting ID')
  if (v2 && (typeof p.timestamp !== 'number' || !Number.isSafeInteger(p.timestamp) || Math.abs(now - p.timestamp) > 600000)) throw Error('Invalid delivery timestamp')
  if (v2 && p.reprocessed_at !== undefined && (typeof p.reprocessed_at !== 'number' || !Number.isSafeInteger(p.reprocessed_at) || p.reprocessed_at <= 0 || p.reprocessed_at > now + 600000)) throw Error('Invalid revision')
  // Retry delivery timestamps change; the meeting revision remains stable.
  const revision = v2 ? p.reprocessed_at ?? 'initial' : 'initial'
  return { meetingId: id, deduplicationKey: 'yos:fireflies:received:' + createHash('sha256').update(id + ':' + revision).digest('hex') }
}

/** The queue write and receipt must succeed together, including concurrent retries. */
export const FIREFLIES_ENQUEUE_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) == 1 then return 0 end
redis.call('SET', KEYS[1], '1', 'EX', ARGV[2])
local queued = redis.pcall('LPUSH', KEYS[2], ARGV[1])
if type(queued) == 'table' and queued.err then
  redis.call('DEL', KEYS[1])
  return redis.error_reply(queued.err)
end
return 1
`
