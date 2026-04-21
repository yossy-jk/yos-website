import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(req: NextRequest) {
  const body: LeadPayload = await req.json()
  const { name, email, company, phone, notes, items, subtotal, total, recommendations, walls, doors, windows, columns } = body

  // Determine stage: partial lead (save progress) vs full submission
  const isPartial = !name.trim() && notes?.includes('Partial lead')
  const stage = isPartial ? 'started' : 'submitted'

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
          space_planner_stage: stage,
          space_planner_total: String(total),
          space_planner_items: JSON.stringify(items.slice(0, 5)),
          space_planner_recommendations: recommendations.join('; '),
          space_planner_walls: String(walls?.length ?? 0),
          space_planner_doors: String(doors ?? 0),
          space_planner_windows: String(windows ?? 0),
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
