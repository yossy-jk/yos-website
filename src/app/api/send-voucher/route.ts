import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { join } from 'path'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Load the email-safe voucher HTML at build/request time
function getVoucherHtml(): string {
  try {
    // In production on Vercel, public dir is served statically — embed the voucher inline
    const filePath = join(process.cwd(), 'src/app/api/send-voucher/voucher-template.html')
    return readFileSync(filePath, 'utf8')
  } catch {
    return VOUCHER_INLINE
  }
}

// Inline fallback — the complete voucher HTML embedded directly
const VOUCHER_INLINE = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YOS $100 Furniture Voucher</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#F5F5F5; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F5F5F5;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px; width:100%; border:1px solid #dddddd; box-shadow:0 4px 16px rgba(0,0,0,0.10);">
          <tr>
            <td width="220" valign="top" style="width:220px; background-color:#1A1A1A; padding:0; border-right:2px dashed #444444;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
                <tr>
                  <td style="padding:28px 28px 0 28px;">
                    <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:26px; font-weight:700; color:#FFFFFF; letter-spacing:3px; line-height:1;">YOS</p>
                    <p style="margin:3px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:9px; font-weight:700; color:#00B5A5; letter-spacing:1.5px; text-transform:uppercase;">Your Office Space</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 28px 0 28px;">
                    <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:72px; font-weight:700; color:#00B5A5; line-height:1; letter-spacing:-2px;">$100</p>
                    <p style="margin:8px 0 0 0; font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:700; color:#FFFFFF; letter-spacing:1.5px; text-transform:uppercase; line-height:1.4;">Off Your First<br>Furniture Order</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 28px 28px 28px;">
                    <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:9px; font-weight:700; color:#00B5A5; letter-spacing:2px; text-transform:uppercase;">Australia-Wide</p>
                  </td>
                </tr>
              </table>
            </td>
            <td valign="top" style="background-color:#FFFFFF; padding:28px 28px 0 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom:10px;">
                    <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:18px; font-weight:700; color:#1A1A1A; line-height:1.3;">Commercial furniture,<br><span style="color:#00B5A5;">done properly.</span></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:400; color:#555555; line-height:1.6;">Claim $100 off your first commercial furniture order with YOS. We deliver commercial furniture nationwide. Book a discovery session and we'll do the rest.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:18px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#E0F5F3; border:1.5px solid #E0F5F3; padding:10px 16px;">
                          <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:10px; font-weight:700; color:#00B5A5; letter-spacing:1px; text-transform:uppercase;">Mention this voucher when booking</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#00B5A5;">
                          <a href="https://meetings-ap1.hubspot.com/projects1" target="_blank" style="display:inline-block; font-family:Arial, Helvetica, sans-serif; font-size:13px; font-weight:700; color:#FFFFFF; text-decoration:none; padding:13px 20px; letter-spacing:0.5px;">Book a Discovery Session &#8594;</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #F0F0F0; padding-top:12px; padding-bottom:20px;">
                    <p style="margin:0 0 5px 0; font-family:Arial, Helvetica, sans-serif; font-size:10px; font-weight:400; color:#999999; line-height:1.5;">Valid 30 days. Min. order $1,000. New clients only. One per business. Redeemable on any YOS commercial furniture order through yourofficespace.au</p>
                    <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:10px; font-weight:700; color:#1A1A1A;">Joe Kelley &nbsp;&middot;&nbsp; 0434 655 511 &nbsp;&middot;&nbsp; yourofficespace.au</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const body = await req.json()
    if (body._honey) return NextResponse.json({ ok: true })

    const { email, name } = body

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const safeName = name ? esc(String(name).slice(0, 200)) : 'there'
    const safeEmail = email.slice(0, 200)

    const resend = new Resend(apiKey)

    // Wrap voucher in a personalised email shell
    const voucherHtml = getVoucherHtml()
    const emailHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:0;">
        <div style="padding:28px 0 20px 0;">
          <p style="margin:0 0 6px 0;font-size:15px;color:#1A1A1A;font-weight:600;">Hi${safeName !== 'there' ? ` ${safeName}` : ''},</p>
          <p style="margin:0 0 6px 0;font-size:14px;color:#555555;line-height:1.7;">Here's your $100 furniture voucher — valid for 30 days on any commercial furniture order through Your Office Space.</p>
          <p style="margin:0 0 20px 0;font-size:14px;color:#555555;line-height:1.7;">Just book a discovery session and mention the voucher when we speak.</p>
        </div>
        ${voucherHtml.replace(/^[\s\S]*<body[^>]*>/, '').replace(/<\/body>[\s\S]*$/, '')}
        <div style="padding:20px 0 0 0;">
          <p style="margin:0;font-size:13px;color:#9B9B9B;">Any questions — call 0434 655 511 or reply to this email.<br>Joe Kelley, Your Office Space</p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: 'Joe Kelley — Your Office Space <jk@yourofficespace.au>',
      to: safeEmail,
      replyTo: 'jk@yourofficespace.au',
      subject: 'Your $100 furniture voucher — Your Office Space',
      html: emailHtml,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('send-voucher crash:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
