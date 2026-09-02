#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Resend } from 'resend'

const sendRequested = process.argv.includes('--send')
const required = [
  'RESEND_API_KEY',
  'YOS_VOUCHER_FROM',
  'YOS_VOUCHER_RECIPIENT',
  'YOS_VOUCHER_HTML_PATH',
  'YOS_EXTERNAL_EMAIL_APPROVAL_ID',
]
const missing = required.filter((name) => !process.env[name])

if (!sendRequested) {
  console.log('DRY RUN: no email sent. Pass --send only with a recorded approval id and required environment variables.')
  process.exit(0)
}

if (missing.length > 0) {
  console.error(`DENIED: missing required configuration: ${missing.join(', ')}`)
  process.exit(64)
}

const html = await readFile(resolve(process.env.YOS_VOUCHER_HTML_PATH), 'utf8')
const resend = new Resend(process.env.RESEND_API_KEY)
const result = await resend.emails.send({
  from: process.env.YOS_VOUCHER_FROM,
  to: process.env.YOS_VOUCHER_RECIPIENT,
  subject: 'Your furniture voucher - Your Office Space',
  html,
  headers: {
    'X-YOS-Approval-Id': process.env.YOS_EXTERNAL_EMAIL_APPROVAL_ID,
  },
})

if (result.error) {
  console.error('Voucher email failed; provider detail withheld from logs.')
  process.exit(1)
}

console.log(`Voucher email accepted under approval ${process.env.YOS_EXTERNAL_EMAIL_APPROVAL_ID}.`)
