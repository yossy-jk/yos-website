/**
 * GET  /api/eos/data?token=yos-joe-2026  — returns full EOS data
 * POST /api/eos/data                      — update EOS data (token in body)
 * DELETE /api/eos/data                   — delete a single item by type + id
 *
 * Stored in Redis under yos:eos:data (single JSON blob)
 */

import { NextResponse } from 'next/server'

const EOS_KEY = 'yos:eos:data'
const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'yos-joe-2026'

export interface Rock {
  id: string
  title: string
  owner: string
  status: 'on-track' | 'off-track' | 'done' | 'not-started'
  quarter: string   // e.g. "Q3 2026"
  dueDate: string   // ISO date
  notes?: string
}

export interface Todo {
  id: string
  title: string
  owner: string
  dueDate: string   // ISO date
  done: boolean
  createdAt: string
  completedAt?: string
}

export interface Issue {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'discussing' | 'solved' | 'dropped'
  createdAt: string
  notes?: string
  solvedAt?: string
}

export interface VTO {
  vision: string
  mission: string
  coreValues: string[]
  tenYearTarget: string
  threeYearRevenue: string
  threeYearPicture: string
  oneYearRevenue: string
  oneYearGoals: string[]
  marketingStrategy: string
  niche: string
  guarantee: string
  differentiators: string[]
}

export interface ScorecardWeek {
  weekEnding: string    // ISO date — Friday of that week
  actual: number | null
}

export interface KPIMetric {
  id: string
  name: string
  owner: string
  target: number
  unit: string          // 'calls', 'quotes', 'visits', '%', 'posts', 'deals'
  format?: 'number' | 'currency' // default 'number'
  higherIsBetter: boolean
  weeks: ScorecardWeek[] // rolling 13 weeks, newest last
  notes?: string
}

export interface EOSData {
  vto: VTO
  rocks: Rock[]
  todos: Todo[]
  issues: Issue[]
  scorecard: KPIMetric[]
  updatedAt: string
}

const DEFAULT_VTO: VTO = {
  vision: '',
  mission: 'Help Newcastle businesses secure better spaces, better cleaning, and better workplaces — without getting taken advantage of.',
  coreValues: [
    'On your side — always',
    'Newcastle first',
    'Plain English, no waffle',
    'We pick up the phone',
  ],
  tenYearTarget: '$10M revenue — YOS running under management, Joe and Sarah free to travel.',
  threeYearRevenue: '$3M',
  threeYearPicture: 'Three fully systematised service lines (Tenant Rep, Cleaning, Furniture). Team of 6. YOS recognised as Newcastle\'s go-to commercial property team.',
  oneYearRevenue: '$1M',
  oneYearGoals: [
    'First dollar from every service line',
    'Cleaning MRR at $30k/month',
    'Furniture/Fitout: 3 projects in pipeline at all times',
    'Tenant Rep: 5 active searches',
    'LeaseIntel: 50 paid reviews delivered',
  ],
  marketingStrategy: 'Newcastle commercial property owners renewing leases in the next 12-24 months. Business owners moving into new offices. Companies needing commercial cleaning contracts.',
  niche: 'Tenant-side commercial property advisory — Newcastle and Hunter Valley. We never act for landlords.',
  guarantee: '100% tenant-side. We never act for landlords or developers. If we can\'t add value, we\'ll tell you.',
  differentiators: [
    'Only tenant-side — no conflict of interest',
    'Newcastle embedded — we know every building',
    'One team across lease, fitout, furniture, cleaning',
    'Fixed fee or success fee — no surprises',
  ],
}

function lastNFridays(n: number): string[] {
  const fridays: string[] = []
  const d = new Date()
  // rewind to last Friday
  const day = d.getDay()
  const diff = day <= 5 ? day - 5 : day - 12
  d.setDate(d.getDate() - (diff < 0 ? diff + 7 : diff) - (day === 5 ? 0 : 0))
  // simpler: get most recent Friday
  const today = new Date()
  const dow = today.getDay() // 0=Sun
  const toFriday = (dow <= 5) ? (5 - dow) : (12 - dow)
  const nextFri = new Date(today)
  nextFri.setDate(today.getDate() + toFriday)
  for (let i = n - 1; i >= 0; i--) {
    const fri = new Date(nextFri)
    fri.setDate(nextFri.getDate() - i * 7)
    fridays.push(fri.toISOString().split('T')[0])
  }
  return fridays
}

