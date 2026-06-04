/**
 * GET /api/tenant-rep/brief/[token]
 * Returns brief data for a given share token.
 * Checks expiry and optional password.
 * 
 * Query params:
 *   password — required if token is password-protected
 */

import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL  || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

function getRedis(): Redis | null {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  return new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const r = getRedis()
  if (!r) return NextResponse.json({ error: 'Service unavailable' }, { status: 500 })

  const storeKey = `tenant-rep:token:${token}`
  const raw = await r.get<string>(storeKey)

  if (!raw) {
    return NextResponse.json({ error: 'Link not found or expired' }, { status: 404 })
  }

  const payload = JSON.parse(raw)

  // Check expiry
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = Math.floor(new Date(payload.expires_at).getTime() / 1000)
  if (now > expiresAt) {
    await r.del(storeKey)
    return NextResponse.json({ error: 'This link has expired' }, { status: 410 })
  }

  // Password check
  const url = new URL(req.url)
  const providedPassword = url.searchParams.get('password')

  if (payload.password_hash) {
    if (!providedPassword) {
      return NextResponse.json({ requires_password: true }, { status: 401 })
    }
    if (!bcrypt.compareSync(providedPassword, payload.password_hash)) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }
  }

  // Load brief from filesystem (written by Tenant Rep agent)
  const briefPath = `/Users/yourofficespace-main/.openclaw/tenant-rep/clients/${payload.client_id}/brief.md`
  let briefContent = ''
  try {
    briefContent = fs.readFileSync(briefPath, 'utf8')
  } catch {
    briefContent = 'Brief data is being prepared. Check back shortly.'
  }

  // Load pipeline data for this client
  const pipelinePath = '/Users/yourofficespace-main/.openclaw/tenant-rep/PIPELINE.md'
  let pipelineContent = ''
  try {
    pipelineContent = fs.readFileSync(pipelinePath, 'utf8')
  } catch {
    pipelineContent = ''
  }

  return NextResponse.json({
    client_id: payload.client_id,
    brief: briefContent,
    pipeline: pipelineContent,
    expires_at: payload.expires_at,
    password_protected: !!payload.password_hash,
  })
}