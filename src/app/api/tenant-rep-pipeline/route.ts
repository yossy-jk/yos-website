import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-v2'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'

const DB = '/Users/yourofficespace-main/.openclaw/tenant-rep/data/pipeline.db'

function getDb() {
  const { init } = require('better-sqlite3')
  return init(DB)
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const db = getDb()
    const clients = db.prepare('SELECT * FROM clients ORDER BY updated_at DESC').all()
    db.close()
    return NextResponse.json(clients)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const body = await req.json()
    const db = getDb()
    const id = require('crypto').randomUUID().replace(/-/g,'').slice(0,12)
    const now = new Date().toISOString()
    db.prepare("INSERT INTO clients (id,name,email,phone,brief_summary,created_at,updated_at) VALUES (?,?,?,?,?,?,?)").run(id, body.name||'', body.email||'', body.phone||'', body.brief_summary||'', now, now)
    const client = db.prepare('SELECT * FROM clients WHERE id=?').get(id)
    db.close()
    return NextResponse.json(client, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}