function defaultWeeks(): ScorecardWeek[] {
  return lastNFridays(13).map(w => ({ weekEnding: w, actual: null }))
}

// KPI version — bump when replacing all defaults to force Redis migration
const SCORECARD_VERSION = 'v2-2026-05'

const DEFAULT_SCORECARD: KPIMetric[] = [
  // ── CLEANING ─────────────────────────────────────────────────────────────
  {
    id: 'kpi-clean-prospect',
    name: 'Cleaning outbound contacts',
    owner: 'Joe + Yossy',
    target: 20,
    unit: 'contacts',
    higherIsBetter: true,
    notes: 'Cold calls, emails or LinkedIn DMs to cleaning prospects. Joe + Yossy combined.',
    weeks: defaultWeeks(),
  },
  {
    id: 'kpi-clean-quotes',
    name: 'Cleaning quotes submitted',
    owner: 'Joe + Yossy',
    target: 5,
    unit: 'quotes',
    higherIsBetter: true,
    notes: 'Formal cleaning proposals sent to prospects this week.',
    weeks: defaultWeeks(),
  },
  // ── FURNITURE & FITOUT ───────────────────────────────────────────────────
  {
    id: 'kpi-furn-prospect',
    name: 'Furniture outbound contacts',
    owner: 'Joe + Yossy',
    target: 200,
    unit: 'contacts',
    higherIsBetter: true,
    notes: 'Cold outreach to furniture/fitout prospects. Joe + Yossy combined — high volume.',
    weeks: defaultWeeks(),
  },
  {
    id: 'kpi-furn-quotes',
    name: 'Furniture quotes submitted ($)',
    owner: 'Joe',
    target: 500000,
    unit: '$',
    format: 'currency',
    higherIsBetter: true,
    notes: 'Total dollar value of furniture/fitout quotes submitted this week. Target: $500k.',
    weeks: defaultWeeks(),
  },
  // ── TENANT REP ───────────────────────────────────────────────────────────
  {
    id: 'kpi-tenant-meetings',
    name: 'Tenant Rep discovery meetings',
    owner: 'Joe',
    target: 1,
    unit: 'meetings',
    higherIsBetter: true,
    notes: 'In-person or Zoom discovery meetings with businesses about their lease. Target: 1/week.',
    weeks: defaultWeeks(),
  },
  // ── CONTENT ──────────────────────────────────────────────────────────────
  {
    id: 'kpi-blog',
    name: 'Blog posts live on site',
    owner: 'Yossy',
    target: 10,
    unit: 'posts',
    higherIsBetter: true,
    notes: 'New posts published to yourofficespace.au/blog this week. SEO lead gen engine.',
    weeks: defaultWeeks(),
  },
  {
    id: 'kpi-linkedin',
    name: 'LinkedIn posts published',
    owner: 'Yossy',
    target: 5,
    unit: 'posts',
    higherIsBetter: true,
    notes: 'Approved posts published to the YOS LinkedIn page. Target: 5 days per week.',
    weeks: defaultWeeks(),
  },
  // ── FINANCIAL ────────────────────────────────────────────────────────────
  {
    id: 'kpi-revenue',
    name: 'Revenue',
    owner: 'Joe',
    target: 20000,
    unit: '$',
    format: 'currency',
    higherIsBetter: true,
    notes: 'Total revenue received this week. Enter from Xero weekly P&L. Target ≈ $1M/yr run rate.',
    weeks: defaultWeeks(),
  },
  {
    id: 'kpi-expenses',
    name: 'Expenses',
    owner: 'Joe',
    target: 12000,
    unit: '$',
    format: 'currency',
    higherIsBetter: false,
    notes: 'Total outgoings this week. Target = stay under. Wages, software, suppliers.',
    weeks: defaultWeeks(),
  },
  {
    id: 'kpi-ebitda',
    name: 'EBITDA',
    owner: 'Joe',
    target: 8000,
    unit: '$',
    format: 'currency',
    higherIsBetter: true,
    notes: 'Revenue minus Expenses. Auto-calculated when both are entered. Target: $8k/week (≈ $416k/yr).',
    weeks: defaultWeeks(),
  },
  // ── HEALTH ───────────────────────────────────────────────────────────────
  {
    id: 'kpi-gym-joe',
    name: 'Exercise sessions — Joe',
    owner: 'Joe',
    target: 3,
    unit: 'sessions',
    higherIsBetter: true,
    notes: 'Gym or exercise sessions completed this week. Target: 3/week.',
    weeks: defaultWeeks(),
  },
  {
    id: 'kpi-gym-sarah',
    name: 'Exercise sessions — Sarah',
    owner: 'Sarah',
    target: 3,
    unit: 'sessions',
    higherIsBetter: true,
    notes: 'Gym or exercise sessions completed this week. Target: 3/week.',
    weeks: defaultWeeks(),
  },
]

