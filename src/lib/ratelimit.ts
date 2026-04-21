/**
 * Upstash rate limiting for YOS API routes.
 * Prevents email bombing, CRM spam, and API exhaustion.
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

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
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: 'rl:contact' })
}

// Fitout report — 3 per IP per 10 minutes (sends two emails per request)
export function fitoutLimiter() {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '10 m'), prefix: 'rl:fitout' })
}

// HubSpot route — 10 per IP per 10 minutes (tool gates, form gates)
export function hubspotLimiter() {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '10 m'), prefix: 'rl:hubspot' })
}

// Notify route — 5 per IP per 10 minutes
export function notifyLimiter() {
  const redis = getRedis()
  if (!redis) return null
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: 'rl:notify' })
}

// Helper — extract IP from request headers (Vercel edge)
export function getIp(req: Request): string {
  const forwarded = (req.headers as Headers).get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return '127.0.0.1'
}
