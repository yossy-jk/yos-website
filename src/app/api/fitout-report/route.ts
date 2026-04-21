import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const TEAL = '#00B5A5'
const DARK = '#0A0A0A'

function fmt(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n)
}

function generateReportHtml(data: {
  name: string
  email: string
  sqm: string
  tier: string
  desks: string
  meetingRooms: string
  hasKitchen: boolean
  hasReception: boolean
  hasAV: boolean
  totalLow: number
  totalHigh: number
  perSqmLow: number
  perSqmHigh: number
  breakdown: { label: string; low: number; high: number }[]
  date: string
}) {
  const breakdownRows = data.breakdown.map(row => `
    <tr style="border-bottom: 1px solid #E5E7EB;">
      <td style="padding: 14px 20px; font-size: 14px; color: ${row.label.includes('Contingency') ? '#9CA3AF' : '#374151'}; font-style: ${row.label.includes('Contingency') ? 'italic' : 'normal'};">${row.label}</td>
      <td style="padding: 14px 20px; font-size: 14px; font-weight: 600; color: ${row.label.includes('Contingency') ? '#9CA3AF' : '#111827'}; text-align: right;">${fmt(row.low)} – ${fmt(row.high)}</td>
    </tr>
  `).join('')

  const inclusions = [
    data.hasKitchen ? '✓ Kitchen / breakout area' : null,
    data.hasReception ? '✓ Reception area' : null,
    data.hasAV ? '✓ AV & integrated technology' : null,
  ].filter(Boolean)

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Fitout Cost Estimate — Your Office Space</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F9FAFB; }
</style>
</head>
<body>
<div style="max-width: 680px; margin: 0 auto; background: white;">

  <!-- Header -->
  <div style="background: ${DARK}; padding: 40px 48px 36px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <p style="color: ${TEAL}; font-size: 10px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 8px;">YOUR OFFICE SPACE</p>
        <h1 style="color: white; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 4px;">Fitout Cost<br/>Estimate</h1>
        <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 10px;">Prepared for ${data.name} · ${data.date}</p>
      </div>
      <div style="text-align: right;">
        <div style="background: ${TEAL}; padding: 6px 14px; display: inline-block; margin-bottom: 8px;">
          <p style="color: white; font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">ESTIMATE RANGE</p>
        </div>
        <p style="color: white; font-size: 26px; font-weight: 900; line-height: 1;">${fmt(data.totalLow)}</p>
        <p style="color: ${TEAL}; font-size: 14px; font-weight: 700; margin: 2px 0;">to ${fmt(data.totalHigh)}</p>
        <p style="color: rgba(255,255,255,0.35); font-size: 10px;">ex GST · incl. 10% contingency</p>
      </div>
    </div>
  </div>

  <!-- Scope summary -->
  <div style="background: #F9FAFB; border-bottom: 1px solid #E5E7EB; padding: 24px 48px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 24px;">
      <div>
        <p style="font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 4px;">AREA</p>
        <p style="font-size: 18px; font-weight: 900; color: ${DARK};">${data.sqm}m²</p>
      </div>
      <div>
        <p style="font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 4px;">QUALITY</p>
        <p style="font-size: 18px; font-weight: 900; color: ${DARK};">${data.tier}</p>
      </div>
      <div>
        <p style="font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 4px;">WORKSTATIONS</p>
        <p style="font-size: 18px; font-weight: 900; color: ${DARK};">${data.desks}</p>
      </div>
      <div>
        <p style="font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 4px;">MEETING ROOMS</p>
        <p style="font-size: 18px; font-weight: 900; color: ${DARK};">${data.meetingRooms}</p>
      </div>
    </div>
    ${inclusions.length > 0 ? `
    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E7EB;">
      <p style="font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 8px;">ADDITIONAL INCLUSIONS</p>
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        ${inclusions.map(i => `<span style="font-size: 12px; color: #374151; font-weight: 600;">${i}</span>`).join('')}
      </div>
    </div>
    ` : ''}
  </div>

  <!-- Cost breakdown -->
  <div style="padding: 32px 48px;">
    <h2 style="font-size: 13px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 16px;">Cost Breakdown</h2>
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
      ${breakdownRows}
      <tr style="background: ${DARK};">
        <td style="padding: 16px 20px; font-size: 14px; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 0.05em;">Total Estimate</td>
        <td style="padding: 16px 20px; font-size: 15px; font-weight: 900; color: ${TEAL}; text-align: right;">${fmt(data.totalLow)} – ${fmt(data.totalHigh)}</td>
      </tr>
    </table>
    <p style="font-size: 11px; color: #9CA3AF; margin-top: 12px; line-height: 1.6;">
      ${fmt(data.perSqmLow)} – ${fmt(data.perSqmHigh)} per m² · Rates based on NSW/Hunter Region market benchmarks, April 2026. All figures ex GST. Contingency of 10% included.
    </p>
  </div>

  <!-- Rate context -->
  <div style="margin: 0 48px 32px; background: #F0FDFB; border: 1px solid ${TEAL}25; border-radius: 8px; padding: 24px;">
    <h3 style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${TEAL}; margin-bottom: 12px;">What drives your per m² rate?</h3>
    <p style="font-size: 13px; color: #374151; line-height: 1.75;">
      The per m² rate for a commercial fitout in NSW typically ranges from $800 to $3,500+ depending on specification level, site complexity, and builder selection. Your estimate reflects a <strong>${data.tier.toLowerCase()}</strong> specification. A site inspection, detailed brief, and builder tender process will sharpen this number significantly.
    </p>
  </div>

  <!-- Next steps -->
  <div style="margin: 0 48px 40px; border-left: 3px solid ${TEAL}; padding-left: 20px;">
    <h3 style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9CA3AF; margin-bottom: 12px;">Recommended next steps</h3>
    <ol style="font-size: 13px; color: #374151; line-height: 2; padding-left: 16px;">
      <li>Book a no-obligation Clarity Call with the YOS team to review your brief</li>
      <li>Site inspection — we assess your existing fit, services, access and constraints</li>
      <li>Detailed brief + design concept aligned to your budget</li>
      <li>Builder selection and project delivery under YOS management</li>
    </ol>
  </div>

  <!-- CTA -->
  <div style="margin: 0 48px 48px; background: ${DARK}; border-radius: 8px; padding: 32px; text-align: center;">
    <p style="color: ${TEAL}; font-size: 10px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 8px;">FREE — NO OBLIGATION</p>
    <h3 style="color: white; font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 12px;">Book your Clarity Call</h3>
    <p style="color: rgba(255,255,255,0.5); font-size: 13px; line-height: 1.7; margin-bottom: 24px; max-width: 380px; margin-left: auto; margin-right: auto;">
      30 minutes. We'll look at your brief, your budget and your timeline — and tell you exactly what we'd do.
    </p>
    <a href="https://yourofficespace.au/contact" style="display: inline-block; background: ${TEAL}; color: white; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 36px; text-decoration: none; border-radius: 6px;">
      Get in Touch →
    </a>
  </div>

  <!-- Footer -->
  <div style="background: #F9FAFB; border-top: 1px solid #E5E7EB; padding: 24px 48px; text-align: center;">
    <p style="font-size: 11px; color: #9CA3AF; line-height: 1.8;">
      <strong style="color: #374151;">Your Office Space</strong> · yourofficespace.au · jk@yourofficespace.au<br/>
      This estimate is indicative only. Actual costs will vary based on site conditions, specification detail, builder selection, and market conditions at time of tender. Not a quote.
    </p>
  </div>

