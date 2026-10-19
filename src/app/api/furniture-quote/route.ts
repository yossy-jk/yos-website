import { NextResponse } from 'next/server'
import { readFurnitureRequest, FurnitureRequestError } from '@/lib/furniture-request'
import { enquiryResponse } from '@/lib/enquiry-delivery'

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin')
    if (origin && origin !== new URL(req.url).origin) return NextResponse.json({ ok: false, error: 'Please submit this form from the YOS website.' }, { status: 403 })
    const { raw, attachment } = await readFurnitureRequest(req)
    if (typeof raw.name !== 'string' || !raw.name.trim() || typeof raw.email !== 'string' || !raw.email.trim()) return NextResponse.json({ ok: false, error: 'Please enter your name and email.' }, { status: 400 })
    return enquiryResponse(new Request(req.url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': req.headers.get('x-forwarded-for') || '' }, body: JSON.stringify(raw) }), 'Furniture Quote Request', attachment)
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof FurnitureRequestError ? error.message : 'Check your enquiry details and optional file.' }, { status: error instanceof FurnitureRequestError ? error.status : 400 })
  }
}
