import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = (await import('@/lib/auth-v2')).getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { id } = await params
  try {
    const body = await req.json()
    const sqlite3 = require('better-sqlite3')
    const db2 = sqlite3('/Users/yourofficespace-main/.openclaw/tenant-rep/data/pipeline.db')
    const now = new Date().toISOString()
    if (body.stage) {
      db2.prepare('UPDATE properties SET stage=?,updated_at=? WHERE id=?').run(body.stage, now, id)
    }
    if (body.notes !== undefined) {
      const prev = db2.prepare('SELECT notes FROM properties WHERE id=?').get(id)
      const prevNote = prev?.notes ? prev.notes + '\n' : ''
      db2.prepare('UPDATE properties SET notes=?,updated_at=? WHERE id=?').run(prevNote + '[' + now.slice(0,16) + '] ' + body.notes, now, id)
    }
    if (body.disqualified_reason !== undefined) {
      db2.prepare('UPDATE properties SET disqualified_reason=?,stage=?,updated_at=? WHERE id=?').run(body.disqualified_reason, 'Disqualified', now, id)
    }
    const prop = db2.prepare('SELECT * FROM properties WHERE id=?').get(id)
    db2.close()
    return NextResponse.json(prop)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}