/**
 * Server-side HubSpot lead submission proxy.
 * Keeps the private app token off the client bundle.
 * All form components POST here instead of calling HubSpot directly.
 */
import { NextResponse } from 'next/server'

const TOKEN   = process.env.HUBSPOT_TOKEN
const BASE    = 'https://api.hubapi.com'
const PIPELINE_ID = 'default'
const STAGE_ID    = '2455891412'

const esc = (s: string) =>
  s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')

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

export async function POST(req: Request) {
  if (!TOKEN) {
    console.error('HUBSPOT_TOKEN not configured')
    return NextResponse.json({ ok: false, error: 'Service unavailable' }, { status: 503 })
  }

  try {
    const body = await req.json()
    const { firstname, email, source, context } = body

    // Input validation
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }
    if (!firstname || typeof firstname !== 'string' || firstname.length < 1) {
      return NextResponse.json({ ok: false, error: 'Invalid name' }, { status: 400 })
    }
    if (source && source.length > 200) {
      return NextResponse.json({ ok: false, error: 'Invalid source' }, { status: 400 })
    }

    // Sanitise
    const safeName    = esc(firstname.trim().slice(0, 100))
    const safeEmail   = esc(email.trim().slice(0, 200))
    const safeSource  = esc((source || 'Website').slice(0, 200))
    const safeContext = context ? esc(String(context).slice(0, 2000)) : undefined

    // 1. Upsert contact using PATCH (no 409 fragility)
    let contactId: string | null = null
    const patchRes = await hs(
      `/crm/v3/objects/contacts/${encodeURIComponent(safeEmail)}?idProperty=email`,
      'PATCH',
      { properties: { firstname: safeName, hs_lead_status: 'NEW', lead_source: 'Website Tool' } }
    )
    if (patchRes.ok) {
      const data = await patchRes.json()
      contactId = data.id
    } else {
      // Contact doesn't exist — create
      const createRes = await hs('/crm/v3/objects/contacts', 'POST', {
        properties: { firstname: safeName, email: safeEmail, hs_lead_status: 'NEW', lead_source: 'Website Tool' },
      })
      if (createRes.ok) {
        const data = await createRes.json()
        contactId = data.id
      }
    }

    // 2. Create deal
    const dealName = `${safeSource} — ${safeName} (${safeEmail})`
    const dealRes = await hs('/crm/v3/objects/deals', 'POST', {
      properties: {
        dealname: dealName,
        pipeline: PIPELINE_ID,
        dealstage: STAGE_ID,
        description: safeContext
          ? `Source: ${safeSource}\n\n${safeContext}`
          : `Source: ${safeSource}`,
        closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    })

    if (!dealRes.ok) return NextResponse.json({ ok: false }, { status: 500 })
    const deal = await dealRes.json()

    // 3. Associate deal → contact
    if (contactId && deal.id) {
      await hs(
        `/crm/v4/objects/deals/${deal.id}/associations/contacts/${contactId}`,
        'PUT',
        [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('HubSpot API error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
