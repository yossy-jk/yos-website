/**
 * POST /api/auth-v2/login
 * Body: { email, code, password }
 * Requires valid 2FA code (from /send-code) + password.
 * Sets session cookie on success.
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  getUser, getUserById, createSession, setSessionCookie, saveUser,
  checkRateLimit, getIp, clearRateLimit, verifyPasswordHash,
  redisGet, redisSet, redisDel, redisTtl, hashPassword,
} from '@/lib/auth-v2'

export const runtime = 'nodejs'

const CODE_TTL_SEC = 300 // must match send-code route

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
    // No code in Redis — the key expired or was never created.
    // The frontend must send the user back to email step.
    return NextResponse.json(
      { error: 'No code found. Request a new code.', code_required: true, go_to_email: true },
      { status: 401 }
    )
  }

  let codeData: { hash?: string; attempts?: number; maxed?: boolean; version?: number }
  try { codeData = JSON.parse(raw) } catch { codeData = { hash: raw as unknown as string } }
  if (codeData.attempts === undefined) codeData.attempts = 0

  // ── Handle expired/maxed codes ─────────────────────────────────────────
  // Any scenario where the code is invalid AND we've already told the user to request
  // a new one means the user is holding an OLD code. Send them to email step.
  const wrongCode = codeData.hash !== code
  const codeIsMaxed = codeData.maxed

  if (wrongCode || codeIsMaxed) {
    // Attempt counter only increments for wrong codes (not for "maxed" check)
    if (wrongCode) {
      codeData.attempts = (codeData.attempts ?? 0) + 1
    }

    const ttlRemaining = await redisTtl(codeKey)
    const ttl = ttlRemaining > 0 ? ttlRemaining : CODE_TTL_SEC

    if (codeData.attempts >= 5) {
      codeData.maxed = true
      await redisSet(codeKey, JSON.stringify(codeData), ttl)
      // User has an old or exhausted code — send back to email step
      return NextResponse.json(
        { error: 'Too many wrong attempts. Please request a new code.', code_required: true, go_to_email: true },
        { status: 401 }
      )
    }

    if (wrongCode) {
      await redisSet(codeKey, JSON.stringify(codeData), ttl)
    }

    // If the code was maxed (but they got here via wrong code check), also go to email
    if (codeIsMaxed) {
      return NextResponse.json(
        { error: 'Code expired. Request a new code.', code_required: true, go_to_email: true },
        { status: 401 }
      )
    }

    // Plain wrong code — stay on code step, let them retry
    return NextResponse.json(
      { error: 'Incorrect code — check the latest code in your inbox.', code_required: true },
      { status: 401 }
    )
  }

  // Code matches and not maxed — proceed
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