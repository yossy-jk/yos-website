/**
 * POST /api/blog/generate
 * Generates a single blog post draft and pushes to the approval queue.
 * Auth: x-queue-secret header (cron) OR auth-v2 session cookie (manual trigger)
 *
 * Flow: Generate → yos:queue:pending (status: pending)
 *       Joe approves → yos:queue:archive (status: approved)
 *       6am AEST cron → publish-scheduled picks up approved posts
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'
import { requireAuth } from '@/lib/auth'

const QUEUE_SECRET = process.env.QUEUE_SECRET || 'yos-queue-2026'
const QUEUE_KEY    = 'yos:queue:pending'
const MINIMAX_KEY  = process.env.MINIMAX_API_KEY || ''
const MINIMAX_BASE = 'https://api.minimaxi.chat/v1'

// ── 25-topic rotating library (5 per division) ───────────────────────────────
const TOPICS = [
  // tenant-rep (5)
  { division: 'tenant-rep',    topic: 'Why Most Tenants Overpay on Their First Lease — And How to Avoid It',        targetKeyword: 'tenant representation newcastle' },
  { division: 'tenant-rep',    topic: 'Make Good Clauses: What Most Commercial Leases Get Wrong',                   targetKeyword: 'make good clause commercial lease' },
  { division: 'tenant-rep',    topic: 'The 12-Month Lease Warning: What to Do Before Your Expiry',                  targetKeyword: 'commercial lease expiry 12 months' },
  { division: 'tenant-rep',    topic: 'Rent Reviews: Fight or Accept? A Tenant\'s Decision Framework',              targetKeyword: 'commercial rent review negotiation' },
  { division: 'tenant-rep',    topic: 'How Tenant Representation Actually Works in Newcastle (Plain English)',    targetKeyword: 'commercial tenant representative NSW' },
  // buyers-agency (5)
  { division: 'buyers-agency', topic: 'Buying Commercial Property in Newcastle in 2026: What the Market Signals Say', targetKeyword: 'buy commercial property newcastle' },
  { division: 'buyers-agency', topic: 'Lease vs Buy: A Framework for Newcastle Businesses Deciding on Property',    targetKeyword: 'lease vs buy commercial property' },
  { division: 'buyers-agency', topic: 'What a Buyer\'s Agent Actually Does (And Why You Need One)',                  targetKeyword: 'commercial buyers agent newcastle' },
  { division: 'buyers-agency', topic: 'Off-Market Deals: How Tenant Buyers Access Properties Nobody Else Can See',  targetKeyword: 'off market commercial property newcastle' },
  { division: 'buyers-agency', topic: 'Due Diligence Checklist for First-Time Commercial Property Buyers',         targetKeyword: 'commercial property due diligence' },
  // furniture (5)
  { division: 'furniture',    topic: 'How Much Does a Full Office Fitout Cost in 2026? Real Newcastle Examples',    targetKeyword: 'office fitout cost newcastle' },
  { division: 'furniture',    topic: 'The Hidden Costs of Cheap Office Furniture (And What to Budget Instead)',    targetKeyword: 'commercial office furniture newcastle' },
  { division: 'furniture',    topic: 'Ergonomic Desk Setup Guide for Newcastle Small Businesses',                  targetKeyword: 'sit stand desk newcastle' },
  { division: 'furniture',    topic: 'Refurbished vs New: Which Office Furniture Makes Sense for Your Business',   targetKeyword: 'refurbished office furniture' },
  { division: 'furniture',    topic: 'What to Expect From a Commercial Furniture Supplier in the Hunter Region',   targetKeyword: 'office furniture hunter valley' },
  // cleaning (5)
  { division: 'cleaning',     topic: 'What Does a Medical Centre Cleaning Contract Actually Cover?',              targetKeyword: 'medical cleaning newcastle' },
  { division: 'cleaning',     topic: 'Commercial Cleaning Pricing: What Newcastle Businesses Actually Pay',       targetKeyword: 'commercial cleaning cost newcastle' },
  { division: 'cleaning',     topic: 'Green Cleaning Products in Commercial Spaces: Worth the Investment?',      targetKeyword: 'green commercial cleaning' },
  { division: 'cleaning',     topic: 'How to Find a Reliable Commercial Cleaner in the Hunter Valley',            targetKeyword: 'commercial cleaning hunter valley' },
  { division: 'cleaning',     topic: 'What\'s Included in a Comprehensive Office Cleaning Service?',             targetKeyword: 'office cleaning newcastle' },
  // general (5)
  { division: 'general',     topic: 'Newcastle Commercial Property Market Update: Q2 2026',                       targetKeyword: 'newcastle commercial property market' },
  { division: 'general',     topic: 'How to Choose the Right Office Location in Newcastle for Your Industry',    targetKeyword: 'commercial office space newcastle' },
  { division: 'general',     topic: 'The True Cost of a Bad Office Move (And How to Avoid It)',                  targetKeyword: 'office relocation newcastle' },
  { division: 'general',     topic: 'Office Design Trends Newcastle Businesses Are Actually Adopting in 2026',   targetKeyword: 'office design newcastle' },
  { division: 'general',     topic: 'Why Newcastle\'s Commercial Property Market Is Different From Sydney',       targetKeyword: 'newcastle commercial property' },
]

function getTodayTopic() {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000)
  return TOPICS[dayOfYear % TOPICS.length]
}

function slugify(title: string): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

function tomorrowDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

// ── MiniMax generation ─────────────────────────────────────────────────────────
async function generatePost(topic: typeof TOPICS[number]) {
  if (!MINIMAX_KEY) throw new Error('MINIMAX_API_KEY not set')

  const prompt = `You are a content writer for Your Office Space, a Newcastle-based commercial property and office services company. Write one high-quality, original blog post for their website.

TOPIC: ${topic.topic}
DIVISION: ${topic.division}
TARGET KEYWORD: ${topic.targetKeyword}

Requirements:
- Write in plain English, like a knowledgeable expert explaining something to a smart business owner
- Approximately 900–1200 words
- Include the target keyword naturally in the title, first paragraph, and at least 2 subheadings
- Short paragraphs (2-4 sentences max). No fluff. No emojis. No corporate speak.
- Use 3-4 ## subheadings in markdown
- Include a short 2-sentence excerpt for the blog listing page
- Output ONLY valid JSON with keys: title, excerpt, content (full markdown body), tags (array of 3-5 strings)
- Do not wrap the JSON in code fences or any additional text

Output JSON only:`

  const res = await fetch(`${MINIMAX_BASE}/text/chatcompletion_v2`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MINIMAX_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'abab6.5s',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`MiniMax ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json() as {
    choices?: Array<{ message?: { content?: string } }>
    error?: { message?: string }
  }

  if (data.error) throw new Error(data.error.message || 'MiniMax error')

  const raw = data.choices?.[0]?.message?.content?.trim() || ''
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
  return JSON.parse(cleaned) as { title: string; content: string; excerpt: string; tags: string[] }
}

// ── POST /api/blog/generate ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const queueSecret = req.headers.get('x-queue-secret')
  const isCron = queueSecret === QUEUE_SECRET

  if (!isCron) {
    const user = await getCurrentUser()
    if (!user) {
      const old = await requireAuth()
      if (!old.ok) return old.response
    }
  }

  const body = await req.json().catch(() => ({})) as {
    division?: string; topic?: string; targetKeyword?: string
  }

  const topic = body.topic && body.division
    ? { division: body.division as typeof TOPICS[number]['division'], topic: body.topic, targetKeyword: body.targetKeyword || '' }
    : getTodayTopic()

  let generated
  try {
    generated = await generatePost(topic)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Generation failed'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }

  const item = {
    id: `blog-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'blog-post',
    title: generated.title,
    content: generated.content,
    status: 'pending',
    metadata: {
      division: topic.division,
      targetKeyword: topic.targetKeyword,
      excerpt: generated.excerpt,
      slug: slugify(generated.title),
      author: 'Joe Kelley',
      tags: generated.tags,
      scheduledFor: tomorrowDate(),
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    await fetch(`${url}/rpush/${QUEUE_KEY}/${encodeURIComponent(JSON.stringify(item))}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
  }

  return NextResponse.json({
    ok: true,
    id: item.id,
    title: item.title,
    division: topic.division,
    targetKeyword: topic.targetKeyword,
    scheduledFor: item.metadata.scheduledFor,
    excerpt: generated.excerpt,
    tags: generated.tags,
    queuedAt: item.createdAt,
  })
}

// GET /api/blog/generate — preview next topic, no generation
export async function GET() {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000)
  const next = TOPICS[dayOfYear % TOPICS.length]
  return NextResponse.json({
    nextTopic: next,
    dayOfYear,
    totalTopics: TOPICS.length,
    rotation: `${(dayOfYear % TOPICS.length) + 1} of ${TOPICS.length}`,
  })
}