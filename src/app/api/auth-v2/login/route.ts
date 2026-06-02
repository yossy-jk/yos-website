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
  redisGet, redisSet, redisDel, hashPassword,
} from '@/lib/auth-v2'

export const runtime = 'nodejs'

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
      code     = body?.code  || ''
      password = body?.password || ''
    } else {
      const body = await req.text()
      email    = ((body.match(/email=([^&]+)/)?.[1] || '')).replace(/%40/g, '@').trim()
      code     = body.match(/code=([^&]+)/)?.[1] || ''
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
      { error: 'No code found. Request a new code and try again.', code_required: true },
      { status: 401 }
    )
  }

  let codeData: { hash?: string; attempts?: number }
  try { codeData = JSON.parse(raw) } catch { codeData = raw as unknown as { hash?: string } }

  if (codeData.hash !== code) {
    if (codeData.attempts !== undefined && codeData.attempts >= 4) {
      await redisDel(codeKey)
      return NextResponse.json(
        { error: 'Too many wrong attempts. Request a new code.', code_required: true },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Incorrect code.', code_required: true },
      { status: 401 }
    )
  }

  // Code valid — invalidate immediately (one-time use)
  await redisDel(codeKey)

  // ── Password Verification ─────────────────────────────────────────────
  let user = await getUser(email)

  // If no user exists in Redis yet, seed it with this password
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
    // Existing user — verify password
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
  return setSessionCookie(response, session)
}