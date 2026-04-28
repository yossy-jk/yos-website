import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Called by cron agent daily — sends Day 2 and Day 7 follow-up emails
// to contacts who completed the free lease risk checker

const HUBSPOT_BASE = 'https://api.hubapi.com/crm/v3/objects/contacts'

async function searchContacts(filter: object) {
  const HUBSPOT_KEY = process.env.HUBSPOT_TOKEN
  const res = await fetch(`${HUBSPOT_BASE}/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUBSPOT_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filter),
  })
  if (!res.ok) throw new Error(`HubSpot search failed: ${res.status}`)
  return res.json()
}

async function patchContact(id: string, properties: Record<string, string>) {
  const HUBSPOT_KEY = process.env.HUBSPOT_TOKEN
  const res = await fetch(`${HUBSPOT_BASE}/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${HUBSPOT_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  })
  if (!res.ok) throw new Error(`HubSpot patch failed: ${res.status}`)
  return res.json()
}

function daysAgoTimestamp(days: number): number {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setDate(d.getDate() - days)
  return d.getTime()
}

function daysAgoRange(days: number): { start: number; end: number } {
  const start = daysAgoTimestamp(days)
  const end = start + 86400000 - 1
  return { start, end }
}

export async function POST(req: Request) {
  // Verify internal secret
  const auth = req.headers.get('x-internal-secret')
  if (auth !== process.env.INTERNAL_SECRET && process.env.INTERNAL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: 'Resend not configured' }, { status: 500 })
  const resend = new Resend(resendKey)

  let day2Sent = 0, day7Sent = 0, errors = 0

  // ── DAY 2 FOLLOW-UP ──────────────────────────────────────────────────────
  const day2Range = daysAgoRange(2)
  const day2Search = await searchContacts({
    filterGroups: [{
      filters: [
        { propertyName: 'leaseintel_free_check', operator: 'EQ', value: 'true' },
        { propertyName: 'leaseintel_check_date', operator: 'GTE', value: String(day2Range.start) },
        { propertyName: 'leaseintel_check_date', operator: 'LTE', value: String(day2Range.end) },
        { propertyName: 'leaseintel_day2_sent', operator: 'NEQ', value: 'true' },
      ]
    }],
    properties: ['firstname', 'email', 'leaseintel_risk_level'],
    limit: 50,
  })

  for (const contact of (day2Search.results || [])) {
    const { firstname, email, leaseintel_risk_level } = contact.properties
    if (!email) continue
    const riskLevel = leaseintel_risk_level || 'medium'
    const name = firstname || 'there'

    try {
      await resend.emails.send({
        from: 'Joseph Kelley <jk@yourofficespace.au>',
        to: email,
        replyTo: 'jk@yourofficespace.au',
        subject: 'Your lease risk — what to do next',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
            <div style="background: #0A0A0A; padding: 24px; margin-bottom: 28px;">
              <p style="color: #00B5A5; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 6px; font-weight: 600;">Your Office Space — Newcastle</p>
              <p style="color: white; font-weight: 800; font-size: 20px; margin: 0; text-transform: uppercase;">What to do with your risk rating</p>
            </div>

            <p style="color: #333; font-size: 15px; margin: 0 0 20px;">Hi ${name},</p>

            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
              You checked your lease risk two days ago. ${
                riskLevel === 'high'
                  ? 'Your rating came back HIGH RISK. That means there are clauses in your lease that could cost you significantly — at signing, during the term, or at exit.'
                  : riskLevel === 'medium'
                  ? 'Your rating came back MODERATE RISK. There are a few areas worth pushing on before you sign or renew.'
                  : 'Your rating came back LOWER RISK. That said, a lower risk rating on the checker still doesn\'t mean the lease is clean — it means the headline clauses look reasonable.'
              }
            </p>

            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
              Here is what most tenants in your position miss:
            </p>

            <div style="border-left: 3px solid #00B5A5; padding: 0 0 0 20px; margin: 0 0 28px;">
              <p style="color: #333; font-size: 14px; line-height: 1.7; margin: 0 0 12px;"><strong>Make good</strong> — the cost of restoring the premises at exit is the most commonly underestimated liability in a commercial lease. Estimates typically run $80–$150/sqm. On a 200sqm office, that is $16,000–$30,000 you may owe at the end.</p>
              <p style="color: #333; font-size: 14px; line-height: 1.7; margin: 0 0 12px;"><strong>Rent reviews</strong> — market rent reviews with no cap can reset your rent significantly above CPI. One market review at the wrong time can undo years of below-market rent.</p>
              <p style="color: #333; font-size: 14px; line-height: 1.7; margin: 0;"><strong>Outgoings</strong> — some leases cap them, most don't. If outgoings are uncapped, you carry the landlord's maintenance risk on top of your rent.</p>
            </div>

            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
              The free checker gave you the headline. The LeaseIntel report gives you every clause, your total financial exposure in one table, and exactly what to negotiate — delivered within 24 hours.
            </p>

            <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 20px 24px; margin-bottom: 28px;">
              <p style="color: #0f766e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">LeaseIntel Full Report — $297 ex GST</p>
              <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
                Every clause rated. Financial exposure summary. Negotiation roadmap. 24-hour turnaround.<br>
                <strong>Newcastle businesses: free until 21 July 2026.</strong>
              </p>
              <a href="https://yourofficespace.au/lease-review" style="display: inline-block; background: #00B5A5; color: white; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 24px; text-decoration: none;">Submit your lease →</a>
            </div>

            <p style="color: #aaa; font-size: 11px; margin: 0;">
              Joseph Kelley — Your Office Space, Newcastle NSW<br>
              <a href="https://yourofficespace.au" style="color: #00B5A5; text-decoration: none;">yourofficespace.au</a> · 0434 655 511
            </p>
          </div>
        `,
      })

      await patchContact(contact.id, { leaseintel_day2_sent: 'true' })
      day2Sent++
    } catch (e) {
      console.error('Day 2 send error:', e)
      errors++
    }
  }

  // ── DAY 7 FOLLOW-UP ──────────────────────────────────────────────────────
  const day7Range = daysAgoRange(7)
  const day7Search = await searchContacts({
    filterGroups: [{
      filters: [
        { propertyName: 'leaseintel_free_check', operator: 'EQ', value: 'true' },
        { propertyName: 'leaseintel_check_date', operator: 'GTE', value: String(day7Range.start) },
        { propertyName: 'leaseintel_check_date', operator: 'LTE', value: String(day7Range.end) },
        { propertyName: 'leaseintel_day7_sent', operator: 'NEQ', value: 'true' },
      ]
    }],
    properties: ['firstname', 'email', 'leaseintel_risk_level'],
    limit: 50,
  })

  for (const contact of (day7Search.results || [])) {
    const { firstname, email, leaseintel_risk_level } = contact.properties
    if (!email) continue
    const riskLevel = leaseintel_risk_level || 'medium'
    const name = firstname || 'there'

    try {
      await resend.emails.send({
        from: 'Joseph Kelley <jk@yourofficespace.au>',
        to: email,
        replyTo: 'jk@yourofficespace.au',
        subject: 'One last thing about your lease',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
            <div style="background: #0A0A0A; padding: 24px; margin-bottom: 28px;">
              <p style="color: #00B5A5; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 6px; font-weight: 600;">Your Office Space — Newcastle</p>
              <p style="color: white; font-weight: 800; font-size: 20px; margin: 0; text-transform: uppercase;">Still thinking about your lease?</p>
            </div>

            <p style="color: #333; font-size: 15px; margin: 0 0 20px;">Hi ${name},</p>

            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
              You checked your lease risk last week and came back ${
                riskLevel === 'high' ? 'HIGH RISK' : riskLevel === 'medium' ? 'MODERATE RISK' : 'LOWER RISK'
              }. Just wanted to make sure you didn't miss this.
            </p>

            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
              The LeaseIntel report is the full review — your actual lease document analysed clause by clause, every risk explained in plain English, and a specific list of what to negotiate before you sign.
            </p>

            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
              If you're still in the lease decision phase, now is the right time. Once you sign, the negotiating window closes.
            </p>

            <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 20px 24px; margin-bottom: 28px;">
              <p style="color: #0f766e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">LeaseIntel Full Report</p>
              <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0 0 4px;">$297 ex GST · 24-hour turnaround</p>
              <p style="color: #10b981; font-size: 14px; font-weight: 700; margin: 0 0 16px;">Newcastle businesses: <strong>FREE until 21 July 2026</strong></p>
              <a href="https://yourofficespace.au/lease-review" style="display: inline-block; background: #00B5A5; color: white; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 24px; text-decoration: none;">Get the full report →</a>
            </div>

            <p style="color: #333; font-size: 13px; line-height: 1.7; margin: 0 0 20px;">
              If the timing isn't right — no problem. Hit reply and let me know where things are at. Happy to help when you're ready.
            </p>

            <p style="color: #333; font-size: 14px; margin: 0 0 4px;">Joe Kelley</p>
            <p style="color: #aaa; font-size: 11px; margin: 0;">
              Your Office Space, Newcastle NSW<br>
              <a href="https://yourofficespace.au" style="color: #00B5A5; text-decoration: none;">yourofficespace.au</a> · 0434 655 511
            </p>
          </div>
        `,
      })

      await patchContact(contact.id, { leaseintel_day7_sent: 'true' })
      day7Sent++
    } catch (e) {
      console.error('Day 7 send error:', e)
      errors++
    }
  }

  return NextResponse.json({ ok: true, day2Sent, day7Sent, errors })
}
