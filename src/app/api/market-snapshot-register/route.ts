/**
 * Market Snapshot Registration
 *
 * 1. Upsert contact in HubSpot with snapshot_region custom property
 * 2. Send confirmation email via Resend to the registrant
 * 3. Notify Joe via internal notify route
 */
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN
const HUBSPOT_BASE = 'https://api.hubapi.com'

const VALID_REGIONS = ['Newcastle', 'Hunter Valley', 'Sydney', 'Illawarra']

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function hs(path: string, method: string, body: unknown): Promise<Response> {
  return fetch(`${HUBSPOT_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstname, email, region } = body

    // Validation
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!firstname || typeof firstname !== 'string' || firstname.trim().length < 1) {
      return NextResponse.json({ error: 'First name required' }, { status: 400 })
    }
    const safeRegion = VALID_REGIONS.includes(region) ? region : 'Newcastle'

    const safeName = esc(firstname.trim().slice(0, 100))
    const safeEmail = esc(email.trim().slice(0, 200))

    // ── HubSpot: upsert contact ──────────────────────────────────────────
    if (HUBSPOT_TOKEN) {
      try {
        // Try PATCH first (update if exists)
        const patchRes = await hs(
          `/crm/v3/objects/contacts/${encodeURIComponent(safeEmail)}?idProperty=email`,
          'PATCH',
          {
            properties: {
              firstname: safeName,
              snapshot_region: safeRegion,
              hs_lead_status: 'NEW',
              lead_source: 'Market Snapshot',
            },
          }
        )

        if (!patchRes.ok) {
          // Contact doesn't exist — create
          await hs('/crm/v3/objects/contacts', 'POST', {
            properties: {
              firstname: safeName,
              email: safeEmail,
              snapshot_region: safeRegion,
              hs_lead_status: 'NEW',
              lead_source: 'Market Snapshot',
            },
          })
        }
      } catch (hsErr) {
        console.warn('HubSpot upsert failed (non-fatal):', hsErr)
      }
    }

    // ── Resend: confirmation email to registrant ────────────────────────
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      try {
        const resend = new Resend(apiKey)
        await resend.emails.send({
          from: 'Joe Kelley — Your Office Space <notifications@yourofficespace.au>',
          to: safeEmail,
          replyTo: 'jk@yourofficespace.au',
          subject: `You're on the list — Newcastle Office Market Snapshot`,
          html: `
<div style="font-family:-apple-system,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1A1A1A">
  <div style="background:#1A1A1A;padding:24px 28px;margin-bottom:28px;border-radius:4px">
    <p style="color:#00B5A5;font-size:10px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 6px;font-weight:700">Your Office Space</p>
    <p style="color:white;font-weight:800;font-size:20px;margin:0;letter-spacing:-0.02em">Newcastle Office Market Snapshot</p>
  </div>

  <p style="font-size:15px;line-height:1.8;margin:0 0 16px;font-weight:300">Hi ${safeName},</p>

  <p style="font-size:15px;line-height:1.8;margin:0 0 16px;font-weight:300">
    You&apos;re on the list. First edition lands in your inbox shortly.
  </p>

  <p style="font-size:15px;line-height:1.8;margin:0 0 24px;font-weight:300">
    Every month, one email with the market data landlords already know — vacancy rates, rent trends, supply pipeline, and which way leverage is moving. No noise. No spam.
  </p>

  <p style="font-size:15px;line-height:1.8;margin:0 0 8px;font-weight:300">
    If your lease is coming up, or you just want to know whether your current rent is market — feel free to reply to this email or call me directly.
  </p>

  <div style="margin:32px 0;padding:20px 24px;background:#F5F5F5;border-left:3px solid #00B5A5;border-radius:0 4px 4px 0">
    <p style="font-size:13px;font-weight:700;color:#1A1A1A;margin:0 0 4px">Joe Kelley</p>
    <p style="font-size:13px;font-weight:300;color:#9B9B9B;margin:0">Your Office Space | Newcastle</p>
    <p style="font-size:13px;font-weight:300;color:#9B9B9B;margin:4px 0 0">
      <a href="mailto:jk@yourofficespace.au" style="color:#00B5A5;text-decoration:none">jk@yourofficespace.au</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;0434 655 511
    </p>
  </div>

  <p style="font-size:11px;color:#9B9B9B;font-weight:300;line-height:1.6;margin-top:24px">
    You&apos;re receiving this because you registered at yourofficespace.au/market-snapshot.
    Region: ${safeRegion}. To unsubscribe, reply with &apos;unsubscribe&apos;.
  </p>
</div>
          `,
        })
      } catch (emailErr) {
        console.warn('Resend confirmation email failed (non-fatal):', emailErr)
      }
    }

    // ── Internal notify to Joe ───────────────────────────────────────────
    try {
      const host = req.headers.get('host') || 'yourofficespace.au'
      const protocol = host.includes('localhost') ? 'http' : 'https'
      await fetch(`${protocol}://${host}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: safeName,
          email: safeEmail,
          source: 'Market Snapshot Registration',
          context: `Region: ${safeRegion}\n\nRegistered for the Newcastle Office Market Snapshot.`,
        }),
      })
    } catch {
      // non-fatal
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('market-snapshot-register error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
