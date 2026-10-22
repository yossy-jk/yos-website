/**
 * Upstash rate limiting for YOS API routes.
 * Prevents email bombing, CRM spam, and API exhaustion.
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { deploymentScopedKey } from '@/lib/deployment-scope'

function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

// Contact form — 5 submissions per IP per 10 minutes
export function contactLimiter() {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: deploymentScopedKey('rl:contact') })
}

// Fitout report — 3 per IP per 10 minutes (sends two emails per request)
export function fitoutLimiter() {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '10 m'), prefix: deploymentScopedKey('rl:fitout') })
}

// Furniture voucher — 3 sends per IP per 30 minutes
export function voucherLimiter() {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '30 m'), prefix: deploymentScopedKey('rl:voucher') })
}

// Checklist retries must not consume the existing catalogue/voucher allowance.
export function checklistLimiter(kind: 'request' | 'recipient') {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: kind === 'request' ? Ratelimit.slidingWindow(10, '10 m') : Ratelimit.slidingWindow(3, '30 m'), prefix: deploymentScopedKey(`rl:checklist:${kind}`) })
}

// HubSpot route — 10 per IP per 10 minutes (tool gates, form gates)
export function hubspotLimiter() {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '10 m'), prefix: deploymentScopedKey('rl:hubspot') })
}

// Notify route — 5 per IP per 10 minutes
export function notifyLimiter() {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: deploymentScopedKey('rl:notify') })
}

// Helper — extract IP from request headers (Vercel edge)
export function getIp(req: Request): string {
  const forwarded = (req.headers as Headers).get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return '127.0.0.1'
}

// Payment attempts and receipt checks have separate limits.
export function tenantPaymentLimiter(kind: 'checkout' | 'status') {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(kind === 'checkout' ? 5 : 60, '10 m'), prefix: deploymentScopedKey(`rl:tenant-payment:${kind}`) })
}
