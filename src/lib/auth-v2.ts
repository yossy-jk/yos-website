/**
 * YOS Dashboard Auth v2 — Redis-backed user store with scopes and roles.
 * Session token: base64url(JSON payload).hmac-sha256
 * The signature and expiry are verified before Redis user resolution.
 *
 * Roles: super | admin | user | limited | tenant_rep
 * Scopes: health | finance | deals | outreach | tasks | operations | compliance | tenant_rep
 * Tenant reps also have allowed_clients: string[] (client IDs)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { Redis } from '@upstash/redis'
import bcrypt from 'bcryptjs'
import { createSignedSessionToken, verifySignedSessionToken } from '@/lib/auth-session'
import { deploymentScopedKey } from '@/lib/deployment-scope'

// ── Config ──────────────────────────────────────────────────────────────────
const UPSTASH_URL       = process.env.UPSTASH_REDIS_REST_URL  || ''
const UPSTASH_TOKEN     = process.env.UPSTASH_REDIS_REST_TOKEN || ''
const COOKIE_NAME       = 'yos_dash_session_v2'
const SESSION_TTL_SEC   = 60 * 60 * 24 * 7   // 7 days
const BCRYPT_ROUNDS     = 12

// ── Redis Client ────────────────────────────────────────────────────────────
let _redis: Redis | null = null
function getRedis(): Redis | null {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  if (!_redis) _redis = new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN })
  return _redis
}

// ── Redis helpers ──────────────────────────────────────────────────────────
export async function redisGet(key: string): Promise<unknown | null> {
  const r = getRedis()
  if (!r) return null
  try { return (await r.get(deploymentScopedKey(key))) ?? null } catch { return null }
}

export async function redisSet(key: string, value: string, ttl?: number): Promise<boolean> {
  const r = getRedis()
  if (!r) return false
  try {
    if (ttl) {
      await r.set(deploymentScopedKey(key), value, { ex: ttl })
    } else {
      await r.set(deploymentScopedKey(key), value)
    }
    return true
  } catch { return false }
}

export async function redisDel(key: string): Promise<boolean> {
  const r = getRedis()
  if (!r) return false
  try { await r.del(deploymentScopedKey(key)); return true } catch { return false }
}

export async function redisIncr(key: string): Promise<number> {
  const r = getRedis()
  if (!r) return 0
  try { return (await r.incr(deploymentScopedKey(key))) as number } catch { return 0 }
}

export async function redisTtl(key: string): Promise<number> {
  const r = getRedis()
  if (!r) return -1
  try { return (await r.ttl(deploymentScopedKey(key))) as number } catch { return -1 }
}

// ── Types ──────────────────────────────────────────────────────────────────
type Role = 'super' | 'admin' | 'user' | 'limited' | 'tenant_rep'

export type User = {
  id: string
  email: string
  name: string
  role: Role
  scopes: string[]
  allowed_clients: string[]
  password_hash: string
  created_at: string
  updated_at: string
  created_by: string
  last_login: string | null
  active: boolean
}

// ── Rate limit (in-memory, resets on cold start — fine for our scale) ────────
const attempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

export function getIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const real = req.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now()
  const record = attempts.get(ip)
  if (!record || record.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfter: 0 }
  }
  record.count++
  if (record.count > MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((record.resetAt - now) / 1000) }
  }
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count, retryAfter: 0 }
}

export function clearRateLimit(ip: string): void {
  attempts.delete(ip)
}

// ── User store ─────────────────────────────────────────────────────────────
function userKey(email: string)    { return `yos:users:email:${email}` }
function userByIdKey(id: string)   { return `yos:users:id:${id}` }

export async function getUser(email: string): Promise<User | null> {
  const raw = await redisGet(userKey(email))
  if (!raw) return null
  if (typeof raw === 'object') return raw as User
  if (typeof raw !== 'string') return null
  try { return JSON.parse(raw) as User } catch { return null }
}

export async function getUserById(id: string): Promise<User | null> {
  const raw = await redisGet(userByIdKey(id))
  if (!raw) return null
  if (typeof raw === 'object') return raw as User
  if (typeof raw !== 'string') return null
  try { return JSON.parse(raw) as User } catch { return null }
}

export async function saveUser(user: User): Promise<void> {
  const [savedByEmail, savedById] = await Promise.all([
    redisSet(userKey(user.email), JSON.stringify(user)),
    redisSet(userByIdKey(user.id), JSON.stringify(user)),
  ])
  if (!savedByEmail || !savedById) throw new Error('User store unavailable')
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

// Verify password hash
export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  try { return await bcrypt.compare(password, hash) } catch { return false }
}

// ── Session ────────────────────────────────────────────────────────────────
type Session = {
  userId: string
  email: string
  role: Role
  scopes: string[]
  allowed_clients: string[]
  exp: number
}

export async function createSession(user: User): Promise<string> {
  const cookieSecret = process.env.AUTH_COOKIE_SECRET
  if (!cookieSecret || cookieSecret.length < 32) throw new Error('AUTH_COOKIE_SECRET is not configured')
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC
  return createSignedSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    scopes: user.scopes,
    allowed_clients: user.allowed_clients,
    exp,
  }, cookieSecret)
}

function parseSession(token: string): Session | null {
  const cookieSecret = process.env.AUTH_COOKIE_SECRET
  if (!cookieSecret || cookieSecret.length < 32) return null
  return verifySignedSessionToken(token, cookieSecret) as Session | null
}

export function setSessionCookie(response: NextResponse, session: string): NextResponse {
  response.cookies.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL_SEC,
    path: '/',
  })
  return response
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  const session = parseSession(token)
  if (!session) return null
  const user = await getUserById(session.userId)
  return user?.active ? user : null
}

export async function requireAuth(): Promise<{ ok: boolean; user?: User; response?: NextResponse }> {
  const user = await getCurrentUser()
  if (!user) {
    const response = NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    return { ok: false, response }
  }
  return { ok: true, user }
}
