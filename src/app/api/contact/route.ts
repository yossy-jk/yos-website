import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const TO = 'jk@yourofficespace.au'

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const body = await req.json()
    const { name, company, email, phone, message, source = 'Contact Form' } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'YOS Website <notifications@yourofficespace.au>',
      to: TO,
      replyTo: email,
      subject: `New enquiry — ${name}${company ? ` (${company})` : ''} via ${source}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #0A0A0A; padding: 20px 24px; margin-bottom: 24px;">
            <p style="color: #00B5A5; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 4px;">Your Office Space</p>
            <p style="color: white; font-weight: 700; font-size: 18px; margin: 0;">New Enquiry — ${source}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px; width: 120px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; font-weight: 600;">${name}</td></tr>
            ${company ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Company</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${company}</td></tr>` : ''}
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;"><a href="mailto:${email}" style="color: #00B5A5;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;"><a href="tel:${phone}" style="color: #00B5A5;">${phone}</a></td></tr>` : ''}
          </table>
          ${message ? `<div style="background: #f9f9f9; border-left: 3px solid #00B5A5; padding: 16px 20px; margin-bottom: 24px;"><p style="color: #555; font-size: 13px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p><p style="color: #1A1A1A; font-size: 15px; line-height: 1.7; margin: 0;">${message}</p></div>` : ''}
          <a href="https://app-ap1.hubspot.com/contacts/442709765" style="display: inline-block; background: #00B5A5; color: white; font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 24px; text-decoration: none;">View in HubSpot →</a>
          <p style="color: #aaa; font-size: 11px; margin-top: 24px;">Sent from yourofficespace.au</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Email send failed:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
