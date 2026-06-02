/**
 * POST /api/auth-v2/send-code
 * Body: { email: string }
 * Sends a 6-digit verification code to the user's email.
 * Rate limited: 5 codes per 2 hours per IP.
 */
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { redisGet, redisSet, redisDel, redisIncr, getUser } from '@/lib/auth-v2'

export const runtime = 'nodejs'

const CODE_TTL_SEC    = 300  // 5 minutes
const SEND_LIMIT      = 5   // max codes per 2 hours
const SEND_WINDOW_SEC = 7200 // 2 hours

// Whitelist — only these emails can receive codes
const ALLOWED_EMAILS = ['jk@yourofficespace.au']

function getIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

async function isSendRateLimited(ip: string): Promise<boolean> {
  const key = `2fa:send:ip:${ip}`
  const count = await redisIncr(key)
  if (count === 1) await redisSet(key, '1', SEND_WINDOW_SEC)
  return count > SEND_LIMIT
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
  console.log('[auth-v2/send-code] request received')
  const ip = getIp(req)
  if (await isSendRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many codes sent. Try again in 2 hours.' }, { status: 429 })
  }

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

  if (!ALLOWED_EMAILS.includes(email)) {
    return NextResponse.json({ error: 'This email is not authorised to access the dashboard.' }, { status: 403 })
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  console.log('[auth-v2/send-code] generating code for', email, '(code hidden)')

  await redisSet(
    `2fa:code:${email}`,
    JSON.stringify({ hash: code, attempts: 0, maxed: false, created_at: new Date().toISOString() }),
    CODE_TTL_SEC
  )

  try {
    await sendCodeEmail(email, code)
    console.log('[auth-v2/send-code] email sent to', email)
  } catch (err) {
    console.error('[auth-v2/send-code] Failed to send email:', err)
    return NextResponse.json({ error: 'Failed to send email. Try again shortly.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, expires_in: CODE_TTL_SEC, message: `Code sent to ${email}` })
}