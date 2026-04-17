import fs from 'fs'
import path from 'path'
import type { Division } from './blog'

export interface CaseStudy {
  slug: string
  title: string
  client: string           // Can be "A Newcastle law firm" if confidential
  location: string
  division: Division
  date: string
  excerpt: string
  heroImage?: string
  challenge: string
  solution: string
  outcome: string
  metrics: { label: string; value: string }[]
  quote?: { text: string; attribution: string }
  tags: string[]
  metaTitle?: string
  metaDescription?: string
  featured?: boolean
}

const CS_DIR = path.join(process.cwd(), 'src/content/case-studies')

export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CS_DIR)) return []
  const files = fs.readdirSync(CS_DIR).filter(f => f.endsWith('.json'))
  return files
    .map(file => JSON.parse(fs.readFileSync(path.join(CS_DIR, file), 'utf8')) as CaseStudy)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const filePath = path.join(CS_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CaseStudy
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return getAllCaseStudies().filter(cs => cs.featured)
}