const DEFAULT_EOS: EOSData = {
  vto: DEFAULT_VTO,
  rocks: [],
  todos: [],
  issues: [],
  scorecard: DEFAULT_SCORECARD,
  updatedAt: new Date().toISOString(),
}

async function getRedis(): Promise<{ url: string; token: string } | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url, token }
}

async function readEOS(url: string, token: string): Promise<EOSData> {
  const res = await fetch(`${url}/get/${EOS_KEY}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const d = await res.json() as { result: string | null }
  if (!d.result) return DEFAULT_EOS
  try {
    const data = JSON.parse(d.result) as EOSData
    // Migration: if scorecard version is stale, replace entirely with new defaults
    // Preserve any historical week data from metrics that share an ID
    const dataAny = data as unknown as Record<string, unknown>
    const storedVersion = dataAny.scorecardVersion as string | undefined
    if (!data.scorecard || storedVersion !== SCORECARD_VERSION) {
      const oldWeeks: Record<string, ScorecardWeek[]> = {}
      if (data.scorecard) {
        for (const m of data.scorecard as KPIMetric[]) oldWeeks[m.id] = m.weeks
      }
      data.scorecard = DEFAULT_SCORECARD.map(m => ({
        ...m,
        weeks: oldWeeks[m.id] || m.weeks,
      })); dataAny.scorecardVersion = SCORECARD_VERSION
    } else {
      const existingIds = new Set(data.scorecard.map((m: KPIMetric) => m.id))
      for (const defaultMetric of DEFAULT_SCORECARD) {
        if (!existingIds.has(defaultMetric.id)) data.scorecard.push(defaultMetric)
      }
    }
    return data
  } catch {
    return DEFAULT_EOS
  }
}

async function writeEOS(url: string, token: string, data: EOSData): Promise<void> {
  await fetch(`${url}/set/${EOS_KEY}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(data)),
  })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const redis = await getRedis()
  if (!redis) return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
  const data = await readEOS(redis.url, redis.token)
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { token, action, payload } = body

  if (token !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const redis = await getRedis()
  if (!redis) return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })

  const data = await readEOS(redis.url, redis.token)

  // ── VTO update ──────────────────────────────────
  if (action === 'update-vto') {
    data.vto = { ...data.vto, ...payload }
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  // ── Rocks ──────────────────────────────────────
  if (action === 'add-rock') {
    const rock: Rock = {
      id: crypto.randomUUID(),
      title: payload.title,
      owner: payload.owner || 'Joe',
      status: 'not-started',
      quarter: payload.quarter || currentQuarter(),
      dueDate: payload.dueDate || quarterEndDate(),
      notes: payload.notes || '',
    }
    data.rocks.push(rock)
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true, id: rock.id })
  }

  if (action === 'update-rock') {
    const idx = data.rocks.findIndex(r => r.id === payload.id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    data.rocks[idx] = { ...data.rocks[idx], ...payload }
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  if (action === 'delete-rock') {
    data.rocks = data.rocks.filter(r => r.id !== payload.id)
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  // ── To-Dos ─────────────────────────────────────
  if (action === 'add-todo') {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: payload.title,
      owner: payload.owner || 'Joe',
      dueDate: payload.dueDate || sevenDaysFromNow(),
      done: false,
      createdAt: new Date().toISOString(),
    }
    data.todos.push(todo)
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true, id: todo.id })
  }

  if (action === 'toggle-todo') {
    const idx = data.todos.findIndex(t => t.id === payload.id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    data.todos[idx].done = !data.todos[idx].done
    data.todos[idx].completedAt = data.todos[idx].done ? new Date().toISOString() : undefined
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  if (action === 'delete-todo') {
    data.todos = data.todos.filter(t => t.id !== payload.id)
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  // ── Issues ─────────────────────────────────────
  if (action === 'add-issue') {
    const issue: Issue = {
      id: crypto.randomUUID(),
      title: payload.title,
      priority: payload.priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
      notes: payload.notes || '',
    }
    data.issues.push(issue)
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true, id: issue.id })
  }

  if (action === 'update-issue') {
    const idx = data.issues.findIndex(i => i.id === payload.id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (payload.status === 'solved' && data.issues[idx].status !== 'solved') {
      payload.solvedAt = new Date().toISOString()
    }
    data.issues[idx] = { ...data.issues[idx], ...payload }
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  if (action === 'delete-issue') {
    data.issues = data.issues.filter(i => i.id !== payload.id)
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  // ── Scorecard ───────────────────────────────────
  // Ensure scorecard exists on older data
  if (!data.scorecard) data.scorecard = DEFAULT_SCORECARD

  if (action === 'scorecard-log') {
    // Log an actual value for a specific metric + week
    // payload: { id, weekEnding, actual }
    const idx = data.scorecard.findIndex(m => m.id === payload.id)
    if (idx === -1) return NextResponse.json({ error: 'Metric not found' }, { status: 404 })
    const wIdx = data.scorecard[idx].weeks.findIndex(w => w.weekEnding === payload.weekEnding)
    if (wIdx === -1) {
      data.scorecard[idx].weeks.push({ weekEnding: payload.weekEnding as string, actual: payload.actual as number | null })
      data.scorecard[idx].weeks.sort((a, b) => a.weekEnding.localeCompare(b.weekEnding))
      // Keep max 13 weeks
      if (data.scorecard[idx].weeks.length > 13) data.scorecard[idx].weeks = data.scorecard[idx].weeks.slice(-13)
    } else {
      data.scorecard[idx].weeks[wIdx].actual = payload.actual as number | null
    }
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  if (action === 'scorecard-update-metric') {
    // Update name/target/owner/notes for a metric
    const idx = data.scorecard.findIndex(m => m.id === payload.id)
    if (idx === -1) return NextResponse.json({ error: 'Metric not found' }, { status: 404 })
    data.scorecard[idx] = { ...data.scorecard[idx], ...payload }
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  if (action === 'scorecard-reset') {
    // Reset all scorecard metrics to defaults (keeps week history)
    data.scorecard = DEFAULT_SCORECARD
    data.updatedAt = new Date().toISOString()
    await writeEOS(redis.url, redis.token, data)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

// ── Helpers ────────────────────────────────────────────────────────────────
function currentQuarter(): string {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  return `Q${q} ${now.getFullYear()}`
}

function quarterEndDate(): string {
  const now = new Date()
  const q = Math.ceil((now.getMonth() + 1) / 3)
  const endMonth = q * 3 - 1  // 0-indexed
  const endDate = new Date(now.getFullYear(), endMonth + 1, 0)
  return endDate.toISOString().split('T')[0]
}

function sevenDaysFromNow(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().split('T')[0]
}
