/**
 * POST /api/download/capability-statement
 *
 * Light-gate: collects name + email, notifies the YOS inbox, returns a short-lived
 * signed download URL for the capability statement PDF.
 *
 * No credentials exposed to the client.
 */
import { enquiryResponse } from '@/lib/enquiry-delivery'
import { NextResponse } from 'next/server'
import { createDownloadToken } from '@/lib/download-token.mjs'

const PDF_FILENAME = 'YOS-Capability-Statement.pdf'
const PDF_ROUTE = `/api/file/${PDF_FILENAME}`
const DOWNLOAD_TTL = 15 * 60 // 15 minutes – signed URL valid window

// ── Route ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstname, email } = body

    // Validate
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    if (!firstname || typeof firstname !== 'string' || firstname.trim().length < 1) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 })
    }
    if (firstname.length > 100) {
      return NextResponse.json({ error: 'Name too long' }, { status: 400 })
    }

    const signingSecret = process.env.DOWNLOAD_SIGNING_SECRET
    if (!signingSecret) {
      return NextResponse.json({ error: 'Download service not configured' }, { status: 503 })
    }

    const delivery = await enquiryResponse(new Request(req.url, { method: 'POST', headers: req.headers,
      body: JSON.stringify({ firstname, email, source: 'Capability Statement Download', submissionId: body.submissionId }) }))
    if (!delivery.ok) return delivery

    // The token contains only file scope and expiry. Its HMAC is verified server-side.
    const expiresAt = Math.floor(Date.now() / 1000) + DOWNLOAD_TTL
    const token = createDownloadToken(PDF_FILENAME, expiresAt, signingSecret)
    const downloadUrl = `${PDF_ROUTE}?t=${token}`

    return NextResponse.json({ downloadUrl, expiresAt })
  } catch (err) {
    console.error('[capability-download]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
