import { NextResponse } from 'next/server'
import { enquiryResponse } from '@/lib/enquiry-delivery'
export async function POST(req: Request) {
  try {
    const raw = await req.json()
    if (!raw.contact || !Array.isArray(raw.items) || !raw.items.length || raw.items.length > 500) return NextResponse.json({ success: false }, { status: 400 })
    return enquiryResponse(new Request(req.url, {
      method: 'POST', headers: req.headers,
      body: JSON.stringify({ ...raw.contact, name: `${raw.contact.firstName || ''} ${raw.contact.lastName || ''}`.trim(), source: 'Space Planner quote', message: raw.contact.notes, submissionId: raw.submissionId, details: { room: raw.room, items: raw.items, location: raw.contact.location, deliveryType: raw.contact.deliveryType } }),
    }))
  } catch { return NextResponse.json({ success: false }, { status: 400 }) }
}
