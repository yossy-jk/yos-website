import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { readFileSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const base = join(homedir(), '.openclaw')
  
  // Read AGENT_INTEL.md
  const intelPath = join(base, 'workspace-innovation/AGENT_INTEL.md')
  const intel = existsSync(intelPath) ? readFileSync(intelPath, 'utf8').slice(-8000) : ''

  // Read COO morning brief from MEMORY.md
  const cooMemPath = join(base, 'workspace-chief-of-staff/MEMORY.md')
  const cooMem = existsSync(cooMemPath) ? readFileSync(cooMemPath, 'utf8').slice(-4000) : ''

  // Read PENDING_APPROVALS for innovation tab
  const pendingPath = join(base, 'workspace-innovation/vault/PENDING_APPROVALS.md')
  const pending = existsSync(pendingPath) ? readFileSync(pendingPath, 'utf8') : ''

  // Read daily improvement protocol findings
  const improvePath = join(base, 'workspace-innovation/vault/DAILY_IMPROVEMENT_PROTOCOL.md')
  const improve = existsSync(improvePath) ? readFileSync(improvePath, 'utf8').slice(-3000) : ''

  // Scan agent MEMORY files for today's activity
  const agents = [
    'brand-marketing','chief-of-staff','cleaning-bdm','cleaning-manager',
    'finance','financial-planner','furniture-bdm','furniture-tender',
    'furniture-website','health-wellness','hubspot-revops','inbox-ea',
    'innovation','it-systems','lease-intel','risk','sarah',
    'tenant-rep','tenant-rep-bdm'
  ]

  const agentActivity = agents.map(agent => {
    const memPath = join(base, `workspace-${agent}/MEMORY.md`)
    if (!existsSync(memPath)) return { agent, status: 'no-memory', lastRun: null, snippet: '' }
    const stat = require('fs').statSync(memPath)
    const hoursAgo = (Date.now() - stat.mtimeMs) / 3600000
    const content = readFileSync(memPath, 'utf8')
    const lines = content.split('\n').filter(l => l.trim())
    const recent = lines.slice(-8).join(' ').slice(0, 200)
    return {
      agent,
      status: hoursAgo < 24 ? 'active' : hoursAgo < 72 ? 'stale' : 'dead',
      hoursAgo: Math.round(hoursAgo),
      snippet: recent
    }
  })

  return NextResponse.json({
    intel: intel.split('\n').slice(-50).join('\n'),
    cooMem,
    pending,
    improve,
    agentActivity,
    generatedAt: new Date().toISOString()
  })
}
