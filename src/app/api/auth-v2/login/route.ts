/**
 * POST /api/auth-v2/login
 * Body: { email, code, password }
 * Requires valid 2FA code (from /send-code) + password.
 * Sets session cookie on success.
 *
 * GET /api/auth-v2/login?secret=<CRON_STATE_SECRET>&email=<email>
 * Returns the current code in Redis (for debugging only).
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  getUser, getUserById, createSession, setSessionCookie, saveUser,
  checkRateLimit, getIp, clearRateLimit, verifyPasswordHash,
  redisGet, redisSet, redisDel, redisTtl, hashPassword,
} from '@/lib/auth-v2'

export const runtime = 'nodejs'

const CODE_TTL_SEC = 300 // must match send-code route

/** Normalise the stored hash to a plain string.
 * Upstash SDK may return a parsed JSON object (not a raw JSON string).
 * The hash field in Redis is always a plain 6-digit string, but due to
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

// GET — debug endpoint
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get('secret') !== process.env.CRON_STATE_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const email = req.nextUrl.searchParams.get('email') || 'jk@yourofficespace.au'
  const raw = await redisGet(`2fa:code:${email}`)
  if (!raw) return NextResponse.json({ email, found: false })
  return NextResponse.json({ email, found: true, code: extractCode(raw) })
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
  const storedCode = extractCode(raw)

  // Parse attempt counter (may be at top level or nested)
  let attempts = 0
  try {
    if (typeof raw === 'object' && raw !== null) {
      const obj = raw as Record<string, unknown>
      if (typeof obj.attempts === 'number') attempts = obj.attempts
      else if (typeof obj.hash === 'object' && obj.hash !== null) {
        const inner = obj.hash as Record<string, unknown>
        if (typeof inner.attempts === 'number') attempts = inner.attempts
      }
    }
  } catch { /* ignore */ }

  const isMaxed = storedCode === '' ? true : false // fallback: no code = treat as maxed

  if (code !== storedCode) {
    attempts++
    const ttlRemaining = await redisTtl(codeKey)
    const ttl = ttlRemaining > 0 ? ttlRemaining : CODE_TTL_SEC

    // Write back with updated attempts — preserve the nested structure by only updating attempts
    await redisSet(codeKey, JSON.stringify({ hash: storedCode, attempts, maxed: attempts >= 5 }), ttl)

    if (attempts >= 5) {
      return NextResponse.json(
        { error: 'Too many wrong attempts. Please request a new code.', code_required: true, go_to_email: true },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Incorrect code — check the latest code in your inbox.', code_required: true },
      { status: 401 }
    )
  }

  // Code valid — proceed
  await redisDel(codeKey)

  // ── Password Verification ─────────────────────────────────────────────
  let user = await getUser(email)

  if (!user) {
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
    await saveUser(user)
  } else {
    const valid = await verifyPasswordHash(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect email or password' }, { status: 401 })
    }
  }

  // ── Success ────────────────────────────────────────────────────────────
  const updated = { ...user, last_login: new Date().toISOString(), updated_at: new Date().toISOString() }
  await saveUser(updated)
  clearRateLimit(ip)

  const session = await createSession(updated)
  const response = NextResponse.json({
    ok: true,
    user: { email: updated.email, name: updated.name, role: updated.role, scopes: updated.scopes },
  })
  setSessionCookie(response, session)
  return response
}