/**
 * GET /api/proposal-followup
 * 
 * Returns deals currently in "Proposal Issued" stage that need a follow-up.
 * Follow-up cadence: 7 days → 14 days → 21 days → flagged as abandoned.
 * 
 * Joe's 48hr rule: any quote not touched in 48hrs gets a task.
 * This endpoint surfaces the deals that meet those criteria.
 * 
 * Used by: dashboard (pipeline section), tasks tab, and the
 * proposal-followup LaunchAgent cron job.
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

const HUBSPOT_KEY = process.env.HUBSPOT_TOKEN!

const STAGE_LABELS: Record<string, string> = {
  '2455891412': 'Lead / Enquiry',
  '2455891413': 'Initial Discovery',
  '2455891414': 'Secondary Discovery',
  '2455891415': 'Proposal Prep',
  '2455891417': 'Proposal Issued',
  '2455891418': 'New Business',
  '2455891419': 'Closed Lost',
}

interface FollowupItem {
  dealId: string
  dealName: string
  amount: number
  proposalSentDate: string | null
  lastTouchDate: string | null
  daysSinceProposalSent: number | null
  daysSinceLastTouch: number
  followupStage: 0 | 1 | 2 | 3  // 0=just sent, 1=7d, 2=14d, 3=21d+
  action: string               // what Joe should do
  priority: 'normal' | 'high' | 'urgent'
  note: string
}

async function getProposalDeals(): Promise<FollowupItem[]> {
  try {
    const res = await fetch('https://api.hubapi.com/crm/v3/objects/deals/search', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${HUBSPOT_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filterGroups: [{ filters: [
          { propertyName: 'dealstage', operator: 'EQ', value: '2455891417' },
          { propertyName: 'dealstage', operator: 'NEQ', value: '2455891419' },
        ]}],
        properties: [
          'dealname','dealstage','amount','closedate',
          'hs_lastmodifieddate','notes_last_updated',
          'hubspot_owner_id',
        ],
        sorts: [{ propertyName: 'amount', direction: 'DESCENDING' }],
        limit: 50,
      }),
    })
    if (!res.ok) return []
    const d = await res.json()
    const now = Date.now()

    const items: FollowupItem[] = []

    for (const deal of d.results || []) {
      const p = deal.properties
      const lastMod   = p.hs_lastmodifieddate   ? new Date(p.hs_lastmodifieddate).getTime()   : 0
      const notesMod   = p.notes_last_updated     ? new Date(p.notes_last_updated).getTime()     : lastMod
      const lastTouch  = Math.max(lastMod, notesMod)
      const daysSinceTouch = Math.floor((now - lastTouch) / 86400000)
      const lastTouchISO   = lastTouch ? new Date(lastTouch).toISOString() : null

      // Proposal sent date: estimate from when deal moved to Proposal Issued
      // HubSpot doesn't track stage change dates in basic properties
      // Use last activity date as proxy
      const proposalSentDate = lastTouchISO
      const daysSinceProposal = lastTouchISO
        ? Math.floor((now - new Date(lastTouchISO).getTime()) / 86400000)
        : null

      let followupStage: 0 | 1 | 2 | 3 = 0
      let action = ''
      let note = ''
      let priority: 'normal' | 'high' | 'urgent' = 'normal'

      if (daysSinceTouch >= 21) {
        followupStage = 3
        action = 'Call — 3+ weeks no reply. Assess if still live.'
        priority = 'urgent'
        note = `${daysSinceTouch} days since any contact. Consider: close as lost or personal call.`
      } else if (daysSinceTouch >= 14) {
        followupStage = 2
        action = 'Email + call — 14+ days silent. Send value-add follow-up.'
        priority = 'high'
        note = `${daysSinceTouch} days. Time to re-engage with something useful — market data, case study, or just a call.`
      } else if (daysSinceTouch >= 7) {
        followupStage = 1
        action = 'Send brief follow-up — 7+ days. Quick email or call.'
        priority = 'normal'
        note = `${daysSinceTouch} days. Follow-up cadence: now.`
      } else if (daysSinceTouch >= 2) {
        // Joe's 48hr rule
        followupStage = 1
        action = `Touch point needed — ${daysSinceTouch * 24}hrs+ since last contact`
        priority = daysSinceTouch >= 2 ? 'high' : 'normal'
        note = 'Quote sent but no touch in 48+ hours. Follow up now.'
      }

      const amount = parseFloat(p.amount || '0') || 0

      items.push({
        dealId: deal.id,
        dealName: p.dealname || 'Untitled',
        amount,
        proposalSentDate,
        lastTouchDate: lastTouchISO,
        daysSinceProposalSent: daysSinceProposal,
        daysSinceLastTouch: daysSinceTouch,
        followupStage,
        action,
        priority,
        note,
      })
    }

    return items
  } catch { return [] }
}

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const allItems = await getProposalDeals()

  const urgent   = allItems.filter(i => i.priority === 'urgent')
  const high     = allItems.filter(i => i.priority === 'high')
  const normal   = allItems.filter(i => i.priority === 'normal')
  const needsTouch = allItems.filter(i => i.followupStage <= 1 && i.daysSinceLastTouch >= 2)
  const stale    = allItems.filter(i => i.followupStage >= 2)

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    summary: {
      total: allItems.length,
      urgent,
      high: high.length,
      normal: normal.length,
      needsTouch48h: needsTouch.length,
      stale14plus: stale.length,
      totalValue: allItems.reduce((s, i) => s + i.amount, 0),
    },
    items: [...urgent, ...high, ...normal],
    needsTouch48h: needsTouch,
    note: 'Data from HubSpot. daysSinceTouch = time since last logged activity (email, call, note, meeting). Joe\'s 48hr rule enforced: any proposal with 2+ days silence = needs touch.',
  })
}
