/**
 * POST /api/blog/generate
 * Generates a single SEO/AEO-optimised blog post draft and pushes to approval queue.
 * Auth: x-queue-secret header (cron) OR auth-v2 session cookie (manual trigger)
 *
 * Flow: Generate → yos:queue:pending (status: pending)
 *       Joe approves → yos:queue:archive (status: approved)
 *       6am AEST cron → publish-scheduled picks up approved posts
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'
import { requireAuth } from '@/lib/auth'

const QUEUE_SECRET  = process.env.QUEUE_SECRET || 'yos-queue-2026'
const QUEUE_KEY     = 'yos:queue:pending'
// Increase max function duration for this API route (Vercel Pro allows up to 300s)
export const maxDuration = 120

const MINIMAX_KEY   = process.env.MINIMAX_API_KEY || ''
const MINIMAX_BASE  = 'https://api.minimaxi.chat/v1'
const MINIMAX_MODEL = 'MiniMax-M2.7-highspeed'

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
  { division: 'buyers-agency', topic: 'Due Diligence Checklist for First-Time Commercial Property Buyers',           targetKeyword: 'commercial property due diligence' },
  // furniture (5)
  { division: 'furniture',    topic: 'How Much Does a Full Office Fitout Cost in 2026? Real Newcastle Examples',   targetKeyword: 'office fitout cost newcastle' },
  { division: 'furniture',    topic: 'The Hidden Costs of Cheap Office Furniture (And What to Budget Instead)',     targetKeyword: 'commercial office furniture newcastle' },
  { division: 'furniture',    topic: 'Ergonomic Desk Setup Guide for Newcastle Small Businesses',                   targetKeyword: 'sit stand desk newcastle' },
  { division: 'furniture',    topic: 'Refurbished vs New: Which Office Furniture Makes Sense for Your Business',   targetKeyword: 'refurbished office furniture' },
  { division: 'furniture',    topic: 'What to Expect From a Commercial Furniture Supplier in the Hunter Region',   targetKeyword: 'office furniture hunter valley' },
  // cleaning (5)
  { division: 'cleaning',     topic: 'What Does a Medical Centre Cleaning Contract Actually Cover?',              targetKeyword: 'medical cleaning newcastle' },
  { division: 'cleaning',     topic: 'Commercial Cleaning Pricing: What Newcastle Businesses Actually Pay',       targetKeyword: 'commercial cleaning cost newcastle' },
  { division: 'cleaning',     topic: 'Green Cleaning Products in Commercial Spaces: Worth the Investment?',      targetKeyword: 'green commercial cleaning' },
  { division: 'cleaning',     topic: 'How to Find a Reliable Commercial Cleaner in the Hunter Valley',            targetKeyword: 'commercial cleaning hunter valley' },
  { division: 'cleaning',     topic: 'What\'s Included in a Comprehensive Office Cleaning Service?',             targetKeyword: 'office cleaning newcastle' },
  // general (5)
  { division: 'general',     topic: 'Newcastle Commercial Property Market Update: Q2 2026',                      targetKeyword: 'newcastle commercial property market' },
  { division: 'general',     topic: 'How to Choose the Right Office Location in Newcastle for Your Industry',   targetKeyword: 'commercial office space newcastle' },
  { division: 'general',     topic: 'The True Cost of a Bad Office Move (And How to Avoid It)',                  targetKeyword: 'office relocation newcastle' },
  { division: 'general',     topic: 'Office Design Trends Newcastle Businesses Are Actually Adopting in 2026',  targetKeyword: 'office design newcastle' },
  { division: 'general',     topic: 'Why Newcastle\'s Commercial Property Market Is Different From Sydney',      targetKeyword: 'newcastle commercial property' },
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

// ── SEO/AEO-optimised generation prompt ──────────────────────────────────────
// Targets: Google's Helpful Content system, AI Overviews, People Also Ask,
// featured snippets, and FAQ schema. See Google Search Essentials.
async function generatePost(topic: typeof TOPICS[number]) {
  if (!MINIMAX_KEY) throw new Error('MINIMAX_API_KEY not set')

  const prompt = `You are a senior content strategist and SEO writer for Your Office Space — a Newcastle-based commercial property and office services company operating across the Hunter Region, NSW. Write one blog post that is optimised for both traditional search ranking and AI-powered answer engines (Google AI Overviews, People Also Ask, featured snippets).

=== STRUCTURE (follow exactly) ===

## 1. TITLE
- Must start with or be a close variant of the target keyword
- Under 60 characters
- Compelling click-through intent — not just informational

## 2. INTRO (first 50 words)
- Open with one direct, authoritative sentence that answers the searcher's question immediately
- This is the paragraph most likely to appear as a featured snippet or AI answer — make it self-contained
- No preamble phrases like "In this article..." — get straight to the point
- Include the target keyword in the first sentence

## 3. BODY — H2 HEADINGS
Use 4-6 ## headings. Most should be question-based (matching how people actually search):
- "How much does..." / "What is the average..." / "Why does..."
- "When should I..." / "What\'s included in..." / "How do I..."

Each H2 must:
- Contain the target keyword or a semantic variant
- Be followed by 2-3 paragraphs answering the sub-question completely
- Include specific concrete detail: dollar amounts, timeframes, percentages, named Newcastle/Hunter suburbs, legal references, real process steps

## 4. SEMANTIC KEYWORDS
In addition to the target keyword, weave in 3-5 related terms naturally throughout:
- For "commercial cleaning Newcastle": "professional cleaning services", "commercial cleaner", "office hygiene", "facility management", "regular cleaning"
- For "office fitout cost Newcastle": "commercial fitout", "office fitout builder", "Hunter region fitout", "office refurbishment", "commercial fitout cost"
Choose terms that search engines use to understand topic depth — not exact-match repetition.

## 5. E-E-A-T SIGNALS (weave naturally — no fabrication)
- Experience: reference operating in the Hunter region, Newcastle commercial property market
- Expertise: cite NSW commercial tenancy law, industry processes, real pricing frameworks
- Authority: reference YOS's position in the Newcastle market, years operating, client types
- Trust: mention Class 2 real estate licence, commercial tenancy experience, local knowledge

## 6. FAQ SECTION (required — powers People Also Ask ranking)
End the article with "## Frequently Asked Questions" and 4-5 questions with 2-3 sentence answers each. Questions must be genuine ones a business owner would ask — not generic. Answers must be directly from the article content, not generic.

## 7. LENGTH: 1200-1500 words

## 8. OUTPUT FORMAT
Output ONLY valid JSON, no code fences, no explanation:
{
  "title": "string — exact post title",
  "metaDescription": "string — 140-155 chars, compelling click-through with keyword, no sales hype",
  "excerpt": "string — 2 sentences for blog listing page, no sales language",
  "content": "string — full markdown body with intro, ## headings, body, FAQ section. No preamble text.",
  "tags": ["string"] — 5-6 strings: target keyword + semantic variants + related terms"
}

## 9. STYLE
- Plain English. Like a knowledgeable expert explaining to a smart business owner
- Short paragraphs: 2-3 sentences max
- No emojis. No corporate speak. No filler: never use "in today's fast-paced world", "leveraging", "synergy", "holistic", "seamlessly", "robust", "transformative"
- Numbers over words for big figures: "$45,000" not "forty-five thousand dollars"
- Australian spelling: optimise, recognise, practise, analyse
- Active voice throughout
- 1-2 relevant local Newcastle/Hunter specifics per article

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
      max_tokens: 6000,
      extra: {
        enable_search: false,
        input_planned: false,
        use_threshold: false,
      },
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

  const raw = (data.choices?.[0]?.message?.content || '').trim()
  const content = raw || (data.choices?.[0]?.message?.reasoning_content || '').trim()

  const jsonStart = content.indexOf('{')
  if (jsonStart < 0) throw new Error(`MiniMax returned no JSON at all (content: ${content.slice(0, 80)})`)

  let depth = 0
  let jsonEnd = -1
  for (let i = jsonStart; i < content.length; i++) {
    if (content[i] === '{') depth++
    else if (content[i] === '}') { depth--; if (depth === 0) { jsonEnd = i; break } }
  }
  if (jsonEnd < 0) throw new Error(`MiniMax JSON was not balanced (content length: ${content.length})`)

  let cleaned = content.slice(jsonStart, jsonEnd + 1)
  try { JSON.parse(cleaned) } catch {
    // Try to fix trailing " corruption
    cleaned = cleaned.replace(/\}"$/, '}')
    cleaned = cleaned.replace(/\}\\n"$/, '}')
    cleaned = cleaned.replace(/,\s*}$/, '}')  // trailing comma before closing brace
  }
  return JSON.parse(cleaned) as {
    title: string; content: string; excerpt: string; tags: string[]
    metaDescription?: string
  }
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
      metaDescription: generated.metaDescription || '',
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
    metaDescription: generated.metaDescription || '',
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