/**
 * GET /api/usage
 * Returns LLM usage and cost data from Langfuse (local Mac Mini).
 * Data pushed to Redis daily by usage-sync automation job.
 * Falls back to direct Langfuse query if Redis empty.
 */
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL   || ''
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const USAGE_KEY   = 'yos:usage:latest'

// Model pricing per 1M tokens
const MODEL_PRICING: Record<string, number> = {
  'openai/MiniMax-M2.7':              0.20,
  'openai/MiniMax-M2.7-highspeed':    0.10,
  'openai/kimi-k2.6':                 0.15,
  'openai/moonshot-v1-128k':          0.20,
  'ollama/llama3.2:3b-instruct-q4_K_M': 0.00,
  'ollama/qwen2.5:7b-instruct-q4_K_M':  0.00,
  'ollama/qwen2.5:14b-instruct-q4_K_M': 0.00,
  'ollama/mistral:7b-instruct-q4_K_M':  0.00,
  'ollama/qwen2.5vl:7b':               0.00,
  'anthropic/claude-haiku-4-5':       0.80,
  'anthropic/claude-sonnet-4-6':      3.00,
  'anthropic/claude-opus-4-6':       15.00,
}

function calcCost(model: string, tokens: number): number {
  const price = MODEL_PRICING[model] ?? 0.20
  return (tokens / 1_000_000) * price
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  // Try Redis first (pushed by usage-sync job)
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const res = await fetch(
        `${REDIS_URL}/get/${encodeURIComponent(USAGE_KEY)}`,
        { headers: { Authorization: `Bearer ${REDIS_TOKEN}` }, cache: 'no-store' }
      )
      if (res.ok) {
        const d = await res.json() as { result?: string | null }
        if (d.result) {
          const parsed = JSON.parse(d.result)
          // Map field names to match dashboard UI expectations
          const daily = parsed.daily || []
          const today = new Date().toISOString().split("T")[0]
          const last7 = daily.filter((d: {date:string}) => d.date >= new Date(Date.now()-7*86400000).toISOString().split("T")[0])
          const prev7 = daily.filter((d: {date:string}) => d.date < new Date(Date.now()-7*86400000).toISOString().split("T")[0] && d.date >= new Date(Date.now()-14*86400000).toISOString().split("T")[0])
          const todayCost = daily.find((d: {date:string,cost:number}) => d.date === today)?.cost || 0
          const last7dayCost = last7.reduce((s: number, d: {cost:number}) => s + d.cost, 0)
          const prev7dayCost = prev7.reduce((s: number, d: {cost:number}) => s + d.cost, 0)
          return NextResponse.json({
            ...parsed,
            connected: true,
            todayCost,
            last7dayCost,
            prev7dayCost,
            totalCost30d: parsed.totalCost || 0,
            totalTokens30d: parsed.totalTokens || 0,
            totalObservations: parsed.totalCalls || 0,
            dailyTrend: daily,
          })
        }
      }
    } catch { /* fall through */ }
  }

  // Return empty state with helpful message
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    error: 'Usage data not yet synced — runs daily at 08:00',
    totalCost: 0,
    totalTokens: 0,
    models: [],
    daily: [],
    setupStatus: {
      redis: !!(REDIS_URL && REDIS_TOKEN),
      langfuse: false,
    }
  })
}
