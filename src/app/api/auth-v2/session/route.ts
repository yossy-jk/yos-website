/**
 * GET /api/auth-v2/session
 * Reads session cookie, returns current user if authenticated.
 * Used by dashboard pages to validate auth state.
 */
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
      scopes: user.scopes,
    },
  })
}