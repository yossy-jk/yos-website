/**
 * POST /api/auth-v2/send-code
 * Body: { email: string }
 * Sends a 6-digit verification code to the user's email.
 * Rate limited: 5 codes per 15 minutes per IP.
 * Suspicious access (unrecognised email + rate limit) triggers a security alert to Joe.
 */
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { redisGet, redisSet, redisDel, redisIncr } from '@/lib/auth-v2'

export const runtime = 'nodejs'

const CODE_TTL_SEC    = 300  // 5 minutes — code validity window
const SEND_LIMIT      = 5   // max codes per window
const SEND_WINDOW_SEC = 900 // 15 minutes — rate limit window

// Whitelist — only these emails can receive codes
const ALLOWED_EMAILS = ['jk@yourofficespace.au']
// Security: alert recipient for suspicious access
const SECURITY_ALERT_EMAIL = 'jk@yourofficespace.au'

function getIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

async function getSendCount(ip: string): Promise<number> {
  const key = `2fa:send:ip:${ip}`
  const raw = await redisGet(key)
  if (!raw) return 0
  if (typeof raw === 'string') {
    try { return parseInt(raw, 10) } catch { /* fall through */ }
    try { return parseInt(JSON.parse(raw) as string, 10) } catch { return 0 }
  }
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>
    if (typeof obj.attempts === 'number') return obj.attempts
  }
  return 0
}

async function incrementSendCount(ip: string): Promise<number> {
  const key = `2fa:send:ip:${ip}`
  const count = await redisIncr(key)
  if (count === 1) await redisSet(key, '1', SEND_WINDOW_SEC)
  return count
}

async function sendAlertEmail(ip: string, email: string, attemptCount: number): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  const resend = new Resend(apiKey)
  const time = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })
  await resend.emails.send({
    from: 'YOS Dashboard <notifications@yourofficespace.au>',
    to: SECURITY_ALERT_EMAIL,
    subject: 'Security Alert: Dashboard access attempt',
    text: `Someone tried to access the YOS Dashboard with an unauthorised email.\n\nTime: ${time}\nEmail attempted: ${email}\nIP address: ${ip}\nFailed attempts: ${attemptCount}\n\nIf this wasn't you, consider changing your password.`,
    html: `
      <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <div style="background:#7f1d1d;padding:24px;border-radius:12px 12px 0 0">
          <p style="color:#fca5a5;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 8px">Security Alert</p>
          <h1 style="color:white;font-size:20px;font-weight:800;margin:0">Dashboard access attempt</h1>
        </div>
        <div style="background:#111;padding:24px;border-radius:0 0 12px 12px;border:1px solid rgba(255,255,255,0.08);border-top:none">
          <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 20px">Someone attempted to access the YOS Dashboard with an email address not authorised for this system.</p>
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
              <td style="padding:10px 0;color:rgba(255,255,255,0.4)">Email attempted</td>
              <td style="padding:10px 0;color:white;font-weight:600;text-align:right">${email}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
              <td style="padding:10px 0;color:rgba(255,255,255,0.4)">IP address</td>
              <td style="padding:10px 0;color:white;font-weight:600;text-align:right">${ip}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
              <td style="padding:10px 0;color:rgba(255,255,255,0.4)">Failed attempts</td>
              <td style="padding:10px 0;color:#fca5a5;font-weight:600;text-align:right">${attemptCount}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:rgba(255,255,255,0.4)">Time (AEST)</td>
              <td style="padding:10px 0;color:white;font-weight:600;text-align:right">${time}</td>
            </tr>
          </table>
          <p style="color:rgba(255,255,255,0.35);font-size:12px;margin-top:20px">If this wasn't you, consider changing your password or contacting your IT support.</p>
        </div>
      </div>
    `,
  }).catch(() => { /* don't block login flow on alert failure */ })
}

async function sendCodeEmail(email: string, code: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY not configured')
  const resend = new Resend(apiKey)
  await resend.emails.send({
    from: 'YOS Dashboard <notifications@yourofficespace.au>',
    to: email,
    subject: 'Your YOS Dashboard sign-in code',
    html: `
      <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <div style="background:#0A0A0A;padding:24px;border-radius:12px 12px 0 0">
          <p style="color:#00B5A5;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 8px">Your Office Space</p>
          <h1 style="color:white;font-size:22px;font-weight:800;margin:0">Sign-in code</h1>
        </div>
        <div style="background:#111;padding:24px;border-radius:0 0 12px 12px;border:1px solid rgba(255,255,255,0.08);border-top:none">
          <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 24px">Enter this code to access your dashboard:</p>
          <div style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="font-family:monospace;font-size:32px;font-weight:800;color:#00B5A5;letter-spacing:.3em">${code}</span>
          </div>
          <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:0">This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
        <p style="color:#555;font-size:11px;margin:16px 0 0;text-align:center">yourofficespace.au/dashboard</p>
      </div>
    `,
    text: `Your YOS Dashboard sign-in code: ${code}\n\nThis code expires in 5 minutes.\nyourofficespace.au/dashboard`,
  })
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)

  let email: string
  try {
    const body = await req.json() as { email?: string }
    email = (body?.email || '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  // Check rate limit before processing the email
  const count = await incrementSendCount(ip)
  if (count > SEND_LIMIT) {
    // Alert Joe if this is an unrecognised email address
    if (!ALLOWED_EMAILS.includes(email)) {
      const attemptCount = await getSendCount(ip)
      sendAlertEmail(ip, email, attemptCount).catch(() => {})
    }
    return NextResponse.json(
      { error: 'Too many codes sent. Try again in 15 minutes.', retry_after: SEND_WINDOW_SEC },
      { status: 429 }
    )
  }

  if (!ALLOWED_EMAILS.includes(email)) {
    // This is suspicious — someone is trying an unrecognised email repeatedly.
    // Alert Joe but don't tell the attacker whether the email exists.
    sendAlertEmail(ip, email, count).catch(() => {})
    return NextResponse.json(
      { error: 'Too many codes sent. Try again in 15 minutes.', retry_after: SEND_WINDOW_SEC },
      { status: 429 }
    )
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()

  // Delete any existing code first — prevents old code being used if new code was sent
  // then old code was accidentally copy-pasted from email
  await redisDel(`2fa:code:${email}`)

  await redisSet(
    `2fa:code:${email}`,
    JSON.stringify({ hash: code, attempts: 0, maxed: false }),
    CODE_TTL_SEC
  )

  try {
    await sendCodeEmail(email, code)
  } catch (err) {
    console.error('[auth-v2/send-code] Failed to send email:', err)
    return NextResponse.json({ error: 'Failed to send email. Try again shortly.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, expires_in: CODE_TTL_SEC, message: `Code sent to ${email}` })
}