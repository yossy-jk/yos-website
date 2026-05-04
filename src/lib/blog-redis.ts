/**
 * blog-redis.ts
 * Reads dynamically published blog posts from Upstash Redis.
 * Posts are written here by /api/blog/publish-scheduled when approved
 * posts reach their scheduledFor date.
 *
 * Redis key: yos:blog:live  (hash — slug → JSON string)
 */

import type { BlogPost } from './blog'

const LIVE_KEY = 'yos:blog:live'

function redisUrl() {
  return process.env.UPSTASH_REDIS_REST_URL
}
function redisToken() {
  return process.env.UPSTASH_REDIS_REST_TOKEN
}

async function redisCall(path: string, method = 'GET', body?: unknown): Promise<unknown> {
  const url = redisUrl()
  const token = redisToken()
  if (!url || !token) return null
  const res = await fetch(`${url}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  })
  const d = await res.json() as { result: unknown }
  return d.result
}

/** Fetch all dynamically published posts from Redis */
export async function getRedisPosts(): Promise<BlogPost[]> {
  try {
    const raw = await redisCall(`/hgetall/${LIVE_KEY}`) as Record<string, string> | null
    if (!raw) return []
    // hgetall returns alternating field/value array or object depending on client
    let entries: [string, string][] = []
    if (Array.isArray(raw)) {
      for (let i = 0; i < raw.length; i += 2) {
        entries.push([raw[i] as string, raw[i + 1] as string])
      }
    } else {
      entries = Object.entries(raw)
    }
    return entries
      .map(([, val]) => {
        try { return JSON.parse(val) as BlogPost } catch { return null }
      })
      .filter((p): p is BlogPost => p !== null)
  } catch {
    return []
  }
}

/** Fetch a single dynamically published post by slug */
export async function getRedisPost(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await redisCall(`/hget/${LIVE_KEY}/${slug}`) as string | null
    if (!raw) return null
    return JSON.parse(raw) as BlogPost
  } catch {
    return null
  }
}

/** Write a post to the live Redis hash (called by publish-scheduled API) */
export async function publishPostToRedis(post: BlogPost): Promise<boolean> {
  try {
    await redisCall(`/hset/${LIVE_KEY}/${post.slug}`, 'GET')
    // Use pipeline-style set
    const res = await fetch(`${redisUrl()}/hset/${LIVE_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([post.slug, JSON.stringify(post)]),
    })
    return res.ok
  } catch {
    return false
  }
}
