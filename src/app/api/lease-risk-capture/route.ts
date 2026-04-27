import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const HUBSPOT_BASE = 'https://api.hubapi.com/crm/v3/objects/contacts'

const RISK_LABELS: Record<string, string> = {
  high: 'HIGH RISK',
  medium: 'MODERATE RISK',
  low: 'LOWER RISK',
}

const RISK_MESSAGES: Record<string, string> = {
  high: 'This lease has significant risk factors. Before you sign anything, you need a professional review.',
  medium: 'There are some areas worth attention. A full review will show you exactly what to negotiate.',
  low: 'Your lease looks relatively standard. A full review will confirm there are no hidden issues.',
}

const QUESTIONS: { id: string; label: string; risk: Record<string, string> }[] = [
  { id: 'term', label: 'Lease term', risk: { '7+ years': 'high', '1–2 years': 'medium' } },
  { id: 'options', label: 'Renewal options', risk: { 'No options': 'high' } },
  { id: 'rent_review', label: 'Rent review method', risk: { 'Market review': 'high', 'Combination / not sure': 'medium' } },
  { id: 'outgoings', label: 'Outgoings', risk: { 'Tenant pays all': 'high', 'Not clear in lease': 'high', 'Tenant pays some': 'medium' } },
  { id: 'makegood', label: 'Make-good obligations', risk: { 'Full reinstatement required': 'high', 'Not sure': 'high' } },
  { id: 'assignment', label: 'Assignment / sublet', risk: { 'No — not permitted': 'high', 'Not mentioned / not sure': 'medium' } },
  { id: 'guarantee', label: 'Personal guarantee', risk: { 'Yes — unlimited guarantee': 'high', 'Not sure': 'medium' } },
  { id: 'demolition', label: 'Demolition clause', risk: { 'Yes — without adequate notice': 'high', 'Not sure': 'medium' } },
  { id: 'fitout', label: 'Fitout / incentives', risk: { 'Agreed verbally but not in lease': 'high', 'No incentive offered': 'medium', 'Not requested': 'medium' } },
  { id: 'solicitor', label: 'Solicitor review', risk: { 'No review yet': 'high', 'Skimmed it myself': 'medium' } },
]

function getRisk(answers: Record<string, string>): { level: string; high: number; medium: number; issues: string[] } {
  let high = 0, medium = 0
  const issues: string[] = []
  for (const q of QUESTIONS) {
    const answer = answers[q.id]
    if (!answer) continue
    const r = q.risk[answer]
    if (r === 'high') {
      high++
      issues.push(`${q.label}: ${answer}`)
    } else if (r === 'medium') {
      medium++
      issues.push(`${q.label}: ${answer}`)
    }
  }
  const level = high >= 3 ? 'high' : high >= 1 || medium >= 3 ? 'medium' : 'low'
  return { level, high, medium, issues }
}

