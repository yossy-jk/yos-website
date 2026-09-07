/**
 * POST /api/download/capability-statement
 *
 * Light-gate: collects name + email, upserts to HubSpot, returns a short-lived
 * signed download URL for the capability statement PDF.
 *
 * No credentials exposed to the client.
 */
import { NextResponse } from 'next/server'
import { createDownloadToken } from '@/lib/download-token.mjs'

const TOKEN       = process.env.HUBSPOT_TOKEN
const BASE        = 'https://api.hubapi.com'
const PDF_FILENAME = 'YOS-Capability-Statement.pdf'
const PDF_ROUTE = `/api/file/${PDF_FILENAME}`
const DOWNLOAD_TTL = 15 * 60 // 15 minutes — signed URL valid window

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ── HubSpot helpers ──────────────────────────────────────────────
async function upsertContact(email: string, firstname: string): Promise<string | null> {
  if (!TOKEN) return null
  const safeEmail = esc(email.trim().toLowerCase().slice(0, 200))
  const safeName  = esc(firstname.trim().slice(0, 100))

  // PATCH existing contact first (upsert — no 409)
  const patch = await fetch(
    `${BASE}/crm/v3/objects/contacts/${encodeURIComponent(safeEmail)}?idProperty=email`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          firstname: safeName,
          hs_lead_status: 'NEW',
          lead_source: 'Capability Statement Download',
        },
      }),
    }
  )
  if (patch.ok) {
    const data = await patch.json()
    return data.id ?? null
  }
  if (patch.status === 404) {
    // Create new contact
    const create = await fetch(`${BASE}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          firstname: safeName,
          email: safeEmail,
          hs_lead_status: 'NEW',
          lead_source: 'Capability Statement Download',
        },
      }),
    })
    if (create.ok) {
      const data = await create.json()
      return data.id ?? null
    }
  }
  return null
}

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

    // Upsert to HubSpot (fire-and-forget — don't block download on HS errors)
    upsertContact(email, firstname).catch(console.error)

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
