import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { notifyLimiter, getIp } from '@/lib/ratelimit'

const TO = 'jk@yourofficespace.au'
const esc = (s: string) =>
  s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured')
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
  }
  const resend = new Resend(apiKey)

  // Rate limit check (non-fatal — if Redis not configured, skip silently)
  try {
    const limiter = notifyLimiter()
    if (limiter) {
      const { success } = await limiter.limit(getIp(req))
      if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  } catch (rlErr) {
    console.warn('Rate limiter skipped:', rlErr)
  }

  try {
    const body = await req.json()

    // Honeypot
    if (body._honey) return NextResponse.json({ ok: true })

    const { name, email, phone, source = 'Website', context = '' } = body

    if (!email && !phone) {
      return NextResponse.json({ error: 'Contact info required' }, { status: 400 })
    }

    // Sanitise
    const safeName    = name    ? esc(String(name).slice(0, 200))    : ''
    const safeEmail   = email   ? esc(String(email).slice(0, 200))   : ''
    const safePhone   = phone   ? esc(String(phone).slice(0, 50))    : ''
    const safeSource  = esc(String(source).slice(0, 200))
    const safeContext = context ? esc(String(context).slice(0, 2000)) : ''

    const color = source.includes('Exit') ? '#EF4444' : source.includes('Furniture') ? '#8B5CF6' : '#00B5A5'

    await resend.emails.send({
      from: 'YOS Website <notifications@yourofficespace.au>',
      to: TO,
      ...(safeEmail ? { replyTo: safeEmail } : {}),
      subject: `New lead — ${safeName || safeEmail || safePhone} via ${safeSource}`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <div style="background:#0A0A0A;padding:20px 24px;margin-bottom:24px">
          <p style="color:${color};font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 4px">${safeSource}</p>
          <p style="color:white;font-weight:700;font-size:18px;margin:0">New Lead${safeName ? ` — ${safeName}` : ''}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${safeName  ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:120px">Name</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;font-weight:600">${safeName}</td></tr>` : ''}
          ${safeEmail ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px"><a href="mailto:${safeEmail}" style="color:#00B5A5">${safeEmail}</a></td></tr>` : ''}
          ${safePhone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px"><a href="tel:${safePhone}" style="color:#00B5A5">${safePhone}</a></td></tr>` : ''}
          <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Source</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px">${safeSource}</td></tr>
        </table>
        ${safeContext ? `<div style="background:#f9f9f9;border-left:3px solid ${color};padding:16px 20px;margin-bottom:24px"><p style="color:#1A1A1A;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${safeContext}</p></div>` : ''}
        <a href="https://app-ap1.hubspot.com/contacts/442709765" style="display:inline-block;background:#00B5A5;color:white;font-weight:700;font-size:11px;letter-spacing:.15em;text-transform:uppercase;padding:12px 24px;text-decoration:none">View in HubSpot →</a>
        <p style="color:#aaa;font-size:11px;margin-top:24px">yourofficespace.au</p>
      </div>`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Notify failed:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
