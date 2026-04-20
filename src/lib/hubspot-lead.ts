/**
 * YOS HubSpot Lead Capture
 *
 * Submits a lead directly to HubSpot via the private app token:
 *   1. Upsert contact (create or update by email)
 *   2. Create a deal in "Lead or Enquiry" stage
 *   3. Associate deal → contact
 *
 * Called from tool gates across the site. Runs client-side — the token
 * is exposed via NEXT_PUBLIC_ (read-only scopes only: contacts, deals).
 */

const TOKEN   = process.env.NEXT_PUBLIC_HUBSPOT_TOKEN
const PORTAL  = '442709765'
const BASE    = 'https://api.hubapi.com'

// Sales pipeline — "Lead or Enquiry" stage
const PIPELINE_ID = 'default'
const STAGE_ID    = '2455891412'

/* ─── Types ──────────────────────────────────────────────── */
export interface LeadPayload {
  firstname: string
  email: string
  source: string        // e.g. "Fitout Estimator", "Lease Comparison Tool"
  context?: string      // optional extra — e.g. "Budget: $450k, 300sqm, Premium"
}

/* ─── Helpers ────────────────────────────────────────────── */
async function hs(path: string, method: string, body: unknown): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

/* ─── Main export ────────────────────────────────────────── */
export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean }> {
  if (!TOKEN) {
    console.warn('HubSpot token not configured')
    return { ok: false }
  }

  try {
    // 1. Upsert contact by email
    const contactRes = await hs('/crm/v3/objects/contacts', 'POST', {
      properties: {
        firstname: payload.firstname,
        email: payload.email,
        hs_lead_status: 'NEW',
        lead_source: 'Website Tool',
      },
    })

    let contactId: string | null = null

    if (contactRes.ok) {
      const data = await contactRes.json()
      contactId = data.id
    } else if (contactRes.status === 409) {
      // Contact already exists — extract ID from conflict error
      const err = await contactRes.json()
      const existing = err?.message?.match(/ID: (\d+)/)
      if (existing) contactId = existing[1]
    }

    // 2. Create deal
    const dealName = `${payload.source} — ${payload.firstname} (${payload.email})`
    const dealRes = await hs('/crm/v3/objects/deals', 'POST', {
      properties: {
        dealname: dealName,
        pipeline: PIPELINE_ID,
        dealstage: STAGE_ID,
        description: payload.context
          ? `Source: ${payload.source}\n\n${payload.context}`
          : `Source: ${payload.source}`,
        closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    })

    if (!dealRes.ok) return { ok: false }
    const deal = await dealRes.json()
    const dealId = deal.id

    // 3. Associate deal → contact
    if (contactId && dealId) {
      await hs(
        `/crm/v4/objects/deals/${dealId}/associations/contacts/${contactId}`,
        'PUT',
        [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
      )
    }

    return { ok: true }
  } catch {
    return { ok: false }
  }
}
