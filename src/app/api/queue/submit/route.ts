import { NextResponse } from 'next/server'

// Agents call this to submit items to Joe's approval queue
// POST /api/queue/submit
// Body: { type, title, content, agentId, metadata?, priority? }
// Requires x-queue-secret header matching QUEUE_SECRET env var

const QUEUE_KEY = 'yos:queue:pending'
const ARCHIVE_KEY = 'yos:queue:archive'

export async function POST(req: Request) {
  const secret = req.headers.get('x-queue-secret')
  const QUEUE_SECRET = process.env.QUEUE_SECRET || 'yos-queue-2026'
  if (secret !== QUEUE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { type, title, content, agentId, metadata, priority } = body

  if (!type || !title || !content) {
    return NextResponse.json({ error: 'Missing required fields: type, title, content' }, { status: 400 })
  }

  const VALID_TYPES = ['linkedin-post', 'proposal', 'cold-email', 'invoice-chaser', 'tender-decision', 'blog-post', 'email-draft', 'other']
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 })
  }

  const item = {
    id: crypto.randomUUID(),
    type,
    title,
    content,
    agentId: agentId || 'unknown',
    metadata: metadata || {},
    priority: priority || 'normal',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
  }

  // Push to list
  const res = await fetch(`${UPSTASH_URL}/rpush/${QUEUE_KEY}/${encodeURIComponent(JSON.stringify(item))}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  })
  if (!res.ok) return NextResponse.json({ error: 'Failed to store item' }, { status: 500 })

  return NextResponse.json({ ok: true, id: item.id })
}

export { QUEUE_KEY, ARCHIVE_KEY }
