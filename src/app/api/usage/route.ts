import { NextResponse } from 'next/server'

const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'yos-joe-2026'
const LANGFUSE_PUBLIC = process.env.LANGFUSE_PUBLIC_KEY || 'pk-lf-9a11f899-5a57-4d4b-97f2-99cbb0da48d2'
const LANGFUSE_SECRET = process.env.LANGFUSE_SECRET_KEY || 'sk-lf-3c0f27e9-17ee-49a8-b35c-53fdfe2ebd9e'
const LANGFUSE_HOST   = process.env.LANGFUSE_HOST || 'http://100.80.229.101:3000'

async function langfuse(path: string) {
  const creds = Buffer.from(`${LANGFUSE_PUBLIC}:${LANGFUSE_SECRET}`).toString('base64')
  const res = await fetch(`${LANGFUSE_HOST}/api/public/${path}`, {
    headers: { Authorization: `Basic ${creds}` },
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`Langfuse ${res.status}`)
  return res.json()
}

// Cost per 1M tokens (input / output) by model alias
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'claude-3-5-haiku':        { input: 0.80,  output: 4.00  },
  'claude-haiku':             { input: 0.80,  output: 4.00  },
  'claude-3-5-sonnet':       { input: 3.00,  output: 15.00 },
  'claude-sonnet':            { input: 3.00,  output: 15.00 },
  'claude-3-7-sonnet':       { input: 3.00,  output: 15.00 },
  'claude-opus':              { input: 15.00, output: 75.00 },
  'kimi':                     { input: 0,     output: 0     },
  'kimi-long':                { input: 0,     output: 0     },
  'local-worker':             { input: 0,     output: 0     },
  'local-router':             { input: 0,     output: 0     },
}

function modelCost(model: string, inputTokens: number, outputTokens: number): number {
  const key = Object.keys(MODEL_COSTS).find(k => model.toLowerCase().includes(k.toLowerCase()))
  if (!key) return 0
  const { input, output } = MODEL_COSTS[key]
  return (inputTokens / 1_000_000) * input + (outputTokens / 1_000_000) * output
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get recent traces with cost data
    const [traces, observations] = await Promise.all([
      langfuse('traces?limit=50&orderBy=timestamp.desc').catch(() => ({ data: [] })),
      langfuse('observations?limit=100&type=GENERATION&orderBy=startTime.desc').catch(() => ({ data: [] })),
    ])

    const obs: Array<{
      id: string; name?: string; model?: string; modelParameters?: Record<string,unknown>
      usage?: { input?: number; output?: number; total?: number }
      totalCost?: number; calculatedTotalCost?: number
      startTime?: string; traceId?: string
    }> = observations.data || []

    // Aggregate by day (last 30 days)
    const dailyMap: Record<string, { cost: number; tokens: number; calls: number }> = {}
    const modelMap: Record<string, { cost: number; tokens: number; calls: number }> = {}
    let totalCost = 0
    let totalTokens = 0

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    for (const o of obs) {
      const date = o.startTime ? new Date(o.startTime) : null
      if (!date || date < thirtyDaysAgo) continue

      const inputTok  = o.usage?.input  || 0
      const outputTok = o.usage?.output || 0
      const totalTok  = o.usage?.total  || inputTok + outputTok
      const cost = o.calculatedTotalCost || o.totalCost || modelCost(o.model || '', inputTok, outputTok)

      totalCost   += cost
      totalTokens += totalTok

      // Daily
      const day = date.toISOString().split('T')[0]
      if (!dailyMap[day]) dailyMap[day] = { cost: 0, tokens: 0, calls: 0 }
      dailyMap[day].cost   += cost
      dailyMap[day].tokens += totalTok
      dailyMap[day].calls  += 1

      // Model
      const model = o.model || 'unknown'
      if (!modelMap[model]) modelMap[model] = { cost: 0, tokens: 0, calls: 0 }
      modelMap[model].cost   += cost
      modelMap[model].tokens += totalTok
      modelMap[model].calls  += 1
    }

    // Build daily trend (last 14 days)
    const dailyTrend = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().split('T')[0]
      dailyTrend.push({
        date: key,
        cost: dailyMap[key]?.cost || 0,
        tokens: dailyMap[key]?.tokens || 0,
        calls: dailyMap[key]?.calls || 0,
      })
    }

    // 7-day costs
    const last7 = dailyTrend.slice(-7).reduce((s, d) => s + d.cost, 0)
    const prev7 = dailyTrend.slice(0, 7).reduce((s, d) => s + d.cost, 0)
    const todayCost = dailyMap[now.toISOString().split('T')[0]]?.cost || 0

    // Model breakdown sorted by cost
    const models = Object.entries(modelMap)
      .map(([model, data]) => ({ model, ...data }))
      .sort((a, b) => b.cost - a.cost)

    // Recent traces summary
    const recentTraces = (traces.data || []).slice(0, 20).map((t: {
      id: string; name?: string; totalCost?: number; latency?: number
      timestamp?: string; metadata?: Record<string, unknown>
    }) => ({
      id: t.id,
      name: t.name || 'agent-turn',
      cost: t.totalCost || 0,
      latency: t.latency || 0,
      timestamp: t.timestamp,
      model: (t.metadata?.model as string) || 'unknown',
    }))

    const totalObservations = obs.length

    // Check supporting services
    let redisOk = false
    try {
      const rUrl = process.env.UPSTASH_REDIS_REST_URL || ''
      const rTok = process.env.UPSTASH_REDIS_REST_TOKEN || ''
      if (rUrl && rTok) {
        const r = await fetch(`${rUrl}/ping`, { headers: { Authorization: `Bearer ${rTok}` }, cache: 'no-store' })
        redisOk = r.ok
      }
    } catch { /* silent */ }

    const resendOk = !!(process.env.RESEND_API_KEY)
    const langfuseAgentsOk = totalObservations > 0

    return NextResponse.json({
      connected: true,
      totalCost30d: totalCost,
      totalTokens30d: totalTokens,
      todayCost,
      last7dayCost: last7,
      prev7dayCost: prev7,
      totalObservations,
      dailyTrend,
      models,
      recentTraces,
      langfuseUrl: LANGFUSE_HOST,
      setupStatus: { redis: redisOk, resend: resendOk, langfuseAgents: langfuseAgentsOk },
    })
  } catch (err) {
    // Langfuse unreachable — return disconnected state
    return NextResponse.json({
      connected: false,
      error: err instanceof Error ? err.message : 'Langfuse unreachable',
      totalCost30d: 0, totalTokens30d: 0, todayCost: 0,
      last7dayCost: 0, prev7dayCost: 0, totalObservations: 0,
      dailyTrend: [], models: [], recentTraces: [],
      langfuseUrl: LANGFUSE_HOST,
    })
  }
}
