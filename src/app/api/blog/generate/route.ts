/**
 * POST /api/blog/generate
 * Generates a single SEO/AEO-optimised blog post draft and pushes to approval queue.
 * Auth: x-queue-secret header (cron) OR auth-v2 session cookie (manual trigger)
 *
 * Writes to: yos:queue:pending:v2 (JSON array)
 * Joe approves → yos:queue:archive (status: approved)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const QUEUE_SECRET  = process.env.QUEUE_SECRET || 'yos-queue-2026'
const QUEUE_KEY_V2 = 'yos:queue:pending:v2'
export const maxDuration = 180

const MINIMAX_KEY   = process.env.MINIMAX_API_KEY || ''
const MINIMAX_BASE  = 'https://api.minimaxi.chat/v1'
const MINIMAX_MODEL = 'MiniMax-M2.1'

// ── Upstash helpers ───────────────────────────────────────────────────────

async function redisGet(url: string, token: string, key: string): Promise<unknown> {
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  const d = await res.json() as { result?: unknown }
  return d.result ?? null
}

function normaliseValue(raw: unknown): unknown {
  if (!raw) return null
  if (typeof raw === 'object' && raw !== null && 'result' in (raw as object)) {
    return normaliseValue((raw as { result: unknown }).result)
  }
  if (typeof raw === 'object' && raw !== null && 'value' in (raw as object)) {
    const val = String((raw as { value: unknown }).value)
    try {
      const decoded = Buffer.from(val, 'base64').toString('utf-8')
      const parsed = JSON.parse(decoded)
      if (typeof parsed === 'string') return JSON.parse(parsed)
      return parsed
    } catch {
      try { return JSON.parse(val) } catch { return val }
    }
  }
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return raw }
  }
  return raw
}

async function redisSet(url: string, token: string, key: string, value: string): Promise<void> {
  await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  })
}

// ── 25-topic rotating library ──────────────────────────────────────────────

const TOPICS = [
  { division: 'tenant-rep',    topic: 'Why Most Tenants Overpay on Their First Lease — And How to Avoid It',         targetKeyword: 'tenant representation newcastle' },
  { division: 'tenant-rep',    topic: 'Make Good Clauses: What Most Commercial Leases Get Wrong',                      targetKeyword: 'make good clause commercial lease' },
  { division: 'tenant-rep',    topic: 'The 12-Month Lease Warning: What to Do Before Your Expiry',                   targetKeyword: 'commercial lease expiry 12 months' },
  { division: 'tenant-rep',    topic: 'Rent Reviews: Fight or Accept? A Tenant\'s Decision Framework',               targetKeyword: 'commercial rent review negotiation' },
  { division: 'tenant-rep',    topic: 'How Tenant Representation Actually Works in Newcastle (Plain English)',         targetKeyword: 'commercial tenant representative NSW' },
  { division: 'buyers-agency', topic: 'Buying Commercial Property in Newcastle in 2026: What the Market Signals Say', targetKeyword: 'buy commercial property newcastle' },
  { division: 'buyers-agency', topic: 'Lease vs Buy: A Framework for Newcastle Businesses Deciding on Property',     targetKeyword: 'lease vs buy commercial property' },
  { division: 'buyers-agency', topic: 'What a Buyer\'s Agent Actually Does (And Why You Need One)',                  targetKeyword: 'commercial buyers agent newcastle' },
  { division: 'buyers-agency', topic: 'Off-Market Deals: How Tenant Buyers Access Properties Nobody Else Can See',  targetKeyword: 'off market commercial property newcastle' },
  { division: 'buyers-agency', topic: 'Due Diligence Checklist for First-Time Commercial Property Buyers',          targetKeyword: 'commercial property due diligence' },
  { division: 'furniture',    topic: 'How Much Does a Full Office Fitout Cost in 2026? Real Newcastle Examples',   targetKeyword: 'office fitout cost newcastle' },
  { division: 'furniture',    topic: 'The Hidden Costs of Cheap Office Furniture (And What to Budget Instead)',     targetKeyword: 'commercial office furniture newcastle' },
  { division: 'furniture',    topic: 'Ergonomic Desk Setup Guide for Newcastle Small Businesses',                   targetKeyword: 'sit stand desk newcastle' },
  { division: 'furniture',    topic: 'Refurbished vs New: Which Office Furniture Makes Sense for Your Business',   targetKeyword: 'refurbished office furniture' },
  { division: 'furniture',    topic: 'What to Expect From a Commercial Furniture Supplier in the Hunter Region',   targetKeyword: 'office furniture hunter valley' },
  { division: 'cleaning',    topic: 'What Does a Medical Centre Cleaning Contract Actually Cover?',              targetKeyword: 'medical cleaning newcastle' },
  { division: 'cleaning',    topic: 'Commercial Cleaning Pricing: What Newcastle Businesses Actually Pay',       targetKeyword: 'commercial cleaning cost newcastle' },
  { division: 'cleaning',    topic: 'Green Cleaning Products in Commercial Spaces: Worth the Investment?',      targetKeyword: 'green commercial cleaning' },
  { division: 'cleaning',    topic: 'How to Find a Reliable Commercial Cleaner in the Hunter Valley',           targetKeyword: 'commercial cleaning hunter valley' },
  { division: 'cleaning',    topic: 'What\'s Included in a Comprehensive Office Cleaning Service?',            targetKeyword: 'office cleaning newcastle' },
  { division: 'general',    topic: 'Newcastle Commercial Property Market Update: Q2 2026',                   targetKeyword: 'newcastle commercial property market' },
  { division: 'general',    topic: 'How to Choose the Right Office Location in Newcastle for Your Industry',  targetKeyword: 'commercial office space newcastle' },
  { division: 'general',    topic: 'The True Cost of a Bad Office Move (And How to Avoid It)',                 targetKeyword: 'office relocation newcastle' },
  { division: 'general',    topic: 'Office Design Trends Newcastle Businesses Are Actually Adopting in 2026',  targetKeyword: 'office design newcastle' },
  { division: 'general',    topic: 'Why Newcastle\'s Commercial Property Market Is Different From Sydney',     targetKeyword: 'newcastle commercial property' },
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

// ── JSON extractor ─────────────────────────────────────────────────────────

function safeJsonParse(raw: string) {
  const start = raw.indexOf('{')
  if (start < 0) return null
  let depth = 0, end = -1
  for (let i = start; i < raw.length; i++) {
    if (raw[i] === '{') depth++
    else if (raw[i] === '}') { depth--; if (depth === 0) { end = i; break } }
  }
  if (end < 0) return null
  for (const candidate of [
    raw.slice(start, end + 1),
    raw.slice(start, end + 1).replace(/,\s*}$/, '}'),
  ]) {
    try { return JSON.parse(candidate) } catch { /* next */ }
  }
  return null
}

