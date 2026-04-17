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
  metaTitle?: string
  metaDescription?: string
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
