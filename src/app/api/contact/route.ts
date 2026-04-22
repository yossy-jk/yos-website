import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactLimiter, getIp } from '@/lib/ratelimit'

const TO = 'jk@yourofficespace.au'
const esc = (s: string) =>
  s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'RESEND_API_KEY missing' }, { status: 503 })
    }
    const resend = new Resend(apiKey)

    // Rate limit check
    try {
      const limiter = contactLimiter()
      if (limiter) {
        const { success } = await limiter.limit(getIp(req))
        if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    } catch (rl) {
      // Rate limiter failure is non-fatal — continue
      console.warn('Rate limiter error:', rl)
    }

    const body = await req.json()

    // Honeypot check
    if (body._honey) {
      return NextResponse.json({ ok: true })
    }

    const { name, company, email, phone, message, source = 'Contact Form' } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (message && message.length > 3000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 })
    }

    const safeName    = esc(String(name).slice(0, 200))
    const safeCompany = company ? esc(String(company).slice(0, 200)) : ''
    const safeEmail   = esc(String(email).slice(0, 200))
    const safePhone   = phone ? esc(String(phone).slice(0, 50)) : ''
    const safeMessage = message ? esc(String(message).slice(0, 3000)) : ''
    const safeSource  = esc(String(source).slice(0, 200))

    const result = await resend.emails.send({
      from: 'YOS Website <notifications@yourofficespace.au>',
      to: TO,
      replyTo: safeEmail,
      subject: `New enquiry — ${safeName}${safeCompany ? ` (${safeCompany})` : ''} via ${safeSource}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #0A0A0A; padding: 20px 24px; margin-bottom: 24px;">
            <p style="color: #00B5A5; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 4px;">Your Office Space</p>
            <p style="color: white; font-weight: 700; font-size: 18px; margin: 0;">New Enquiry — ${safeSource}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px; width: 120px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; font-weight: 600;">${safeName}</td></tr>
            ${safeCompany ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Company</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${safeCompany}</td></tr>` : ''}
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #00B5A5;">${safeEmail}</a></td></tr>
            ${safePhone ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;"><a href="tel:${safePhone}" style="color: #00B5A5;">${safePhone}</a></td></tr>` : ''}
          </table>
          ${safeMessage ? `<div style="background: #f9f9f9; border-left: 3px solid #00B5A5; padding: 16px 20px; margin-bottom: 24px;"><p style="color: #555; font-size: 13px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p><p style="color: #1A1A1A; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${safeMessage}</p></div>` : ''}
          <a href="https://app-ap1.hubspot.com/contacts/442709765" style="display: inline-block; background: #00B5A5; color: white; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 24px; text-decoration: none;">View in HubSpot →</a>
          <p style="color: #aaa; font-size: 11px; margin-top: 24px;">Sent from yourofficespace.au</p>
        </div>
      `,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return NextResponse.json({ error: 'Email send failed', detail: result.error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Contact route crash:', msg)
    return NextResponse.json({ error: 'Internal error', detail: msg }, { status: 500 })
  }
}
