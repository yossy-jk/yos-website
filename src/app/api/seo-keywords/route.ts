import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { readFileSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  const keywordsPath = join(homedir(), '.openclaw/workspace-brand-marketing/TARGET_KEYWORDS.json')
  
  if (!existsSync(keywordsPath)) {
    return NextResponse.json({ keywords: [], error: 'Keywords file not found' })
  }

  const keywords = JSON.parse(readFileSync(keywordsPath, 'utf8'))
  
  return NextResponse.json({
    keywords,
    total: keywords.length,
    byCluster: keywords.reduce((acc: Record<string, number>, k: { cluster: string }) => {
      acc[k.cluster] = (acc[k.cluster] || 0) + 1
      return acc
    }, {}),
    p1Count: keywords.filter((k: { priority: string }) => k.priority === 'P1').length,
    generatedAt: new Date().toISOString()
  })
}
