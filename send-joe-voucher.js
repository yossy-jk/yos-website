const { Resend } = require('resend')
const { readFileSync } = require('fs')
const { join } = require('path')

const resend = new Resend('re_FcyFNcBS_Du7HCnNxiBGCdGtufVHZhjfH')

const voucherHtml = readFileSync(join(__dirname, '../voucher/furniture-voucher-email.html'), 'utf8')
const voucherBody = voucherHtml.replace(/^[\s\S]*<body[^>]*>/, '').replace(/<\/body>[\s\S]*$/, '')

const emailHtml = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:0;">
  <div style="padding:28px 0 20px 0;">
    <p style="margin:0 0 6px 0;font-size:15px;color:#1A1A1A;font-weight:600;">Hi Joe,</p>
    <p style="margin:0 0 6px 0;font-size:14px;color:#555555;line-height:1.7;">Here is your $100 furniture voucher. This is what a lead receives when they submit the popup form on the website.</p>
    <p style="margin:0 0 20px 0;font-size:14px;color:#555555;line-height:1.7;">Valid 30 days. Book a discovery session and mention the voucher.</p>
  </div>
  ${voucherBody}
  <div style="padding:20px 0 0 0;">
    <p style="margin:0;font-size:13px;color:#9B9B9B;">Any questions - call 0434 655 511 or reply to this email.<br>Joe Kelley, Your Office Space</p>
  </div>
</div>
`

resend.emails.send({
  from: 'Joe Kelley - Your Office Space <jk@yourofficespace.au>',
  to: 'jk@yourofficespace.au',
  replyTo: 'jk@yourofficespace.au',
  subject: 'Your $100 furniture voucher - Your Office Space',
  html: emailHtml,
}).then(result => {
  if (result.error) {
    console.error('Error:', JSON.stringify(result.error))
    process.exit(1)
  }
  console.log('Sent OK. ID:', result.data && result.data.id)
}).catch(err => {
  console.error('Crash:', err.message)
  process.exit(1)
})
