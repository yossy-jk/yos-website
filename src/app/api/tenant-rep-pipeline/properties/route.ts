import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const db = require('/Users/yourofficespace-main/.openclaw/tenant-rep/tenant-rep.py')
    // Use direct sqlite
    const sqlite3 = require('better-sqlite3')
    const db2 = sqlite3('/Users/yourofficespace-main/.openclaw/tenant-rep/data/pipeline.db')
    const props = db2.prepare('SELECT * FROM properties ORDER BY updated_at DESC').all()
    db2.close()
    return NextResponse.json(props)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const body = await req.json()
    const sqlite3 = require('better-sqlite3')
    const db2 = sqlite3('/Users/yourofficespace-main/.openclaw/tenant-rep/data/pipeline.db')
    const id = require('crypto').randomUUID().replace(/-/g,'').slice(0,12)
    const now = new Date().toISOString()
    db2.prepare("INSERT INTO properties (id,client_id,address,suburb,size_sqm,asking_rent,outgoings,stage,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)").run(id, body.client_id||'', body.address||'', body.suburb||'', body.size_sqm||null, body.asking_rent||null, body.outgoings||null, 'Evaluation', body.notes||'', now, now)
    const prop = db2.prepare('SELECT * FROM properties WHERE id=?').get(id)
    db2.close()
    return NextResponse.json(prop, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}