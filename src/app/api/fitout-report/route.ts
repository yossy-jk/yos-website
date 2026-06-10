import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { HUBSPOT } from '@/lib/constants'

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL  || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

async function redisSet(key: string, value: string): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return
  await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  })
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

function buildEmailHtml(data: {
  name: string; email: string; phone?: string
  fitoutType: string; sqm: string; tier: string; shellCondition: string
  workstationType: string; desks: string; meetingRooms: string
  hasKitchen: boolean; hasReception: boolean; hasAV: boolean
  totalLow: number; totalHigh: number; perSqmLow: number; perSqmHigh: number
  breakdown: { label: string; low: number; high: number }[]
  coverageNote?: string
}): string {
  const tierLabel = { basic: 'Basic', mid: 'Mid-Range', premium: 'Premium' }[data.tier as string] || data.tier
  const typeLabel = data.fitoutType === 'furniture-only' ? 'Furniture Only' : 'Full Fitout'
  const shellLabel = data.fitoutType === 'furniture-only' ? '' : ` — ${data.shellCondition === 'cold' ? 'Cold Shell' : 'Warm Shell'}`
  const wkstLabel = data.workstationType === 'eha' ? 'Height-adjustable (EHA)' : 'Fixed workstation'
  const rows = data.breakdown.map(r =>
    `<tr><td style="padding:0.75rem 1rem;font-size:0.85rem;color:#ffffffb3;border-bottom:1px solid #ffffff14">${r.label}</td><td style="padding:0.75rem 1rem;font-size:0.85rem;font-weight:600;color:#ffffff;text-align:right;border-bottom:1px solid #ffffff14">${fmt(r.low)} – ${fmt(r.high)}</td></tr>`
  ).join('')

  return `<!DOCTYPE html>
<html lang="en-AU">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your Fitout Estimate | Your Office Space</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:2rem 1rem">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
<tr><td style="padding-bottom:1.5rem;border-bottom:1px solid #00B5A533">
<p style="margin:0 0 0.25rem;font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:#00B5A5;font-weight:700">Your Office Space</p>
<h1 style="margin:0;font-size:1.5rem;font-weight:900;color:#ffffff;letter-spacing:-0.02em">Your Fitout Cost Estimate</h1>
<p style="margin:0.5rem 0 0;font-size:0.8rem;color:#ffffff60">${data.sqm}m2 · ${tierLabel}${shellLabel}</p>
</td></tr>
<tr><td style="padding:2rem 0 1rem">
<div style="background:rgba(0,181,165,0.1);border:1px solid #00B5A533;border-radius:0.75rem;padding:1.5rem;text-align:center">
<p style="margin:0 0 0.25rem;font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:#00B5A5;font-weight:700">Estimated Cost Range (ex GST)</p>
<p style="margin:0;font-size:2.5rem;font-weight:900;color:#ffffff;letter-spacing:-0.03em;line-height:1">${fmt(data.totalLow)} – ${fmt(data.totalHigh)}</p>
<p style="margin:0.5rem 0 0;font-size:0.75rem;color:#ffffff60">${fmt(data.perSqmLow)} – ${fmt(data.perSqmHigh)} per m² · Ex GST · Incl. contingency</p>
</div>
</td></tr>
<tr><td style="padding:0 0 1.5rem">
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ffffff14;border-radius:0.5rem;overflow:hidden">
${rows}
<tr style="background:rgba(0,181,165,0.08)">
<td style="padding:1rem;font-size:0.85rem;font-weight:700;color:#00B5A5">Estimated Total (ex GST)</td>
<td style="padding:1rem;font-size:0.85rem;font-weight:700;color:#00B5A5;text-align:right">${fmt(data.totalLow)} – ${fmt(data.totalHigh)}</td>
</tr>
</table>
</td></tr>
${data.coverageNote ? `<tr><td style="padding:0 0 1.5rem"><p style="margin:0;font-size:0.75rem;color:#ffffff50;font-style:italic;line-height:1.6">${data.coverageNote}</p></td></tr>` : ''}
<tr><td style="padding:0 0 1.5rem">
<p style="margin:0 0 1rem;font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;color:#ffffff50;font-weight:700">Your inputs</p>
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff60;border-bottom:1px solid #ffffff10;width:45%">Project type</td><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff;font-weight:500;border-bottom:1px solid #ffffff10">${typeLabel}</td></tr>
<tr><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff60;border-bottom:1px solid #ffffff10">Floor area</td><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff;font-weight:500;border-bottom:1px solid #ffffff10">${data.sqm}m²</td></tr>
<tr><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff60;border-bottom:1px solid #ffffff10">Quality level</td><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff;font-weight:500;border-bottom:1px solid #ffffff10">${tierLabel}</td></tr>
<tr><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff60;border-bottom:1px solid #ffffff10">Workstation type</td><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff;font-weight:500;border-bottom:1px solid #ffffff10">${wkstLabel}</td></tr>
<tr><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff60;border-bottom:1px solid #ffffff10">Workstations</td><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff;font-weight:500;border-bottom:1px solid #ffffff10">${data.desks}</td></tr>
<tr><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff60;border-bottom:1px solid #ffffff10">Meeting rooms</td><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff;font-weight:500;border-bottom:1px solid #ffffff10">${data.meetingRooms}</td></tr>
${data.fitoutType !== 'furniture-only' ? `<tr><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff60;border-bottom:1px solid #ffffff10">Kitchen / breakout</td><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff;font-weight:500;border-bottom:1px solid #ffffff10">${data.hasKitchen ? 'Yes' : 'No'}</td></tr><tr><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff60;border-bottom:1px solid #ffffff10">Reception area</td><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff;font-weight:500;border-bottom:1px solid #ffffff10">${data.hasReception ? 'Yes' : 'No'}</td></tr><tr><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff60;border-bottom:1px solid #ffffff10">AV & technology</td><td style="padding:0.5rem 0;font-size:0.8rem;color:#ffffff;font-weight:500;border-bottom:1px solid #ffffff10">${data.hasAV ? 'Yes' : 'No'}</td></tr>` : ''}
</table>
</td></tr>
<tr><td style="padding:0 0 1.5rem">
<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:0.75rem;padding:1.5rem;text-align:center">
<p style="margin:0 0 0.5rem;font-size:1rem;font-weight:700;color:#ffffff">Ready to get an accurate quote?</p>
<p style="margin:0 0 1.25rem;font-size:0.8rem;color:#ffffff60;line-height:1.6">A site visit and detailed brief will refine this estimate significantly. We'll walk through your space and give you a fixed-price proposal — no obligation.</p>
<a href="${HUBSPOT.bookingUrl}" style="display:inline-block;background:#00B5A5;color:#ffffff;font-weight:700;font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;padding:1rem 2.5rem;border-radius:0.5rem">Book a Free Consultation →</a>
</div>
</td></tr>
<tr><td style="padding:0;border-top:1px solid #ffffff14;text-align:center">
<p style="margin:0.75rem 0;font-size:0.7rem;color:#ffffff30">Your Office Space · Newcastle NSW · hello@yourofficespace.au · 0434 655 511<br/>This estimate is based on market rates and is indicative only. A site visit is required for a fixed price.</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string; email: string; phone?: string
      fitoutType: string; sqm: string; tier: string; shellCondition: string
      workstationType: string; desks: string; meetingRooms: string
      hasKitchen: boolean; hasReception: boolean; hasAV: boolean
      totalLow: number; totalHigh: number; perSqmLow: number; perSqmHigh: number
      breakdown: { label: string; low: number; high: number }[]
      coverageNote?: string
      source?: string
    }

    if (!body.email || !body.name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // 1. Send branded email to customer
    const emailHtml = buildEmailHtml(body)
    const emailPayload = {
      to: [{ email: body.email, name: body.name }],
      subject: `Your Fitout Estimate — ${body.sqm}m² ${body.tier} · Your Office Space`,
      html: emailHtml,
      from: { name: 'Your Office Space', email: 'hello@yourofficespace.au' },
      replyTo: { name: 'Your Office Space', email: 'jk@yourofficespace.au' },
    }

    // Use Upstash as a queue — Inbox EA picks it up and sends via Resend
    await redisSet('yos:email:outbound', JSON.stringify({
      type: 'fitout-report',
      payload: emailPayload,
      createdAt: new Date().toISOString(),
    }))

    // 2. Notify Joe
    await redisSet('yos:email:outbound', JSON.stringify({
      type: 'fitout-report-notification',
      payload: {
        to: [{ email: 'jk@yourofficespace.au', name: 'Joe Kelley' }],
        subject: `New fitout estimate lead — ${body.name} (${body.email})`,
        html: `<p>New fitout estimate submitted.</p><p><strong>${body.name}</strong> · ${body.email}${body.phone ? ` · ${body.phone}` : ''}</p><p>${body.sqm}m² · ${body.tier} · ${body.fitoutType === 'furniture-only' ? 'Furniture only' : 'Full fitout' + (body.shellCondition === 'cold' ? ' (cold shell)' : ' (warm shell)')}</p><p>Estimate: $${body.totalLow.toLocaleString()}–$${body.totalHigh.toLocaleString()} ex GST</p><p><a href="${HUBSPOT.bookingUrl}">Book follow-up call</a></p>`,
        from: { name: 'Your Office Space', email: 'noreply@yourofficespace.au' },
        replyTo: { name: 'Your Office Space', email: 'jk@yourofficespace.au' },
      },
      createdAt: new Date().toISOString(),
    }))

    // 3. Queue HubSpot deal creation (Inbox EA picks this up)
    await redisSet('yos:hubspot:actions', JSON.stringify({
      action: 'create-deal',
      data: {
        title: `Fitout Estimate — ${body.name}`,
        email: body.email,
        phone: body.phone || '',
        company: '',
        pipeline: 'furniture',
        stage: 'New Enquiry',
        amount: Math.round((body.totalLow + body.totalHigh) / 2),
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: [
          `Fitout type: ${body.fitoutType}`,
          `Size: ${body.sqm}m²`,
          `Tier: ${body.tier}`,
          body.fitoutType !== 'furniture-only' ? `Shell: ${body.shellCondition}` : null,
          `Workstation type: ${body.workstationType}`,
          `Desks: ${body.desks}, Meeting rooms: ${body.meetingRooms}`,
          `Kitchen: ${body.hasKitchen ? 'Yes' : 'No'}`,
          `Reception: ${body.hasReception ? 'Yes' : 'No'}`,
          `AV: ${body.hasAV ? 'Yes' : 'No'}`,
          `Source: fitout-estimator`,
        ].filter(Boolean).join('\n'),
        source: 'fitout-estimator',
      },
      createdAt: new Date().toISOString(),
    }))

    return NextResponse.json({ ok: true, message: 'Estimate sent and deal queued' })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
