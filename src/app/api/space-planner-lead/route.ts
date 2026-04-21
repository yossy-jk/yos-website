import { NextRequest, NextResponse } from 'next/server'

interface LeadPayload {
  name: string
  email: string
  company?: string
  phone?: string
  items: Array<{ name: string; price: number; qty: number }>
  subtotal: number
  total: number
  recommendations: string[]
}

export async function POST(req: NextRequest) {
  const body: LeadPayload = await req.json()
  const { name, email, company, phone, items, subtotal, total, recommendations } = body

  const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN
  if (!HUBSPOT_TOKEN) return NextResponse.json({ success: false, error: 'No token' }, { status: 500 })

  const [firstName, ...rest] = name.trim().split(' ')
  const lastName = rest.join(' ')

  // Suppress unused var warning — subtotal is passed through for logging
  void subtotal

  try {
    const hsRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          firstname: firstName,
          lastname: lastName || '',
          email,
          company: company || '',
          phone: phone || '',
          lead_source: 'Space Planner',
          space_planner_total: String(total),
          space_planner_items: JSON.stringify(items.slice(0, 5)),
          space_planner_recommendations: recommendations.join('; '),
        },
      }),
    })

    if (!hsRes.ok && hsRes.status !== 409) {
      const err = await hsRes.text()
      console.error('HubSpot error:', err)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('capture-lead error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
