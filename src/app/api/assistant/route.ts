import { createHmac } from 'node:crypto'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { getIp } from '@/lib/ratelimit'
import { deploymentScopedKey } from '@/lib/deployment-scope'
import { assistantLimitAllows, containsContactOrSecret, generateAssistantAnswer, parseAssistantRequest, publicAssistantFallback } from '@/lib/public-assistant-answer'

export const runtime = 'nodejs'
export const maxDuration = 25
const headers = { 'Cache-Control': 'private, no-store' }
export async function POST(req: Request) {
  if (req.headers.get('origin') !== new URL(req.url).origin) return Response.json({ error: 'Please ask from this website.' }, { status: 403, headers })
  const body = await req.text()
  if (body.length > 6000) return Response.json({ error: 'Please shorten your question.' }, { status: 413, headers })
  let data
  try { data = parseAssistantRequest(JSON.parse(body)) } catch { return Response.json({ error: 'Please enter a question under 1,200 characters.' }, { status: 400, headers }) }
  const { question, previousQuestions } = data
  if ([question, ...previousQuestions].some(containsContactOrSecret)) return Response.json({ answer: 'Please keep contact details and private information out of the question box. To have the team respond, use the follow-up form below. We cannot access individual orders, accounts or projects in this chat.', sources: [], mode: 'website' }, { headers })
  const fallback = () => Response.json(publicAssistantFallback(question), { headers })
  const apiKey = process.env.MINIMAX_API_KEY, url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN
  // Missing or unhealthy shared limits cannot enable unbounded paid generation.
  if (!apiKey || !url || !token) return fallback()
  try {
    const redis = new Redis({ url, token })
    const identity = createHmac('sha256', token).update(getIp(req)).digest('hex')
    const visitor = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '1 h'), prefix: deploymentScopedKey('rl:assistant:visitor'), analytics: false, timeout: 1500 })
    if (!assistantLimitAllows(await visitor.limit(identity))) return fallback()
    const budget = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(300, '1 d'), prefix: deploymentScopedKey('rl:assistant:budget'), analytics: false, timeout: 1500 })
    if (!assistantLimitAllows(await budget.limit('all'))) return fallback()
    return Response.json(await generateAssistantAnswer(question, previousQuestions, apiKey), { headers })
  } catch { return fallback() }
}
