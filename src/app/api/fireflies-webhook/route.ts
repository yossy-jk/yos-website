/**
 * POST /api/fireflies-webhook
 * Receives Fireflies transcript completion webhooks.
 * Setup: add https://www.yourofficespace.au/api/fireflies-webhook
 * in Fireflies Settings → Developer Settings → Webhooks
 */
import { NextRequest, NextResponse } from 'next/server'

const FIREFLIES_API_KEY = process.env.FIREFLIES_API_KEY || ''
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

async function getTranscript(transcriptId: string) {
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
      'Authorization': `Bearer ${FIREFLIES_API_KEY}`,
    },
    body: JSON.stringify({ query, variables: { transcriptId } }),
  })
  const data = await res.json() as { data?: { transcript?: Record<string, unknown> } }
  return data.data?.transcript
}

export async function POST(req: NextRequest) {
  const body = await req.text()

  let payload: { meetingId?: string; eventType?: string }
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { meetingId, eventType } = payload

  if (eventType !== 'Transcription completed') {
    return NextResponse.json({ ok: true, skipped: true })
  }

  if (!meetingId || !FIREFLIES_API_KEY) {
    return NextResponse.json({ error: 'Missing meetingId or API key' }, { status: 400 })
  }

  try {
    const transcript = await getTranscript(meetingId)
    if (!transcript) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 })
    }

    const job = JSON.stringify({
      meetingId,
      title: transcript.title,
      date: transcript.date,
      participants: transcript.participants,
      summary: transcript.summary,
      sentences: transcript.sentences,
      receivedAt: new Date().toISOString(),
    })

    // Push to Redis queue for commitment extractor to process
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      await fetch(
        `${UPSTASH_URL}/lpush/${encodeURIComponent('yos:tasks:pending-transcripts')}/${encodeURIComponent(job)}`,
        { method: 'POST', headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } }
      )
    }

    return NextResponse.json({ ok: true, meetingId, queued: true })
  } catch (err) {
    console.error('Fireflies webhook error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
