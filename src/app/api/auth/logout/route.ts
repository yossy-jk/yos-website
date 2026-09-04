/**
 * POST /api/auth/logout
 * Clears session cookie.
 */
import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'
import { clearSessionCookie as clearSessionCookieV2 } from '@/lib/auth-v2'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  clearSessionCookie(response)
  return clearSessionCookieV2(response)
}
