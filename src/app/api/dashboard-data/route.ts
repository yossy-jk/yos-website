import { NextResponse } from 'next/server'

const HUBSPOT_KEY = process.env.HUBSPOT_TOKEN!
const MATON_KEY = process.env.MATON_API_KEY || 'GT9qpes_m-iYf4YpPdPBjBIkFyMO9HtAHM9mGAqyBb53wIvAhJ836ehgHmtJz71WTprCYyBjJo1fWbBIMJBh17wv_SQ2ddeRl4I'
const XERO_CONN = 'c71b4964-1b2a-46bc-b26b-5f1e367ba4ea'
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

async function getDeals() {
  try {
    const res = await fetch('https://api.hubapi.com/crm/v3/objects/deals/search', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${HUBSPOT_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filterGroups: [{ filters: [
          { propertyName: 'dealstage', operator: 'NEQ', value: '2455891419' },
        ]}],
        properties: ['dealname', 'dealstage', 'amount', 'closedate', 'hs_lastmodifieddate'],
        sorts: [{ propertyName: 'amount', direction: 'DESCENDING' }],
        limit: 30,
      }),
    })
    if (!res.ok) return []
    const d = await res.json()
    const now = Date.now()
    return (d.results || []).map((deal: {id: string; properties: Record<string,string>}) => {
      const p = deal.properties
      const lastMod = p.hs_lastmodifieddate ? new Date(p.hs_lastmodifieddate).getTime() : 0
      const daysSinceMod = Math.floor((now - lastMod) / 86400000)
      const closeDate = p.closedate ? new Date(p.closedate) : null
      const daysToClose = closeDate ? Math.floor((closeDate.getTime() - now) / 86400000) : null
      const amount = parseFloat(p.amount || '0') || 0
      return {
        id: deal.id,
        name: p.dealname || 'Untitled',
        stage: STAGE_LABELS[p.dealstage] || p.dealstage,
        amount,
        closeDate: closeDate ? closeDate.toISOString().split('T')[0] : null,
        daysToClose,
        daysSinceMod,
        isStale: daysSinceMod >= 5,
        isOverdue: daysToClose !== null && daysToClose < 0,
        isUrgent: daysToClose !== null && daysToClose >= 0 && daysToClose <= 3,
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
      subject: ev.subject || 'No title',
      start: ev.start?.dateTime,
      end: ev.end?.dateTime,
      location: ev.location?.displayName || '',
    }))
  } catch { return [] }
}

async function getXeroSummary() {
  try {
    // Get invoices due or overdue
    const res = await fetch('https://gateway.maton.ai/xero/api.xro/2.0/Invoices?where=Status%3D%3D%22AUTHORISED%22&order=DueDate+ASC', {
      headers: { 'Authorization': `Bearer ${MATON_KEY}`, 'Maton-Connection': XERO_CONN, 'Accept': 'application/json' },
    })
    if (!res.ok) return { outstanding: 0, overdue: 0, overdueCount: 0, outstandingCount: 0 }
    const d = await res.json()
    const invoices = d.Invoices || []
    const now = new Date()
    let outstanding = 0, overdue = 0, overdueCount = 0, outstandingCount = 0
    for (const inv of invoices) {
      const due = inv.DueDate ? new Date(inv.DueDate.replace('/Date(', '').replace('+0000)/', '').replace(')/', '')) : null
      const amt = parseFloat(inv.AmountDue) || 0
      if (amt > 0) {
        outstanding += amt
        outstandingCount++
        if (due && due < now) {
          overdue += amt
          overdueCount++
        }
      }
    }
    return { outstanding: Math.round(outstanding), overdue: Math.round(overdue), overdueCount, outstandingCount }
  } catch { return { outstanding: 0, overdue: 0, overdueCount: 0, outstandingCount: 0 } }
}

type DealItem = {
  id: string; name: string; stage: string; amount: number;
  closeDate: string | null; daysToClose: number | null;
  daysSinceMod: number; isStale: boolean; isOverdue: boolean; isUrgent: boolean;
}

function getPriorities(deals: DealItem[], xero: {overdue: number; overdueCount: number}) {
  const priorities: {label: string; detail: string; type: 'critical'|'action'|'info'}[] = []

  // Overdue invoices
  if (xero.overdue > 0) {
    priorities.push({
      label: `Chase ${xero.overdueCount} overdue invoice${xero.overdueCount > 1 ? 's' : ''} — $${xero.overdue.toLocaleString()} owed`,
      detail: 'Revenue already earned, not yet collected.',
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

  // Stale deals with value
  const stale = deals.filter(d => d.isStale && d.amount > 5000 && !d.isOverdue && !d.isUrgent)
    .sort((a, b) => b.amount - a.amount)
  for (const d of stale.slice(0, 1)) {
    priorities.push({
      label: `Re-engage ${d.name} — ${d.daysSinceMod} days quiet`,
      detail: `$${d.amount.toLocaleString()} — last touched ${d.daysSinceMod} days ago`,
      type: 'action',
    })
  }

  return priorities.slice(0, 3)
}

export async function GET(req: Request) {
  // Simple token check
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'yos-joe-2026'
  if (token !== DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [dealsRaw, events, xero] = await Promise.all([
    getDeals(),
    getCalendarEvents(),
    getXeroSummary(),
  ])

  const deals: DealItem[] = dealsRaw
  const priorities = getPriorities(deals, xero)

  // Pipeline stats
  const totalPipelineValue = deals.reduce((s, d) => s + d.amount, 0)
  const staleDeals = deals.filter(d => d.isStale).length
  const proposalDeals = deals.filter(d => d.stage === 'Proposal Issued')

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    priorities,
    pipeline: {
      totalDeals: deals.length,
      totalValue: totalPipelineValue,
      staleDeals,
      deals: deals.slice(0, 15),
    },
    proposalDeals: proposalDeals.slice(0, 8),
    events: events.slice(0, 5),
    xero,
  })
}
