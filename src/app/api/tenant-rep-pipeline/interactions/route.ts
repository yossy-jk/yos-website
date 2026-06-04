import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const user = (await import('@/lib/auth-v2')).getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const sqlite3 = require('better-sqlite3')
    const db2 = sqlite3('/Users/yourofficespace-main/.openclaw/tenant-rep/data/pipeline.db')
    const ints = db2.prepare('SELECT * FROM interactions ORDER BY created_at DESC LIMIT 200').all()
    db2.close()
    return NextResponse.json(ints)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = (await import('@/lib/auth-v2')).getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const body = await req.json()
    const sqlite3 = require('better-sqlite3')
    const db2 = sqlite3('/Users/yourofficespace-main/.openclaw/tenant-rep/data/pipeline.db')
    const id = Date.now()
    const now = new Date().toISOString()
    db2.prepare('INSERT INTO interactions (id,client_id,property_id,interaction_type,note,created_at) VALUES (?,?,?,?,?,?)').run(id, body.client_id||null, body.property_id||null, body.interaction_type||'Other', body.note||'', now)
    const i = db2.prepare('SELECT * FROM interactions WHERE id=?').get(id)
    db2.close()
    return NextResponse.json(i, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}