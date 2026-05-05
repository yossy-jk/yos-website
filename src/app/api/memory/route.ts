/**
 * YOS Memory Layer — Clients & Projects
 * GET  /api/memory?token=***&type=clients|projects|all
 * POST /api/memory — create/update/delete clients and projects
 *
 * Redis keys:
 *   yos:memory:clients  — JSON array of Client objects
 *   yos:memory:projects — JSON array of Project objects
 */

import { NextResponse } from 'next/server'

const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'yos-joe-2026'
const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL   || ''
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

const CLIENTS_KEY  = 'yos:memory:clients'
const PROJECTS_KEY = 'yos:memory:projects'

// ── Types ────────────────────────────────────────────────────────────────────

export interface Client {
  id: string
  name: string
  division: string          // 'Cleaning' | 'Furniture' | 'Tenant Rep' | 'LeaseIntel' | 'Multi'
  industry?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  requirements: string[]    // key requirements — bullet list
  constraints: string[]     // hard constraints / gotchas
  notes?: string
  source?: string           // how they came to us
  hubspotId?: string        // HubSpot company ID if linked
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  clientId: string          // links to Client.id
  clientName?: string       // denormalised for quick display
  name: string
  division: string
  scope: string             // plain-English summary of what's being done
  budget?: number           // total ex GST
  stage: 'lead' | 'scoping' | 'quoting' | 'proposal' | 'negotiating' | 'active' | 'on-hold' | 'complete' | 'lost'
  startDate?: string        // ISO date
  targetDate?: string       // ISO date
  odooRef?: string          // Odoo quote/sales order number
  hubspotDealId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// ── Redis helpers ─────────────────────────────────────────────────────────────

async function redisGet(key: string): Promise<string | null> {
  const res = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: 'no-store',
  })
  const data = await res.json() as { result: string | null }
  return data.result
}

async function redisSet(key: string, value: string): Promise<void> {
  await fetch(`${REDIS_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  })
}

async function readClients(): Promise<Client[]> {
  const raw = await redisGet(CLIENTS_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

async function readProjects(): Promise<Project[]> {
  const raw = await redisGet(PROJECTS_KEY)
  if (!raw) return []
  try { return JSON.parse(raw) } catch { return [] }
}

async function writeClients(clients: Client[]): Promise<void> {
  await redisSet(CLIENTS_KEY, JSON.stringify(clients))
}

async function writeProjects(projects: Project[]): Promise<void> {
  await redisSet(PROJECTS_KEY, JSON.stringify(projects))
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
  }

  const type = searchParams.get('type') || 'all'
  const search = searchParams.get('search')?.toLowerCase() || ''

  let clients: Client[] = []
  let projects: Project[] = []

  if (type === 'clients' || type === 'all') clients = await readClients()
  if (type === 'projects' || type === 'all') projects = await readProjects()

  // Search filter
  if (search) {
    clients = clients.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.division.toLowerCase().includes(search) ||
      (c.contactName || '').toLowerCase().includes(search) ||
      c.requirements.some(r => r.toLowerCase().includes(search))
    )
    projects = projects.filter(p =>
      p.name.toLowerCase().includes(search) ||
      (p.clientName || '').toLowerCase().includes(search) ||
      p.scope.toLowerCase().includes(search) ||
      p.stage.includes(search) ||
      (p.odooRef || '').toLowerCase().includes(search)
    )
  }

  return NextResponse.json({ clients, projects, updatedAt: new Date().toISOString() })
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.json()
  const { token, action, payload } = body as {
    token: string
    action: string
    payload: Record<string, unknown>
  }

  if (token !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
  }

  const now = new Date().toISOString()

  // ── Client actions ──────────────────────────────────────────────────────────

  if (action === 'add-client') {
    const clients = await readClients()
    const client: Client = {
      id: newId(),
      name: String(payload.name || ''),
      division: String(payload.division || 'Multi'),
      industry: payload.industry as string | undefined,
      contactName: payload.contactName as string | undefined,
      contactEmail: payload.contactEmail as string | undefined,
      contactPhone: payload.contactPhone as string | undefined,
      requirements: (payload.requirements as string[]) || [],
      constraints: (payload.constraints as string[]) || [],
      notes: payload.notes as string | undefined,
      source: payload.source as string | undefined,
      hubspotId: payload.hubspotId as string | undefined,
      createdAt: now,
      updatedAt: now,
    }
    clients.push(client)
    await writeClients(clients)
    return NextResponse.json({ ok: true, id: client.id, client })
  }

  if (action === 'update-client') {
    const clients = await readClients()
    const idx = clients.findIndex(c => c.id === payload.id)
    if (idx === -1) return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    clients[idx] = { ...clients[idx], ...(payload as Partial<Client>), updatedAt: now }
    await writeClients(clients)
    return NextResponse.json({ ok: true, client: clients[idx] })
  }

  if (action === 'delete-client') {
    const clients = await readClients()
    const filtered = clients.filter(c => c.id !== payload.id)
    await writeClients(filtered)
    return NextResponse.json({ ok: true })
  }

  // ── Project actions ─────────────────────────────────────────────────────────

  if (action === 'add-project') {
    const [projects, clients] = await Promise.all([readProjects(), readClients()])
    const client = clients.find(c => c.id === payload.clientId)
    const project: Project = {
      id: newId(),
      clientId: String(payload.clientId || ''),
      clientName: client?.name || (payload.clientName as string | undefined),
      name: String(payload.name || ''),
      division: String(payload.division || 'Furniture'),
      scope: String(payload.scope || ''),
      budget: payload.budget ? Number(payload.budget) : undefined,
      stage: (payload.stage as Project['stage']) || 'lead',
      startDate: payload.startDate as string | undefined,
      targetDate: payload.targetDate as string | undefined,
      odooRef: payload.odooRef as string | undefined,
      hubspotDealId: payload.hubspotDealId as string | undefined,
      notes: payload.notes as string | undefined,
      createdAt: now,
      updatedAt: now,
    }
    projects.push(project)
    await writeProjects(projects)
    return NextResponse.json({ ok: true, id: project.id, project })
  }

  if (action === 'update-project') {
    const projects = await readProjects()
    const idx = projects.findIndex(p => p.id === payload.id)
    if (idx === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    projects[idx] = { ...projects[idx], ...(payload as Partial<Project>), updatedAt: now }
    await writeProjects(projects)
    return NextResponse.json({ ok: true, project: projects[idx] })
  }

  if (action === 'delete-project') {
    const projects = await readProjects()
    await writeProjects(projects.filter(p => p.id !== payload.id))
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
