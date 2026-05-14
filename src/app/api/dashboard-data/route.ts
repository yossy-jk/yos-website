import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const HUBSPOT_KEY = process.env.HUBSPOT_TOKEN!
const MATON_KEY   = process.env.MATON_API_KEY || 'GT9qpes_m-iYf4YpPdPBjBIkFyMO9HtAHM9mGAqyBb53wIvAhJ836ehgHmtJz71WTprCYyBjJo1fWbBIMJBh17wv_SQ2ddeRl4I'
const XERO_CONN   = 'c71b4964-1b2a-46bc-b26b-5f1e367ba4ea'
const OUTLOOK_CONN = '6521bbc6-e73e-4e30-b648-f240b62a8d2a'

const STAGE_LABELS: Record<string, string> = {
  '2455891412': 'Lead / Enquiry',
  '2455891413': 'Initial Discovery',
  '2455891414': 'Secondary Discovery',
  '2455891415': 'Proposal Prep',
  '2455891417': 'Proposal Issued',
  '2455891418': 'New Business',
  '2455891419': 'Closed Lost',
}

// Stage order for velocity calc
const STAGE_ORDER = ['2455891412','2455891413','2455891414','2455891415','2455891417','2455891418']

// Benchmark days per stage (industry standard)
const STAGE_BENCHMARK: Record<string, number> = {
  '2455891412': 3,  // Lead / Enquiry
  '2455891413': 5,  // Initial Discovery
  '2455891414': 7,  // Secondary Discovery
  '2455891415': 3,  // Proposal Prep
  '2455891417': 14, // Proposal Issued   <-- critical for Joe's 48hr rule
  '2455891418': 5,  // New Business
}

async function getDeals() {
  try {
    const res = await fetch('https://api.hubapi.com/crm/v3/objects/deals/search', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${HUBSPOT_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filterGroups: [{ filters: [
          { propertyName: 'dealstage', operator: 'NEQ', value: '2455891419' },
        ]}],
        properties: [
          'dealname','dealstage','amount','closedate',
          'hs_lastmodifieddate','hubspot_owner_id',
          'notes_last_updated',  // last note/email/call logged
          'hs_object_id',
        ],
        sorts: [{ propertyName: 'amount', direction: 'DESCENDING' }],
        limit: 50,
      }),
    })
    if (!res.ok) return []
    const d = await res.json()
    const now = Date.now()
    return (d.results || []).map((deal: {id: string; properties: Record<string,string>}) => {
      const p = deal.properties
      const lastMod    = p.hs_lastmodifieddate ? new Date(p.hs_lastmodifieddate).getTime() : 0
      const notesMod   = p.notes_last_updated   ? new Date(p.notes_last_updated).getTime()   : lastMod
      const lastTouch  = Math.max(lastMod, notesMod)
      const daysSinceTouch = Math.floor((now - lastTouch) / 86400000)
      const lastTouchISO  = lastTouch ? new Date(lastTouch).toISOString() : null
      const closeDate = p.closedate ? new Date(p.closedate) : null
      const daysToClose = closeDate ? Math.floor((closeDate.getTime() - now) / 86400000) : null
      const amount = parseFloat(p.amount || '0') || 0
      const stage  = p.dealstage || '2455891412'
      const benchmark = STAGE_BENCHMARK[stage] ?? 7
      const isStale      = daysSinceTouch >= 5
      const isQuoteQuiet = daysSinceTouch >= 2   // >48 hrs since last touch — Joe's rule
      const isOverdue   = daysToClose !== null && daysToClose < 0
      const isUrgent    = daysToClose !== null && daysToClose >= 0 && daysToClose <= 3
      const benchmarkDays = benchmark
      return {
        id: deal.id,
        name: p.dealname || 'Untitled',
        stage: STAGE_LABELS[stage] || stage,
        stageId: stage,
        amount,
        closeDate: closeDate ? closeDate.toISOString().split('T')[0] : null,
        daysToClose,
        daysSinceMod: Math.floor((now - lastMod) / 86400000),
        daysSinceTouch,           // <-- new: any contact logged
        lastTouchDate: lastTouchISO, // <-- new: when was last touch
        isStale,
        isQuoteQuiet,             // <-- new: >48hrs, needs action
        isOverdue,
        isUrgent,
        benchmarkDays,            // <-- new: industry standard for this stage
        isOverBenchmark: daysSinceTouch > benchmarkDays, // <-- new
      }
    })
  } catch { return [] }
}

