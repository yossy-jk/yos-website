import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { promises as fs } from 'fs'
import path from 'path'

const WORKSPACE = '/Users/yourofficespace-main/.openclaw/workspace/yos/compliance'
const MASTER_REGISTER = '/Users/yourofficespace-main/.openclaw/workspace/yos/compliance/MASTER_REGISTER.md'
const CI_REGISTER = '/Users/yourofficespace-main/.openclaw/workspace/yos/compliance/qms/YOS-QMS-012-Continuous-Improvement-Register-v1.0.md'
const TRAINING_LOG = '/Users/yourofficespace-main/.openclaw/workspace/yos/training/quality_log.jsonl'

// Hardcoded clause status from gap analysis
const ISO_CLAUSE_SUMMARY = {
  clause4: 'DONE',
  clause5: 'DONE',
  clause6: 'PARTIAL',
  clause7: 'PARTIAL',
  clause8: 'PARTIAL',
  clause9: 'MISSING',
  clause10: 'PARTIAL',
}

function parseMasterRegister(content: string) {
  const lines = content.split('\n')

  // Parse document table
  let inDocTable = false
  let total = 0, complete = 0, overdue = 0, newDocs = 0, ok = 0

  // Parse NCR table
  let inNCRTable = false
  const ncrs: Array<{ id: string; date: string; source: string; description: string; severity: string; status: string; targetDate: string }> = []

  // Parse milestone table
  let inMilestoneTable = false
  const milestones: Array<{ milestone: string; targetDate: string; status: string }> = []

  for (const line of lines) {
    const trimmed = line.trim()

    // Detect section headers
    if (trimmed.includes('## DOCUMENT CONTROL STATUS')) { inDocTable = true; inNCRTable = false; inMilestoneTable = false; continue }
    if (trimmed.includes('## NCR REGISTER')) { inNCRTable = true; inDocTable = false; inMilestoneTable = false; continue }
    if (trimmed.includes('## CERTIFICATION TIMELINE')) { inMilestoneTable = true; inDocTable = false; inNCRTable = false; continue }
    if (trimmed.startsWith('## ') && !trimmed.includes('DOCUMENT CONTROL') && !trimmed.includes('NCR') && !trimmed.includes('CERTIFICATION TIMELINE')) {
      inDocTable = false; inNCRTable = false; inMilestoneTable = false
    }

    // Document table rows
    if (inDocTable && trimmed.startsWith('|') && !trimmed.startsWith('|---') && !trimmed.toLowerCase().includes('code') && !trimmed.toLowerCase().includes('document')) {
      const cols = trimmed.split('|').map(c => c.trim()).filter(Boolean)
      if (cols.length >= 6) {
        total++
        const status = cols[5].toUpperCase()
        if (status.includes('OVERDUE')) overdue++
        else if (status.includes('COMPLETE')) complete++
        else if (status.includes('NEW')) newDocs++
        else if (status.includes('OK')) { ok++; complete++ }
      }
    }

    // NCR table rows
    if (inNCRTable && trimmed.startsWith('|') && !trimmed.startsWith('|---') && !trimmed.toLowerCase().includes('ncr#') && !trimmed.toLowerCase().includes('date')) {
      const cols = trimmed.split('|').map(c => c.trim()).filter(Boolean)
      if (cols.length >= 7) {
        // Extract target date from Action column (e.g. "target completion 13 May 2026")
        const actionText = cols[5] || ''
        const targetMatch = actionText.match(/target completion\s+(\d+\s+\w+\s+\d{4})/i)
        const targetDate = targetMatch ? targetMatch[1] : '—'

        ncrs.push({
          id: cols[0],
          date: cols[1],
          source: cols[2],
          description: cols[3],
          severity: cols[4] as 'Major' | 'Minor',
          status: cols[6].includes('OPEN') ? 'OPEN' : 'CLOSED',
          targetDate,
        })
      }
    }

    // Milestone table rows
    if (inMilestoneTable && trimmed.startsWith('|') && !trimmed.startsWith('|---') && !trimmed.toLowerCase().includes('milestone') && !trimmed.toLowerCase().includes('target date')) {
      const cols = trimmed.split('|').map(c => c.trim()).filter(Boolean)
      if (cols.length >= 3) {
        const statusText = cols[2]
        let status: 'PENDING' | 'ACTION REQUIRED' | 'COMPLETE' = 'PENDING'
        if (statusText.includes('ACTION REQUIRED')) status = 'ACTION REQUIRED'
        else if (statusText.toLowerCase().includes('complete') || statusText.toLowerCase().includes('certified') || statusText.toLowerCase().includes('issued')) status = 'COMPLETE'
        milestones.push({ milestone: cols[0], targetDate: cols[1], status })
      }
    }
  }

  const percentComplete = total > 0 ? Math.round(((complete + ok) / total) * 100) : 0

  return { documents: { total, complete, overdue, newDocs, ok, percentComplete }, ncrs, milestones }
}

