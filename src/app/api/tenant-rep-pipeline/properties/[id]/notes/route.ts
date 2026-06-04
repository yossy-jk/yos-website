import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = (await import('@/lib/auth-v2')).getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await params
  try {
    const { note } = await req.json()
    const sqlite3 = require('better-sqlite3')
    const db2 = sqlite3('/Users/yourofficespace-main/.openclaw/tenant-rep/data/pipeline.db')
    const now = new Date().toISOString()
    const prev = db2.prepare('SELECT notes FROM properties WHERE id=?').get(id)
    const prevNote = prev?.notes ? prev.notes + '\n' : ''
    const tsNote = '[' + now.slice(0,16) + '] ' + (note || '')
    db2.prepare('UPDATE properties SET notes=?,updated_at=? WHERE id=?').run(prevNote + tsNote, now, id)
    const prop = db2.prepare('SELECT * FROM properties WHERE id=?').get(id)
    db2.close()
    return NextResponse.json(prop)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}