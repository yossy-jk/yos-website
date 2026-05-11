/**
 * POST /api/auth/login
 * Body: { password: string }
 * Sets session cookie on success.
 *
 * Rate limited: 5 attempts per 15 minutes per IP.
 */
import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, setSessionCookie } from '@/lib/auth'

// In-memory rate limit. Resets on Vercel cold start which is fine for our scale.
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000  // 15 minutes

function getIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = attempts.get(ip)
  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }
  record.count++
  if (record.count > MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 }
  }
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count }
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const rate = checkRateLimit(ip)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }

  let password: string
  try {
    const body = await req.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  if (!verifyPassword(password)) {
    return NextResponse.json(
      { error: 'Incorrect password', remaining: rate.remaining },
      { status: 401 }
    )
  }

  // Success — reset the rate limit for this IP and set cookie
  attempts.delete(ip)
  const response = NextResponse.json({ ok: true })
  return setSessionCookie(response)
}
