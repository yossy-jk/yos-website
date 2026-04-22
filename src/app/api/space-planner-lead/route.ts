import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface LeadPayload {
  name: string
  email: string
  company?: string
  phone?: string
  notes?: string
  items: Array<{ name: string; price: number; qty: number }>
  subtotal: number
  total: number
  recommendations: string[]
  walls?: Array<{ type: string; length: number }>
  doors?: number
  windows?: number
  columns?: number
}

const HUBSPOT_BASE = 'https://api.hubapi.com'

async function hs(path: string, method: string, body: unknown, token: string): Promise<Response> {
  return fetch(`${HUBSPOT_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export async function POST(req: NextRequest) {
  const body: LeadPayload = await req.json()
  const { name, email, company, phone, notes, items, subtotal, total, recommendations, walls, doors, windows, columns } = body

  // Determine stage: partial lead (save progress) vs full submission
  const isPartial = !name.trim() && notes?.includes('Partial lead')
  const stage = isPartial ? 'started' : 'submitted'

  const HUBSPOT_TOKEN = process.env.HUBSPOT_API_KEY || process.env.HUBSPOT_TOKEN
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!HUBSPOT_TOKEN) return NextResponse.json({ success: false, error: 'No token' }, { status: 500 })

  const [firstName, ...rest] = name.trim().split(' ')
  const lastName = rest.join(' ')

  // Suppress unused var warning — subtotal is passed through for logging
  void subtotal

  // Build a readable item summary
  const itemSummary = items.length > 0
    ? items.slice(0, 5).map(i => `${i.qty}x ${i.name}`).join(', ') + (items.length > 5 ? ` +${items.length - 5} more` : '')
    : 'No items'

  const contextNote = [
    company && `Company: ${company}`,
    phone && `Phone: ${phone}`,
    notes && `Notes: ${notes}`,
    `Items (${items.length}): ${itemSummary}`,
    recommendations.length > 0 && `Recommendations: ${recommendations.join('; ')}`,
    walls && walls.length > 0 && `Walls: ${walls.length}`,
    doors != null && `Doors: ${doors}`,
    windows != null && `Windows: ${windows}`,
  ].filter(Boolean).join('\n')

  let contactId: string | null = null

  // ── 1. Upsert HubSpot contact ─────────────────────────────────────────────
  try {
    const patchRes = await hs(
      `/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
      'PATCH',
      {
        properties: {
          firstname: firstName,
          lastname: lastName || '',
          company: company || '',
          phone: phone || '',
          lead_source: 'Space Planner',
          space_planner_stage: stage,
          space_planner_total: String(total),
          space_planner_items: JSON.stringify(items.slice(0, 5)),
          space_planner_recommendations: recommendations.join('; '),
          space_planner_walls: String(walls?.length ?? 0),
          space_planner_doors: String(doors ?? 0),
          space_planner_windows: String(windows ?? 0),
        },
      },
      HUBSPOT_TOKEN
    )

    if (patchRes.ok) {
      const data = await patchRes.json()
      contactId = data.id
    } else {
      // Create new contact
      const createRes = await hs(
        '/crm/v3/objects/contacts',
        'POST',
        {
          properties: {
            firstname: firstName,
            lastname: lastName || '',
            email,
            company: company || '',
            phone: phone || '',
            lead_source: 'Space Planner',
            space_planner_stage: stage,
            space_planner_total: String(total),
            space_planner_items: JSON.stringify(items.slice(0, 5)),
            space_planner_recommendations: recommendations.join('; '),
            space_planner_walls: String(walls?.length ?? 0),
            space_planner_doors: String(doors ?? 0),
            space_planner_windows: String(windows ?? 0),
          },
        },
        HUBSPOT_TOKEN
      )
      if (createRes.ok) {
        const data = await createRes.json()
        contactId = data.id
      }
    }
  } catch (error) {
    console.error('HubSpot contact error:', error)
  }

  // ── 2. Create HubSpot deal ────────────────────────────────────────────────
  if (!isPartial) {
    try {
      const dealRes = await hs(
        '/crm/v3/objects/deals',
        'POST',
        {
          properties: {
            dealname: `Space Planner Quote — ${name} (${email})`,
            pipeline: 'default',
            dealstage: '2455891412',
            description: `Source: Space Planner\n\n${contextNote}`,
            closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
        },
        HUBSPOT_TOKEN
      )

      if (dealRes.ok && contactId) {
        const deal = await dealRes.json()
        // Associate deal → contact
        await hs(
          `/crm/v4/objects/deals/${deal.id}/associations/contacts/${contactId}`,
          'PUT',
          [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }],
          HUBSPOT_TOKEN
        )
      }
    } catch (error) {
      console.error('HubSpot deal error:', error)
    }
  }

  // ── 3. Email notification to Joe ──────────────────────────────────────────
  if (!isPartial && RESEND_API_KEY) {
    try {
      const resend = new Resend(RESEND_API_KEY)
      await resend.emails.send({
        from: 'YOS Website <notifications@yourofficespace.au>',
        to: 'jk@yourofficespace.au',
        replyTo: email,
        subject: `New Space Planner Lead — ${name}${company ? ` (${company})` : ''}`,
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <div style="background:#0A0A0A;padding:20px 24px;margin-bottom:24px">
              <p style="color:#00B5A5;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 4px">Space Planner</p>
              <p style="color:white;font-weight:700;font-size:18px;margin:0">New Quote Lead — ${name}</p>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:120px">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;font-weight:600">${name}</td></tr>
              ${company ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Company</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${company}</td></tr>` : ''}
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px"><a href="mailto:${email}" style="color:#00B5A5">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px"><a href="tel:${phone}" style="color:#00B5A5">${phone}</a></td></tr>` : ''}
              <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Items</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${items.length} furniture items</td></tr>
              <tr><td style="padding:10px 0;color:#888;font-size:13px">Layout</td><td style="padding:10px 0;font-size:14px">${walls?.length ?? 0} walls · ${doors ?? 0} doors · ${windows ?? 0} windows</td></tr>
            </table>
            <div style="background:#f9f9f9;border-left:3px solid #00B5A5;padding:16px 20px;margin-bottom:24px">
              <p style="color:#555;font-size:13px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.1em">Layout Summary</p>
              <p style="color:#1A1A1A;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${itemSummary}</p>
              ${recommendations.length > 0 ? `<p style="color:#555;font-size:12px;margin:12px 0 0">Recommendations: ${recommendations.join(', ')}</p>` : ''}
              ${notes ? `<p style="color:#555;font-size:12px;margin:8px 0 0">Notes: ${notes}</p>` : ''}
            </div>
            <a href="https://app-ap1.hubspot.com/contacts/442709765" style="display:inline-block;background:#00B5A5;color:white;font-weight:700;font-size:11px;letter-spacing:.15em;text-transform:uppercase;padding:12px 24px;text-decoration:none">View in HubSpot →</a>
            <p style="color:#aaa;font-size:11px;margin-top:24px">yourofficespace.au/tools/space-planner</p>
          </div>
        `,
      })
    } catch (error) {
      console.error('Email notification error:', error)
      // Non-blocking — don't fail the response
    }
  }

  return NextResponse.json({ success: true })
}
