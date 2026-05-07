import { NextResponse } from 'next/server'

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN ?? ''
const ODOO_URL = 'https://waycrop.odoo.com'
const ODOO_DB = 'waqas36-waycrop-main-13158551'
const ODOO_USER = 'joe@eof.com.au'
const ODOO_PASS = 'Winning010203__1!'
const ODOO_UID = 23
const ODOO_MISC_PRODUCT_ID = 22652

interface QuoteItem {
  name: string
  qty: number
  category: string
}

interface QuoteRoom {
  type: string
  width: number
  depth: number
}

interface QuoteContact {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  notes: string
}

interface QuoteBody {
  items: QuoteItem[]
  room: QuoteRoom
  contact: QuoteContact
}

async function odooCall(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}): Promise<unknown> {
  const res = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: 1,
      params: {
        model,
        method,
        args,
        kwargs,
      },
    }),
  })
  const data = await res.json() as { result?: unknown; error?: { message: string } }
  if (data.error) throw new Error(`Odoo error: ${data.error.message}`)
  return data.result
}

async function odooAuthenticate(): Promise<string> {
  const res = await fetch(`${ODOO_URL}/web/session/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: 1,
      params: {
        db: ODOO_DB,
        login: ODOO_USER,
        password: ODOO_PASS,
      },
    }),
  })
  // Extract session cookie
  const cookie = res.headers.get('set-cookie') ?? ''
  const sessionMatch = cookie.match(/session_id=([^;]+)/)
  return sessionMatch ? sessionMatch[1] : ''
}

async function createOdooDraft(items: QuoteItem[], room: QuoteRoom, contact: QuoteContact): Promise<string> {
  // Authenticate to get session cookie
  const sessionId = await odooAuthenticate()
  const headers = {
    'Content-Type': 'application/json',
    ...(sessionId ? { Cookie: `session_id=${sessionId}` } : {}),
  }

  // Find or create partner
  const searchRes = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: 1,
      params: {
        model: 'res.partner',
        method: 'search_read',
        args: [[['email', '=', contact.email]]],
        kwargs: { fields: ['id', 'name'], limit: 1 },
      },
    }),
  })
  const searchData = await searchRes.json() as { result?: Array<{ id: number; name: string }> }
  const partners = searchData.result ?? []
  let partnerId: number

  if (partners.length > 0) {
    partnerId = partners[0].id
  } else {
    const createRes = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        id: 1,
        params: {
          model: 'res.partner',
          method: 'create',
          args: [{
            name: `${contact.firstName} ${contact.lastName}`.trim(),
            email: contact.email,
            phone: contact.phone,
            company_name: contact.company,
          }],
          kwargs: {},
        },
      }),
    })
    const createData = await createRes.json() as { result?: number }
    partnerId = createData.result ?? 0
  }

  // Build order lines
  const itemSummary = items.map((i) => `${i.qty}x ${i.name}`).join(', ')
  const orderNote = `Space Planner — ${room.type} ${room.width}×${room.depth}m\n${itemSummary}\n\nClient notes: ${contact.notes || 'None'}\n\nPRICING TO BE ADDED BEFORE SENDING`

  type OrderLine = [number, number, Record<string, unknown>]
  const orderLines: OrderLine[] = items.map((item): OrderLine => [0, 0, {
    product_id: ODOO_MISC_PRODUCT_ID,
    name: `${item.name} (${item.category})`,
    product_uom_qty: item.qty,
    price_unit: 0,
  }])

  // Add a note line
  orderLines.push([0, 0, {
    display_type: 'line_note',
    name: orderNote,
    product_uom_qty: 0,
    price_unit: 0,
  }])

  const soRes = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: 1,
      params: {
        model: 'sale.order',
        method: 'create',
        args: [{
          partner_id: partnerId,
          user_id: ODOO_UID,
          state: 'draft',
          note: orderNote,
          order_line: orderLines,
          client_order_ref: `Space Planner — ${room.type}`,
        }],
        kwargs: {},
      },
    }),
  })

  const soData = await soRes.json() as { result?: number; error?: { message: string } }
  if (soData.error) throw new Error(`Odoo SO create error: ${soData.error.message}`)

  const soId = soData.result ?? 0

  // Read the name back
  const nameRes = await fetch(`${ODOO_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: 1,
      params: {
        model: 'sale.order',
        method: 'read',
        args: [[soId], ['name']],
        kwargs: {},
      },
    }),
  })
  const nameData = await nameRes.json() as { result?: Array<{ name: string }> }
  return nameData.result?.[0]?.name ?? `SO${soId}`
}

async function createHubSpotContact(contact: QuoteContact, room: QuoteRoom, items: QuoteItem[]): Promise<void> {
  const itemList = items.map((i) => `${i.qty}× ${i.name}`).join('\n')
  const noteBody = `Space Planner submission\nRoom: ${room.type} — ${room.width}×${room.depth}m\n\nItems:\n${itemList}\n\nNotes: ${contact.notes || 'None'}`

  // Upsert contact
  try {
    const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      },
      body: JSON.stringify({
        properties: {
          firstname: contact.firstName,
          lastname: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          company: contact.company,
          hs_lead_status: 'NEW',
          lifecyclestage: 'lead',
        },
      }),
    })

    let contactId: string | undefined
    if (res.ok) {
      const data = await res.json() as { id?: string }
      contactId = data.id
    } else {
      // Might exist — try to get by email
      const search = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${HUBSPOT_TOKEN}` },
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: contact.email }] }],
          properties: ['id'],
          limit: 1,
        }),
      })
      const searchData = await search.json() as { results?: Array<{ id: string }> }
      contactId = searchData.results?.[0]?.id
    }

    // Add note
    if (contactId) {
      const now = Date.now()
      await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${HUBSPOT_TOKEN}` },
        body: JSON.stringify({
          properties: {
            hs_note_body: noteBody,
            hs_timestamp: now,
          },
          associations: [
            {
              to: { id: contactId },
              types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
            },
          ],
        }),
      })
    }
  } catch {
    // Non-fatal — log but don't throw
    console.error('HubSpot create failed — non-fatal')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as QuoteBody
    const { items, room, contact } = body

    if (!contact?.email || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Run both in parallel where possible — HubSpot is non-fatal, Odoo must succeed
    const [odooRef] = await Promise.all([
      createOdooDraft(items, room, contact),
      createHubSpotContact(contact, room, items),
    ])

    return NextResponse.json({ success: true, reference: odooRef })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('space-planner-quote error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
