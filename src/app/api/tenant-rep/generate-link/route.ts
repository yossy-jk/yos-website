/**
 * POST /api/tenant-rep/generate-link
 * Creates a time-limited shareable link for a client brief.
 * 
 * Body: {
 *   client_id: string
 *   password?: string        // optional — if set, client needs password to view
 *   expires_days?: number    // default 30
 * }
 * 
 * Response: {
 *   token: string
 *   link: string
 *   expires_at: string
 *   password_protected: boolean
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'
import { redisSet } from '@/lib/auth-v2'
import { createHmac, randomBytes } from 'crypto'
import { Redis } from '@upstash/redis'
import bcrypt from 'bcryptjs'

const UPSTASH_URL    = process.env.UPSTASH_REDIS_REST_URL  || ''
const UPSTASH_TOKEN  = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const BASE_URL       = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.yourofficespace.au'

function getRedis(): Redis | null {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  return new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN })
}

function genToken(): string {
  return randomBytes(32).toString('hex')
}

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Role check — tenant_rep scope or admin/super
  const allowed = ['admin', 'super', 'tenant_rep']
  if (!allowed.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { client_id, password, expires_days = 30 } = body

  if (!client_id) {
    return NextResponse.json({ error: 'client_id required' }, { status: 400 })
  }

  const r = getRedis()
  if (!r) {
    return NextResponse.json({ error: 'Redis not configured' }, { status: 500 })
  }

  const token  = genToken()
  const expiry = Math.floor(Date.now() / 1000) + (expires_days * 24 * 60 * 60)
  const expires_at = new Date(expiry * 1000).toISOString()

  const storeKey = `tenant-rep:token:${token}`
  const payload: Record<string, unknown> = {
    client_id,
    created_by: user.email,
    created_at: new Date().toISOString(),
    expires_at,
  }

  if (password) {
    payload.password_hash = hashPassword(password)
  }

  await r.set(storeKey, JSON.stringify(payload), { ex: expires_days * 24 * 60 * 60 })

  const link = `${BASE_URL}/tenant-rep/brief/${token}`

  return NextResponse.json({
    token,
    link,
    expires_at,
    password_protected: !!password,
  })
}
