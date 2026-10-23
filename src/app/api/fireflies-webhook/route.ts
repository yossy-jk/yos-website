/**
 * POST /api/fireflies-webhook
 * Receives Fireflies transcript completion webhooks.
 * Configure the matching FIREFLIES_WEBHOOK_SECRET in Fireflies and production
 * before deployment. Existing V1 and signed V2 transcribed events are supported.
 */
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { readFirefliesBody, verifyFirefliesSignature, parseFirefliesEvent, FIREFLIES_ENQUEUE_SCRIPT } from '@/lib/fireflies-webhook'

export const runtime = 'nodejs'
const QUEUE = 'yos:tasks:pending-transcripts'
const RECEIPT_SECONDS = 90 * 24 * 60 * 60

async function getTranscript(transcriptId: string, apiKey: string) {
  const query = `
    query Transcript($transcriptId: String!) {
      transcript(id: $transcriptId) {
        id
        title
        date
        duration
        organizer_email
        participants
        summary {
          action_items
          overview
          keywords
        }
        sentences {
          speaker_name
          text
          start_time
        }
      }
    }
  `
  const res = await fetch('https://api.fireflies.ai/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables: { transcriptId } }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw Error('Transcript provider unavailable')
  const data = await res.json() as { data?: { transcript?: Record<string, unknown> }; errors?: unknown[] }
  if (data.errors?.length) throw Error('Transcript provider rejected request')
  return data.data?.transcript
}

export async function POST(req: NextRequest) {
  const respond = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
  if (process.env.VERCEL_ENV === 'preview') return respond({ ok: false }, 404)
  const secret = process.env.FIREFLIES_WEBHOOK_SECRET || ''
  const apiKey = process.env.FIREFLIES_API_KEY || ''
  const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!secret || !apiKey || !url || !token) return respond({ ok: false, error: 'Webhook unavailable' }, 503)
  let body: Uint8Array
  try { body = await readFirefliesBody(req) } catch { return respond({ ok: false, error: 'Invalid request body' }, 413) }
  if (!verifyFirefliesSignature(body, req.headers.get('x-hub-signature'), secret)) return respond({ ok: false }, 401)
  let event
  try {
    event = parseFirefliesEvent(JSON.parse(Buffer.from(body).toString('utf8')))
  } catch { return respond({ ok: false, error: 'Invalid webhook event' }, 400) }
  if (!event) return respond({ ok: true, skipped: true })
  const { meetingId, deduplicationKey } = event
  try {
    const redis = new Redis({ url, token })
    if (await redis.exists(deduplicationKey)) return respond({ ok: true, duplicate: true })
    const transcript = await getTranscript(meetingId, apiKey)
    if (!transcript) return respond({ ok: false, error: 'Transcript not found' }, 404)
    if (transcript.id !== meetingId) throw Error('Unexpected transcript identity')
    const job = JSON.stringify({
      meetingId,
      title: transcript.title,
      date: transcript.date,
      participants: transcript.participants,
      summary: transcript.summary,
      sentences: transcript.sentences,
      receivedAt: new Date().toISOString(),
    })

    const queued = await redis.eval<[string, number], number>(FIREFLIES_ENQUEUE_SCRIPT, [deduplicationKey, QUEUE], [job, RECEIPT_SECONDS])
    if (queued !== 0 && queued !== 1) throw Error('Unexpected queue acknowledgement')
    return respond({ ok: true, queued: queued === 1, duplicate: queued === 0 })
  } catch {
    // Do not log provider errors, request payloads, transcript contents or credentials.
    return respond({ ok: false, error: 'Processing failed; please retry' }, 502)
  }
}
