import { createHmac, timingSafeEqual } from 'crypto'

export type AuthV2SessionPayload = {
  userId: string
  email: string
  role: string
  scopes: string[]
  allowed_clients: string[]
  exp: number
}

export function createSignedSessionToken(payload: AuthV2SessionPayload, secret: string): string {
  if (secret.length < 32) throw new Error('AUTH_COOKIE_SECRET is not configured')
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const mac = createHmac('sha256', secret).update(encodedPayload).digest('base64url')
  return `${encodedPayload}.${mac}`
}

export function verifySignedSessionToken(token: string, secret: string): AuthV2SessionPayload | null {
  if (secret.length < 32) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [encodedPayload, mac] = parts
  const expectedMac = createHmac('sha256', secret).update(encodedPayload).digest('base64url')
  if (mac.length !== expectedMac.length) return null

  try {
    if (!timingSafeEqual(Buffer.from(mac), Buffer.from(expectedMac))) return null
    const session = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as AuthV2SessionPayload
    if (!session.userId || !session.email || !session.role || !Array.isArray(session.scopes) || !Array.isArray(session.allowed_clients)) return null
    if (!Number.isFinite(session.exp) || session.exp < Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
}

export function hashOneTimeCode(code: string, secret: string): string {
  if (secret.length < 32) throw new Error('AUTH_COOKIE_SECRET is not configured')
  return createHmac('sha256', secret).update(`yos-auth-code:${code}`).digest('base64url')
}

export function verifyOneTimeCode(code: string, storedHash: string, secret: string): boolean {
  try {
    const candidateHash = hashOneTimeCode(code, secret)
    if (candidateHash.length !== storedHash.length) return false
    return timingSafeEqual(Buffer.from(candidateHash), Buffer.from(storedHash))
  } catch {
    return false
  }
}