async function getCalendarEvents() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const end = new Date(today)
    end.setDate(end.getDate() + 7)
    const url = `https://gateway.maton.ai/outlook/v1.0/me/calendarView?startDateTime=${today.toISOString()}&endDateTime=${end.toISOString()}&$orderby=start/dateTime&$top=10&$select=subject,start,end,location`
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${MATON_KEY}`, 'Maton-Connection': OUTLOOK_CONN },
    })
    if (!res.ok) return []
    const d = await res.json()
    return (d.value || []).map((ev: {subject?: string; start?: {dateTime: string}; end?: {dateTime: string}; location?: {displayName?: string}}) => ({
      subject:   ev.subject || 'No title',
      start:     ev.start?.dateTime,
      end:       ev.end?.dateTime,
      location:  ev.location?.displayName || '',
    }))
  } catch { return [] }
}

async function getXeroInvoices() {
  try {
    const res = await fetch(
      'https://gateway.maton.ai/xero/api.xro/2.0/Invoices?where=Status%3D%3D%22AUTHORISED%22&order=DueDate+ASC',
      { headers: { 'Authorization': `Bearer ${MATON_KEY}`, 'Maton-Connection': XERO_CONN, 'Accept': 'application/json' } }
    )
    if (!res.ok) return []
    const d = await res.json()
    return d.Invoices || []
  } catch { return [] }
}

function parseXeroDate(raw: string): Date | null {
  if (!raw) return null
  const ms = raw.replace('/Date(','').replace('+0000)/','').replace(')/','')
  return ms ? new Date(parseInt(ms)) : null
}

function buildCashFlow(invoices: ReturnType<typeof getXeroInvoices> extends Promise<infer T> ? T : never) {
  const now  = new Date()
  const in30 = new Date(now.getTime() + 30 * 86400000)
  const in60 = new Date(now.getTime() + 60 * 86400000)
  let in30In  = 0, in30Out = 0
  let in60In  = 0, in60Out = 0
  let arTotal = 0

  for (const inv of invoices) {
    const amt = parseFloat(inv.AmountDue) || 0
    if (amt === 0) continue
    const due = parseXeroDate(inv.DueDate)
    if (due && due < in30) {
      if (inv.Type === 'ACCREC') { in30In  += amt; arTotal += amt }
      else                       { in30Out += amt }
    } else if (due && due < in60) {
      if (inv.Type === 'ACCREC') { in60In  += amt }
      else                       { in60Out += amt }
    } else if (inv.Type === 'ACCREC') {
      arTotal += amt
    }
  }

  // Find the trough (conservative: assume in60 out flows evenly over 30 days)
  const dailyBurn = in30Out / 30
  const troughDay30 = Math.max(0, in30In - in30Out)
  const troughDay60 = troughDay30 + in60In - (in30Out + in60Out * 0.5)
  const projectedLow = Math.min(troughDay30, troughDay60)
  const projectedLowDate = projectedLow === troughDay60
    ? new Date(now.getTime() + 60 * 86400000).toISOString().split('T')[0]
    : new Date(now.getTime() + 30 * 86400000).toISOString().split('T')[0]

  return {
    arTotal: Math.round(arTotal),
    incoming30Days:  Math.round(in30In),
    outgoing30Days:  Math.round(in30Out),
    incoming60Days:  Math.round(in60In),
    outgoing60Days:  Math.round(in60Out),
    projectedLow:    Math.round(projectedLow),
    projectedLowDate,
    days30: 30,
  }
}

type DealItem = {
  id: string; name: string; stage: string; stageId: string; amount: number
  closeDate: string | null; daysToClose: number | null
  daysSinceMod: number; daysSinceTouch: number; lastTouchDate: string | null
  isStale: boolean; isQuoteQuiet: boolean; isOverdue: boolean; isUrgent: boolean
  benchmarkDays: number; isOverBenchmark: boolean
}

function getPriorities(deals: DealItem[], cashflow: ReturnType<typeof buildCashFlow>) {
  const priorities: {label: string; detail: string; type: 'critical'|'action'|'info'}[] = []

  // Overdue Xero invoices
  const overdueInvoices = deals.length // we don't have invoice count here — use cashflow
  if (cashflow.arTotal > 0) {
    // We'll flag overdue from cashflow — handled separately
  }

  // Quote touch-point alerts — Joe's 48hr rule
  const quietQuotes = deals
    .filter(d => d.stageId === '2455891417' && d.isQuoteQuiet && d.amount > 0)
    .sort((a, b) => b.amount - a.amount)
  for (const q of quietQuotes.slice(0, 2)) {
    priorities.push({
      label: `Quote quiet — ${q.name} (${q.daysSinceTouch}d no touch)`,
      detail: `$${q.amount.toLocaleString()} — last touched ${q.lastTouchDate ? timeAgo(q.lastTouchDate) : 'unknown'} ago`,
      type: 'critical',
    })
  }

  // Deals closing within 3 days
  const urgent = deals.filter(d => d.isUrgent && d.amount > 0).sort((a, b) => b.amount - a.amount)
  for (const d of urgent.slice(0, 2)) {
    priorities.push({
      label: `Close ${d.name} — $${d.amount.toLocaleString()} closes in ${d.daysToClose}d`,
      detail: `Stage: ${d.stage}`,
      type: 'critical',
    })
  }

  // Overdue deals
  const overdue = deals.filter(d => d.isOverdue && d.amount > 0).sort((a, b) => b.amount - a.amount)
  for (const d of overdue.slice(0, 1)) {
    priorities.push({
      label: `Update ${d.name} — overdue close date`,
      detail: `$${d.amount.toLocaleString()} — move forward or close as lost`,
      type: 'action',
    })
  }

  // Over benchmark
  const overBench = deals.filter(d => d.isOverBenchmark && d.amount > 5000)
    .sort((a, b) => b.daysSinceTouch - a.daysSinceTouch)
  for (const d of overBench.slice(0, 1)) {
    priorities.push({
      label: `Slow deal — ${d.name} (${d.daysSinceTouch}d in ${d.stage})`,
      detail: `Benchmark for ${d.stage}: ${d.benchmarkDays}d. Consider a call or email.`,
      type: 'action',
    })
  }

  return priorities.slice(0, 5)
}

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export async function GET(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const [dealsRaw, events, invoices] = await Promise.all([
    getDeals(),
    getCalendarEvents(),
    getXeroInvoices(),
  ])

  const deals: DealItem[] = dealsRaw
  const cashflow   = buildCashFlow(invoices)
  const priorities = getPriorities(deals, cashflow)

  const totalPipelineValue = deals.reduce((s, d) => s + d.amount, 0)
  const staleDeals    = deals.filter(d => d.isStale).length
  const quietQuotes   = deals.filter(d => d.isQuoteQuiet).length
  const proposalDeals = deals.filter(d => d.stageId === '2455891417')

  // Overdue invoices from Xero
  const now = new Date()
  const overdueInvoices = invoices.filter(inv => {
    const due = parseXeroDate(inv.DueDate)
    return due && due < now && parseFloat(inv.AmountDue) > 0 && inv.Type === 'ACCREC'
  })
  const overdueTotal = overdueInvoices.reduce((s, inv) => s + parseFloat(inv.AmountDue) || 0, 0)

  if (overdueTotal > 0) {
    priorities.unshift({
      label: `Chase ${overdueInvoices.length} overdue invoice${overdueInvoices.length > 1 ? 's' : ''} — $${overdueTotal.toLocaleString()} owed`,
      detail: 'Revenue already earned, not yet collected.',
      type: 'critical',
    })
  }

  return NextResponse.json({
    generatedAt: new Date().ISOString(),
    priorities,
    pipeline: { totalDeals: deals.length, totalValue: totalPipelineValue, staleDeals, quietQuotes, deals: deals.slice(0, 20) },
    proposalDeals: proposalDeals.slice(0, 8),
    events: events.slice(0, 5),
    xero: {
      outstanding: Math.round(cashflow.arTotal),
      overdue: Math.round(overdueTotal),
      overdueCount: overdueInvoices.length,
      outstandingCount: invoices.filter(i => i.Type === 'ACCREC').length,
    },
    cashflow,  // <-- new
  })
}
