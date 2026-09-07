/**
 * POST /api/auth-v2/login
 * Body: { email, code, password }
 * Requires valid 2FA code (from /send-code) + password.
 * Sets session cookie on success.
 *
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  getUser, createSession, setSessionCookie, saveUser,
  checkRateLimit, getIp, clearRateLimit, verifyPasswordHash,
  redisGet, redisSet, redisDel, redisTtl, hashPassword,
} from '@/lib/auth-v2'
import { verifyOneTimeCode } from '@/lib/auth-session'

export const runtime = 'nodejs'

const CODE_TTL_SEC = 300 // must match send-code route

/** Normalise the stored hash to a plain string.
 * Upstash SDK may return a parsed JSON object (not a raw JSON string).
 * The hash field in Redis is an HMAC digest of the 6-digit code, but due to
 * nested-object writes during wrong-code retries it may arrive here as
 * an object. We extract it safely either way.
 */
function extractCode(raw: unknown): string {
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return extractCode(parsed)
    } catch {
      return raw
    }
  }
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>
    if (typeof obj.hash === 'string') return obj.hash
    if (typeof obj.hash === 'object' && obj.hash !== null) {
      return extractCode(obj.hash as Record<string, unknown>)
    }
  }
  return ''
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)

  const rate = checkRateLimit(ip)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rate.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } }
    )
  }

  let email: string, code: string, password: string
  const contentType = req.headers.get('content-type') || ''

  try {
    if (contentType.includes('application/json')) {
      const body = await req.json() as { email?: string; code?: string; password?: string }
      email    = (body?.email || '').trim().toLowerCase()
      code     = (body?.code  || '').replace(/\s/g, '')
      password = body?.password || ''
    } else {
      const body = await req.text()
      email    = ((body.match(/email=([^&]+)/)?.[1] || '')).replace(/%40/g, '@').trim()
      code     = (body.match(/code=([^&]+)/)?.[1] || '').replace(/\s/g, '')
      password = (body.match(/password=([^&]+)/)?.[1] || '').replace(/\+/g, ' ')
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
  if (!code)  return NextResponse.json({ error: 'Verification code required' }, { status: 400 })
  if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 })

  // ── 2FA Code Verification ─────────────────────────────────────────────
  const codeKey = `2fa:code:${email}`
  const raw     = await redisGet(codeKey)

  if (!raw) {
    return NextResponse.json(
      { error: 'No code found. Request a new code.', code_required: true, go_to_email: true },
      { status: 401 }
    )
  }

  // Extract the actual code string from whatever shape it arrived in
  const storedHash = extractCode(raw)

  // Parse attempt counter (may be at top level or nested)
  let attempts = 0
  let maxed = false
  try {
    if (typeof raw === 'object' && raw !== null) {
      const obj = raw as Record<string, unknown>
      if (typeof obj.attempts === 'number') attempts = obj.attempts
      if (obj.maxed === true) maxed = true
      else if (typeof obj.hash === 'object' && obj.hash !== null) {
        const inner = obj.hash as Record<string, unknown>
        if (typeof inner.attempts === 'number') attempts = inner.attempts
        if (inner.maxed === true) maxed = true
      }
    }
  } catch { /* ignore */ }

  if (maxed || attempts >= 5) {
    await redisDel(codeKey)
    return NextResponse.json(
      { error: 'Too many wrong attempts. Please request a new code.', code_required: true, go_to_email: true },
      { status: 401 }
    )
  }

  const authSecret = process.env.AUTH_COOKIE_SECRET || ''
  if (!verifyOneTimeCode(code, storedHash, authSecret)) {
    attempts++
    const ttlRemaining = await redisTtl(codeKey)
    const ttl = ttlRemaining > 0 ? ttlRemaining : CODE_TTL_SEC

    if (attempts >= 5) {
      await redisDel(codeKey)
      return NextResponse.json(
        { error: 'Too many wrong attempts. Please request a new code.', code_required: true, go_to_email: true },
        { status: 401 }
      )
    }

    const saved = await redisSet(codeKey, JSON.stringify({ hash: storedHash, attempts, maxed: false }), ttl)
    if (!saved) return NextResponse.json({ error: 'Sign-in service is temporarily unavailable.' }, { status: 503 })

    return NextResponse.json(
      { error: 'Incorrect code — check the latest code in your inbox.', code_required: true },
      { status: 401 }
    )
  }

  // ── Password Verification ─────────────────────────────────────────────
  let user = await getUser(email)

  if (!user) {
    if (password.length < 12) {
      return NextResponse.json({ error: 'Password must be at least 12 characters' }, { status: 400 })
    }
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const password_hash = await hashPassword(password)
    user = {
      id, email, name: 'Joe Kelley',
      role: 'super',
      scopes: ['health', 'finance', 'deals', 'outreach', 'tasks', 'operations', 'compliance'],
      allowed_clients: [],
      password_hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system-seed',
      last_login: null,
      active: true,
    }
  } else {
    if (!user.active) return NextResponse.json({ error: 'Account is disabled' }, { status: 403 })
    const valid = await verifyPasswordHash(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 })
    }
  }

  // ── Success ────────────────────────────────────────────────────────────
  const updated = { ...user, last_login: new Date().toISOString(), updated_at: new Date().toISOString() }
  await saveUser(updated)
  await redisDel(codeKey)
  clearRateLimit(ip)

  const session = await createSession(updated)
  const response = NextResponse.json({
    ok: true,
    user: { email: updated.email, name: updated.name, role: updated.role, scopes: updated.scopes },
  })
  setSessionCookie(response, session)
  return response
}