async function upsertHubSpotContact(firstname: string, email: string) {
  const HUBSPOT_KEY = process.env.HUBSPOT_TOKEN
  if (!HUBSPOT_KEY) throw new Error('HUBSPOT_TOKEN missing')

  const properties = {
    firstname,
    email,
    leaseintel_free_check: 'true',
    snapshot_region: 'Newcastle',
  }

  // Try to create first
  const createRes = await fetch(HUBSPOT_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUBSPOT_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  })

  if (createRes.ok) return createRes.json()

  if (createRes.status === 409) {
    // Contact exists — find by email then patch
    const searchRes = await fetch(`${HUBSPOT_BASE}/${encodeURIComponent(email)}?idProperty=email`, {
      headers: { 'Authorization': `Bearer ${HUBSPOT_KEY}` },
    })
    if (!searchRes.ok) throw new Error('HubSpot search failed')
    const existing = await searchRes.json()
    const contactId = existing.id

    const patchRes = await fetch(`${HUBSPOT_BASE}/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${HUBSPOT_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    })
    if (!patchRes.ok) throw new Error('HubSpot patch failed')
    return patchRes.json()
  }

  const errText = await createRes.text()
  throw new Error(`HubSpot error ${createRes.status}: ${errText}`)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstname, email, answers } = body

    if (!firstname || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const risk = answers ? getRisk(answers) : null

    // 1. Upsert HubSpot contact
    try {
      await upsertHubSpotContact(String(firstname).slice(0, 200), String(email).slice(0, 200))
    } catch (err) {
      console.error('HubSpot upsert error:', err)
      // Non-fatal — still send email and return ok
    }

    // 2. Send confirmation email via Resend
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey && risk) {
      const resend = new Resend(apiKey)
      const riskLabel = RISK_LABELS[risk.level] || 'ASSESSED'
      const riskMessage = RISK_MESSAGES[risk.level] || ''
      const topIssues = risk.issues.slice(0, 5)

      const riskColour = risk.level === 'high' ? '#ef4444' : risk.level === 'medium' ? '#f59e0b' : '#10b981'

      const issuesHtml = topIssues.length > 0
        ? topIssues.map(i => `<li style="padding: 6px 0; color: #444; font-size: 14px; line-height: 1.6;">${i}</li>`).join('')
        : '<li style="padding: 6px 0; color: #444; font-size: 14px;">No major risk clauses identified.</li>'

      await resend.emails.send({
        from: 'YOS LeaseIntel <notifications@yourofficespace.au>',
        to: String(email).slice(0, 200),
        replyTo: 'jk@yourofficespace.au',
        subject: `Your lease risk rating: ${riskLabel}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff;">
            <div style="background: #0A0A0A; padding: 24px; margin-bottom: 28px;">
              <p style="color: #00B5A5; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 6px; font-weight: 600;">Your Office Space — LeaseIntel</p>
              <p style="color: white; font-weight: 800; font-size: 20px; margin: 0; text-transform: uppercase;">Your Lease Risk Rating</p>
            </div>

            <p style="color: #333; font-size: 15px; margin: 0 0 20px;">Hi ${String(firstname).slice(0, 200)},</p>
            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
              Here is your free lease risk rating based on the 10 questions you answered.
            </p>

            <div style="background: ${riskColour}15; border: 1px solid ${riskColour}40; padding: 20px 24px; margin-bottom: 28px;">
              <p style="color: ${riskColour}; font-weight: 800; font-size: 18px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">${riskLabel}</p>
              <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0;">${riskMessage}</p>
            </div>

            <div style="margin-bottom: 28px;">
              <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                <div style="text-align: center; padding: 16px 24px; background: #fef2f2; border: 1px solid #fecaca;">
                  <p style="font-size: 28px; font-weight: 800; color: #ef4444; margin: 0 0 4px;">${risk.high}</p>
                  <p style="font-size: 11px; color: #999; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">High risk<br>clauses</p>
                </div>
                <div style="text-align: center; padding: 16px 24px; background: #fffbeb; border: 1px solid #fde68a;">
                  <p style="font-size: 28px; font-weight: 800; color: #f59e0b; margin: 0 0 4px;">${risk.medium}</p>
                  <p style="font-size: 11px; color: #999; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">Moderate<br>concerns</p>
                </div>
              </div>
            </div>

            ${topIssues.length > 0 ? `
            <div style="margin-bottom: 28px;">
              <p style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px; font-weight: 600;">Top issues identified</p>
              <ul style="margin: 0; padding: 0 0 0 16px; border-left: 3px solid ${riskColour};">
                ${issuesHtml}
              </ul>
            </div>
            ` : ''}

            <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 20px 24px; margin-bottom: 28px;">
              <p style="color: #0f766e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Want the full picture?</p>
              <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
                The full LeaseIntel report gives you every clause rated, your complete financial exposure in one table, and a negotiation roadmap. $97 + GST. Delivered within 24 hours.
              </p>
              <a href="https://yourofficespace.au/lease-review" style="display: inline-block; background: #00B5A5; color: white; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 24px; text-decoration: none;">Submit your lease — $97 →</a>
            </div>

            <p style="color: #aaa; font-size: 11px; margin: 0;">
              Joseph Kelley — Your Office Space, Newcastle NSW<br>
              <a href="https://yourofficespace.au" style="color: #00B5A5; text-decoration: none;">yourofficespace.au</a>
            </p>
          </div>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Lease risk capture route error:', msg)
    return NextResponse.json({ error: 'Internal error', detail: msg }, { status: 500 })
  }
}