function parseCIRegister(content: string): Array<{ date: string; description: string; status: string; owner: string }> {
  const items: Array<{ date: string; description: string; status: string; owner: string }> = []

  // Look for OPP-XXX blocks
  const oppBlocks = content.split(/###\s+OPP-\d+/g).slice(1)
  for (const block of oppBlocks) {
    const dateMatch = block.match(/\*\*Date identified:\*\*\s*(.+)/i)
    const descMatch = block.match(/\*\*Description:\*\*\s*(.+)/i)
    const statusMatch = block.match(/\*\*Status:\*\*\s*(.+)/i)
    const ownerMatch = block.match(/\*\*Owner:\*\*\s*(.+)/i)

    if (descMatch) {
      items.push({
        date: dateMatch ? dateMatch[1].trim() : '—',
        description: descMatch[1].trim().slice(0, 120),
        status: statusMatch ? (statusMatch[1].includes('COMPLETE') ? 'COMPLETE' : statusMatch[1].includes('IN PROGRESS') ? 'IN PROGRESS' : statusMatch[1].trim().split(' ')[0]) : '—',
        owner: ownerMatch ? ownerMatch[1].trim() : 'TBC',
      })
    }
  }

  return items
}

function parseTrainingLog(content: string): { total: number; pass: number; fail: number } {
  const lines = content.split('\n').filter(Boolean)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  let total = 0, pass = 0, fail = 0
  for (const line of lines) {
    try {
      const entry = JSON.parse(line)
      const ts = entry.timestamp ? new Date(entry.timestamp).getTime() : 0
      if (ts >= sevenDaysAgo) {
        total++
        if (entry.result === 'PASS') pass++
        if (entry.result === 'FAIL') fail++
      }
    } catch { /* skip bad lines */ }
  }
  return { total, pass, fail }
}

function calcDaysRemaining(targetDate: string): number {
  const target = new Date(targetDate)
  const now = new Date()
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  try {
    // Read master register
    const masterContent = await fs.readFile(MASTER_REGISTER, 'utf8')
    const { documents, ncrs, milestones } = parseMasterRegister(masterContent)

    // Read CI register
    let continuousImprovement: Array<{ date: string; description: string; status: string; owner: string }> = []
    try {
      const ciContent = await fs.readFile(CI_REGISTER, 'utf8')
      continuousImprovement = parseCIRegister(ciContent)
    } catch { /* file may not exist */ }

    // Read training log
    let aiCompliance = { tracesThisWeek: 0, qualityPassRate: null as number | null, lastAudit: null as string | null }
    try {
      const trainingContent = await fs.readFile(TRAINING_LOG, 'utf8')
      const { total, pass } = parseTrainingLog(trainingContent)
      if (total > 0) aiCompliance.qualityPassRate = Math.round((pass / total) * 100)
    } catch { /* file may not exist */ }

    // List audit files
    try {
      const auditFiles = await fs.readdir(path.join(WORKSPACE, 'audits'))
      if (auditFiles.length > 0) {
        aiCompliance.lastAudit = auditFiles.sort().reverse()[0].replace('.md', '')
      }
    } catch { /* ignore */ }

    // Try Langfuse for trace count
    try {
      const langfuseRes = await fetch('http://100.80.229.101:3000/api/public/traces?limit=50', {
        headers: {
          Authorization: 'Basic ' + Buffer.from('pk-lf-9a11f899-5a57-4d4b-97f2-99cbb0da48d2:sk-lf-3c0f27e9-17ee-49a8-b35c-53fdfe2ebd9e').toString('base64'),
        },
        signal: AbortSignal.timeout(5000),
      })
      if (langfuseRes.ok) {
        const langfuseData = await langfuseRes.json()
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        const recentTraces = (langfuseData.data || []).filter((t: { timestamp?: string }) => {
          if (!t.timestamp) return false
          return new Date(t.timestamp).getTime() >= sevenDaysAgo
        })
        aiCompliance.tracesThisWeek = recentTraces.length
      }
    } catch { /* Langfuse unreachable */ }

    const targetDate = '2026-06-03'
    const daysRemaining = calcDaysRemaining(targetDate)

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      certification: {
        targetDate,
        daysRemaining,
        standards: ['ISO 9001:2015', 'ISO 45001:2018'],
        certificationBody: 'TBC',
        stage: 'document-prep',
      },
      documents,
      ncrs,
      milestones,
      aiCompliance,
      continuousImprovement,
      isoClauseSummary: ISO_CLAUSE_SUMMARY,
    })
  } catch (err) {
    console.error('compliance-data error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
