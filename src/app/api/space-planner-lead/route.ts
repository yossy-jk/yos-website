import { NextResponse } from 'next/server'
import { enquiryResponse } from '@/lib/enquiry-delivery'
export async function POST(req: Request) {
  try {
    const raw = await req.json()
    if (!Array.isArray(raw.items) || raw.items.length > 500 || !raw.name?.trim()) return NextResponse.json({ success: false }, { status: 400 })
    return enquiryResponse(new Request(req.url, {
      method: 'POST', headers: req.headers,
      body: JSON.stringify({ ...raw, source: 'Space Planner quote', message: raw.notes, details: { items: raw.items, recommendations: raw.recommendations, walls: raw.walls, doors: raw.doors, windows: raw.windows, columns: raw.columns, subtotal: raw.subtotal, total: raw.total } }),
    }))
  } catch { return NextResponse.json({ success: false }, { status: 400 }) }
}
