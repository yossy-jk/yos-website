import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { HUBSPOT } from '@/lib/constants'
import { calculateFitoutEstimate, type FitoutInputs, type FitoutTier } from '@/lib/fitout-estimate'
import { fitoutLimiter, getIp } from '@/lib/ratelimit'

export const runtime = 'nodejs'

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL  || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

async function redisSet(key: string, value: string): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false
  const response = await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  })
  return response.ok
}

type ReportData = FitoutInputs & {
  name: string
  email: string
  phone?: string
  tier: FitoutTier
  totalLow: number
  totalHigh: number
  perSqmLow: number
  perSqmHigh: number
  breakdown: { label: string; low: number; high: number }[]
  coverageNote?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

function parseReportRequest(raw: unknown): { data?: Omit<ReportData, 'totalLow' | 'totalHigh' | 'perSqmLow' | 'perSqmHigh' | 'breakdown' | 'coverageNote'>; error?: string; honeypot?: boolean } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { error: 'Invalid request body' }
  const body = raw as Record<string, unknown>
  if (body._honey) return { honeypot: true }

  const name = typeof body.name === 'string' ? body.name.trim().replace(/[\r\n]+/g, ' ') : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim().replace(/[\r\n]+/g, ' ') : ''
  if (name.length < 2 || name.length > 100) return { error: 'Please enter your name' }
  if (email.length > 200 || !EMAIL_RE.test(email)) return { error: 'Please enter a valid email address' }
  if (phone.length > 50) return { error: 'Phone number is too long' }

  const fitoutType = body.fitoutType
  const tier = body.tier
  const shellCondition = body.shellCondition
  const workstationType = body.workstationType
  if (fitoutType !== 'furniture-only' && fitoutType !== 'turnkey') return { error: 'Invalid fitout type' }
  if (tier !== 'basic' && tier !== 'mid' && tier !== 'premium') return { error: 'Invalid quality tier' }
  if (shellCondition !== 'cold' && shellCondition !== 'warm') return { error: 'Invalid shell condition' }
  if (workstationType !== 'fixed' && workstationType !== 'eha') return { error: 'Invalid workstation type' }

  const sqm = Number(body.sqm)
  const desks = Number(body.desks)
  const meetingRooms = Number(body.meetingRooms)
  if (!Number.isFinite(sqm) || sqm < 5 || sqm > 100000) return { error: 'Floor area must be between 5 and 100,000 m²' }
  if (!Number.isInteger(desks) || desks < 1 || desks > 5000) return { error: 'Workstations must be between 1 and 5,000' }
  if (!Number.isInteger(meetingRooms) || meetingRooms < 0 || meetingRooms > 200) return { error: 'Meeting rooms must be between 0 and 200' }

  for (const field of ['hasKitchen', 'hasReception', 'hasAV'] as const) {
    if (typeof body[field] !== 'boolean') return { error: `Invalid ${field} value` }
  }

  return {
    data: {
      name,
      email,
      ...(phone ? { phone } : {}),
      fitoutType,
      sqm: String(sqm),
      shellCondition,
      tier,
      workstationType,
      desks: String(desks),
      meetingRooms: String(meetingRooms),
      hasKitchen: body.hasKitchen as boolean,
      hasReception: body.hasReception as boolean,
      hasAV: body.hasAV as boolean,
      buildingType: '',
      timeframe: '',
    },
  }
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

function buildEmailHtml(data: ReportData): string {
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
    const limiter = fitoutLimiter()
    if (limiter) {
      const { success } = await limiter.limit(getIp(req))
      if (!success) return NextResponse.json({ error: 'Too many report requests. Please try again in 10 minutes.' }, { status: 429 })
    }
  } catch (error) {
    console.warn('[fitout-report] Rate limiter unavailable:', error)
  }

  try {
    const parsed = parseReportRequest(await req.json())
    if (parsed.honeypot) return NextResponse.json({ ok: true })
    if (!parsed.data) return NextResponse.json({ error: parsed.error || 'Invalid request' }, { status: 400 })

    const estimate = calculateFitoutEstimate(parsed.data)
    if (!estimate) return NextResponse.json({ error: 'Unable to calculate this estimate' }, { status: 400 })

    const data: ReportData = {
      ...parsed.data,
      totalLow: estimate.totalLow,
      totalHigh: estimate.totalHigh,
      perSqmLow: estimate.perSqm.low,
      perSqmHigh: estimate.perSqm.high,
      breakdown: estimate.breakdown,
      coverageNote: estimate.coverageNote,
    }
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Report delivery is temporarily unavailable' }, { status: 503 })

    const resend = new Resend(apiKey)
    const reportResult = await resend.emails.send({
      from: 'Your Office Space <notifications@yourofficespace.au>',
      to: data.email,
      replyTo: 'jk@yourofficespace.au',
      subject: `Your Fitout Estimate — ${data.sqm}m² ${data.tier} · Your Office Space`,
      html: buildEmailHtml(data),
    })
    if (reportResult.error) {
      console.error('[fitout-report] Customer email failed:', reportResult.error)
      return NextResponse.json({ error: 'We could not send the report. Please try again shortly.' }, { status: 502 })
    }

    const safeName = escapeHtml(data.name)
    const safeEmail = escapeHtml(data.email)
    const safePhone = data.phone ? escapeHtml(data.phone) : ''

    // Customer delivery is the success contract. Internal notification and CRM
    // enrichment are attempted separately so a secondary outage cannot cause a
    // duplicate customer email on retry.
    const notification = resend.emails.send({
      from: 'YOS Website <notifications@yourofficespace.au>',
      to: 'jk@yourofficespace.au',
      replyTo: data.email,
      subject: `New fitout estimate lead — ${data.name} (${data.email})`,
      html: `<p>New fitout estimate submitted.</p><p><strong>${safeName}</strong> · ${safeEmail}${safePhone ? ` · ${safePhone}` : ''}</p><p>${data.sqm}m² · ${data.tier} · ${data.fitoutType === 'furniture-only' ? 'Furniture only' : `Full fitout (${data.shellCondition} shell)`}</p><p>Estimate: ${fmt(data.totalLow)}–${fmt(data.totalHigh)} ex GST</p><p><a href="${HUBSPOT.bookingUrl}">Book follow-up call</a></p>`,
    })

    const crmQueue = redisSet('yos:hubspot:actions', JSON.stringify({
      action: 'create-deal',
      data: {
        title: `Fitout Estimate — ${data.name}`,
        email: data.email,
        phone: data.phone || '',
        company: '',
        pipeline: 'furniture',
        stage: 'New Enquiry',
        amount: Math.round((data.totalLow + data.totalHigh) / 2),
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: [
          `Fitout type: ${data.fitoutType}`,
          `Size: ${data.sqm}m²`,
          `Tier: ${data.tier}`,
          data.fitoutType !== 'furniture-only' ? `Shell: ${data.shellCondition}` : null,
          `Workstation type: ${data.workstationType}`,
          `Desks: ${data.desks}, Meeting rooms: ${data.meetingRooms}`,
          `Kitchen: ${data.hasKitchen ? 'Yes' : 'No'}`,
          `Reception: ${data.hasReception ? 'Yes' : 'No'}`,
          `AV: ${data.hasAV ? 'Yes' : 'No'}`,
          `Source: fitout-estimator`,
        ].filter(Boolean).join('\n'),
        source: 'fitout-estimator',
      },
      createdAt: new Date().toISOString(),
    }))

    const [notificationResult, crmResult] = await Promise.allSettled([notification, crmQueue])
    if (notificationResult.status === 'rejected' || (notificationResult.status === 'fulfilled' && notificationResult.value.error)) {
      console.error('[fitout-report] Internal notification failed')
    }
    if (crmResult.status === 'rejected' || (crmResult.status === 'fulfilled' && !crmResult.value)) {
      console.warn('[fitout-report] CRM queue unavailable')
    }

    return NextResponse.json({ ok: true, message: 'Your report has been emailed. Check your inbox.' })
  } catch (error: unknown) {
    console.error('[fitout-report] Request failed:', error)
    return NextResponse.json({ error: 'We could not send the report. Please try again shortly.' }, { status: 500 })
  }
}