</div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, email, sqm, tier, desks, meetingRooms,
      hasKitchen, hasReception, hasAV,
      totalLow, totalHigh, perSqmLow, perSqmHigh, breakdown
    } = body

    if (!email || !name || !totalLow) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const date = new Date().toLocaleDateString('en-AU', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney'
    })

    const html = generateReportHtml({
      name, email, sqm, tier, desks, meetingRooms,
      hasKitchen, hasReception, hasAV,
      totalLow, totalHigh, perSqmLow, perSqmHigh, breakdown, date
    })

    // Send report to client
    const clientSend = resend.emails.send({
      from: 'Your Office Space <notifications@yourofficespace.au>',
      to: email,
      subject: `Your Fitout Cost Estimate — ${fmt(totalLow)} to ${fmt(totalHigh)}`,
      html,
    })

    // Notify Joe
    const joeSend = resend.emails.send({
      from: 'YOS Website <notifications@yourofficespace.au>',
      to: 'jk@yourofficespace.au',
      subject: `🏢 New Fitout Estimate — ${name} (${sqm}m², ${tier})`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="background: #0A0A0A; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
            <p style="color: #00B5A5; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px;">NEW FITOUT LEAD</p>
            <p style="color: white; font-size: 24px; font-weight: 900; margin: 0;">${name}</p>
            <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 4px;">${email}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 13px;">Area</td><td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; font-weight: 700; font-size: 13px; text-align: right;">${sqm}m²</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 13px;">Quality</td><td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; font-weight: 700; font-size: 13px; text-align: right;">${tier}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 13px;">Workstations</td><td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; font-weight: 700; font-size: 13px; text-align: right;">${desks}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #6B7280; font-size: 13px;">Estimate range</td><td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; font-weight: 900; font-size: 14px; text-align: right; color: #00B5A5;">${fmt(totalLow)} – ${fmt(totalHigh)}</td></tr>
          </table>
          <p style="color: #9CA3AF; font-size: 12px;">Branded report sent to client automatically. Follow up within 24hrs.</p>
        </div>
      `,
    })

    await Promise.allSettled([clientSend, joeSend])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('fitout-report error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
