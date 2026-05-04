import fs from 'fs'
import path from 'path'

export type Division = 'tenant-rep' | 'buyers-agency' | 'furniture' | 'cleaning' | 'general'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  division: Division
  author: string
  body: string
  tags: string[]
  heroImage?: string   // URL or /images/... path — optional, falls back to division default
  metaTitle?: string
  metaDescription?: string
}

// Default hero images per division — used when heroImage is not set on a post
export const DIVISION_HERO_IMAGES: Record<Division, string> = {
  'tenant-rep':     'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80',
  'buyers-agency':  'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1920&q=80',
  'furniture':      '/images/furniture/opal-office.jpg',
  'cleaning':       'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1920&q=80',
  'general':        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
}

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

export const DIVISION_LABELS: Record<Division, string> = {
  'tenant-rep': 'Tenant Representation',
  'buyers-agency': 'Buyers Agency',
  'furniture': 'Furniture & Fitout',
  'cleaning': 'Commercial Cleaning',
  'general': 'Commercial Property'
}

export const DIVISION_COLORS: Record<Division, string> = {
  'tenant-rep': 'bg-teal text-white',
  'buyers-agency': 'bg-near-black text-white',
  'furniture': 'bg-charcoal text-white',
  'cleaning': 'bg-dark-teal text-white',
  'general': 'bg-mid-grey text-white'
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json'))
  const posts = files
    .map(file => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
      return JSON.parse(raw) as BlogPost
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return posts
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as BlogPost
}

export function getPostsByDivision(division: Division): BlogPost[] {
  return getAllPosts().filter(p => p.division === division)
}

// ─── Async versions that merge filesystem + Redis-published posts ────────────

async function fetchRedisPosts(): Promise<BlogPost[]> {
  try {
    const url   = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return []
    const res = await fetch(`${url}/hgetall/yos:blog:live`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    const d = await res.json() as { result: unknown }
    const raw = d.result
    if (!raw) return []
    let entries: [string, string][] = []
    if (Array.isArray(raw)) {
      for (let i = 0; i < (raw as string[]).length; i += 2) {
        entries.push([(raw as string[])[i], (raw as string[])[i + 1]])
      }
    } else {
      entries = Object.entries(raw as Record<string, string>)
    }
    return entries
      .map(([, val]) => { try { return JSON.parse(val) as BlogPost } catch { return null } })
      .filter((p): p is BlogPost => p !== null)
  } catch {
    return []
  }
}

export async function getAllPostsAsync(): Promise<BlogPost[]> {
  const [fsPosts, redisPosts] = await Promise.all([
    Promise.resolve(getAllPosts()),
    fetchRedisPosts(),
  ])
  // Merge: filesystem takes precedence if same slug exists in both
  const slugSet = new Set(fsPosts.map(p => p.slug))
  const merged = [...fsPosts, ...redisPosts.filter(p => !slugSet.has(p.slug))]
  return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlugAsync(slug: string): Promise<BlogPost | null> {
  // Check filesystem first
  const fsPost = getPostBySlug(slug)
  if (fsPost) return fsPost
  // Fall back to Redis
  try {
    const url   = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token) return null
    const res = await fetch(`${url}/hget/yos:blog:live/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    const d = await res.json() as { result: string | null }
    if (!d.result) return null
    return JSON.parse(d.result) as BlogPost
  } catch {
    return null
  }
}
