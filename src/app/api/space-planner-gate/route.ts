import { NextRequest, NextResponse } from 'next/server'

interface GatePayload {
  firstName: string
  email: string
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
  const { firstName, email }: GatePayload = await req.json()

  if (!firstName?.trim() || !email?.trim()) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
  }

  const token = process.env.HUBSPOT_API_KEY || process.env.HUBSPOT_TOKEN
  if (!token) {
    return NextResponse.json({ success: false, error: 'No HubSpot token' }, { status: 500 })
  }

  const contactProps = {
    firstname: firstName.trim(),
    email: email.trim(),
    lifecyclestage: 'lead',
    lead_source: 'Space Planner',
    space_planner_stage: 'started',
  }

  let contactId: string | null = null

  try {
    // Try to update existing contact first
    const patchRes = await hs(
      `/crm/v3/objects/contacts/${encodeURIComponent(email.trim())}?idProperty=email`,
      'PATCH',
      { properties: contactProps },
      token
    )

    if (patchRes.ok) {
      const data = await patchRes.json() as { id: string }
      contactId = data.id
    } else {
      // Create new contact
      const createRes = await hs(
        '/crm/v3/objects/contacts',
        'POST',
        { properties: contactProps },
        token
      )
      if (createRes.ok) {
        const data = await createRes.json() as { id: string }
        contactId = data.id
      }
    }
  } catch (err) {
    console.error('[space-planner-gate] HubSpot contact error:', err)
    // Non-fatal — return success anyway so the gate doesn't block the user
    return NextResponse.json({ success: true, note: 'hs_error' })
  }

  // Add a note to the contact
  if (contactId) {
    try {
      const noteRes = await hs(
        '/crm/v3/objects/notes',
        'POST',
        {
          properties: {
            hs_note_body: 'Space Planner session started',
            hs_timestamp: new Date().toISOString(),
          },
          associations: [
            {
              to: { id: contactId },
              types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
            },
          ],
        },
        token
      )
      if (!noteRes.ok) {
        const errText = await noteRes.text()
        console.error('[space-planner-gate] Note error:', noteRes.status, errText)
      }
    } catch (err) {
      console.error('[space-planner-gate] Note association error:', err)
    }
  }

  return NextResponse.json({ success: true, contactId })
}