// ── Generation ─────────────────────────────────────────────────────────────

async function generatePost(topic: typeof TOPICS[number]) {
  if (!MINIMAX_KEY) throw new Error('MINIMAX_API_KEY not set')

  const prompt = `You are a senior content strategist and SEO writer for Your Office Space — a Newcastle-based commercial property and office services company operating across the Hunter Region, NSW. Write one blog post optimised for search ranking and AI answer engines (Google AI Overviews, People Also Ask, featured snippets).

=== STRUCTURE ===
## 1. TITLE
- Must start with or be a close variant of the target keyword
- Under 60 characters
## 2. INTRO (first 50 words)
- One direct, authoritative sentence answering the searcher's question immediately
- Target keyword in first sentence. No preamble.
## 3. BODY — H2 HEADINGS
4-6 ## headings. Most should be question-based. Each H2 contains the target keyword or semantic variant. 2-3 paragraphs per section. Include concrete detail: dollar amounts, timeframes, Newcastle/Hunter suburbs, NSW legal references.
## 4. SEMANTIC KEYWORDS
Weave 3-5 related terms naturally throughout the body.
## 5. E-E-A-T SIGNALS
Reference: Hunter region, Newcastle market, Class 2 real estate licence, commercial tenancy experience, local knowledge. No fabrication.
## 6. FAQ SECTION (required)
End with "## Frequently Asked Questions" + 4-5 questions with 2-3 sentence answers each.
## 7. INTERNAL LINKS (required — minimum 3)
Include exactly 3 or more HTML anchor links to yourofficespace.au pages, embedded naturally in body text.
## 8. CALL TO ACTION (required)
Short closing paragraph linking to relevant yourofficespace.au pages. Integrated into final paragraph, not a separate box.
## 9. LENGTH: 1200-1500 words
## 10. OUTPUT FORMAT
Output ONLY valid JSON. No code fences. No explanation.
{"title":"...","metaDescription":"...","excerpt":"...","content":"...","tags":["..."]}
## 11. STYLE
- Plain English. No emojis. No filler.
- Short paragraphs 2-3 sentences.
- Numbers for figures: "$45,000" not "forty-five thousand dollars".
- Australian spelling: optimise, recognise, practise.
- 1-2 Newcastle/Hunter specifics per article.

TOPIC: ${topic.topic}
DIVISION: ${topic.division}
TARGET KEYWORD: ${topic.targetKeyword}
Output your JSON now:`

  const res = await fetch(`${MINIMAX_BASE}/text/chatcompletion_v2`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${MINIMAX_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MINIMAX_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 16000,
    }),
    signal: AbortSignal.timeout(120000),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`MiniMax ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json() as {
    choices?: Array<{ message?: { content?: string; reasoning_content?: string } }>
    base_resp?: { status_code?: number; status_msg?: string }
  }

  if (data.base_resp && data.base_resp.status_code !== 0) {
    throw new Error(`MiniMax API error ${data.base_resp.status_code}: ${data.base_resp.status_msg}`)
  }

  const rawContent = (data.choices?.[0]?.message?.content || '').trim()
  const reasoning  = (data.choices?.[0]?.message?.reasoning_content || '').trim()
  const content = rawContent.startsWith('{') ? rawContent : reasoning

  const parsed = safeJsonParse(content)
  if (!parsed) {
    throw new Error(`Could not parse JSON from MiniMax response (len=${content.length})`)
  }

  return {
    title: parsed.title || 'Untitled',
    metaDescription: parsed.metaDescription || '',
    excerpt: parsed.excerpt || '',
    content: parsed.content || '',
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
  }
}

// ── POST ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const queueSecret = req.headers.get('x-queue-secret')
  const isCron = queueSecret === QUEUE_SECRET

  if (!isCron) {
    const auth = await requireAuth()
    if (!auth.ok) return auth.response
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

  const item: Record<string, unknown> = {
    id: `blog-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: 'blog-post',
    title: generated.title,
    content: generated.content,
    status: 'pending',
    metadata: {
      division: topic.division,
      targetKeyword: topic.targetKeyword,
      excerpt: generated.excerpt,
      metaDescription: generated.metaDescription,
      slug: slugify(generated.title),
      author: 'Joe Kelley',
      tags: generated.tags,
      scheduledFor: tomorrowDate(),
      generatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    const rawQueue = normaliseValue(await redisGet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2))
    const queue: Record<string, unknown>[] = Array.isArray(rawQueue) ? rawQueue as Record<string, unknown>[] : []
    queue.push(item)
    await redisSet(UPSTASH_URL, UPSTASH_TOKEN, QUEUE_KEY_V2, JSON.stringify(queue))
  }

  return NextResponse.json({
    ok: true,
    id: item.id,
    title: item.title,
    division: topic.division,
    targetKeyword: topic.targetKeyword,
    scheduledFor: (item.metadata as Record<string, unknown>).scheduledFor,
    excerpt: generated.excerpt,
    metaDescription: generated.metaDescription || '',
    tags: generated.tags,
    queuedAt: item.createdAt,
  })
}

// GET — preview next topic
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
