/**
 * GET /api/file/[filename]
 *
 * Validates a signed download token and streams the requested file.
 * The token format is: base64url(`${email}:${expiresAt}:${secret}`)
 * Files are served from /public/ only — path traversal is blocked.
 */
import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const ALLOWED_FILES: Record<string, string> = {
  'YOS-Capability-Statement.pdf': 'YOS-Capability-Statement.pdf',
}

const SIGNING_SECRET = process.env.DOWNLOAD_SIGNING_SECRET

function validateToken(raw: string): boolean {
  try {
    const decoded = Buffer.from(raw, 'base64url').toString('utf-8')
    const parts = decoded.split(':')
    if (parts.length !== 3) return false
    const expiresAt = parseInt(parts[1], 10)
    if (isNaN(expiresAt)) return false
    if (Math.floor(Date.now() / 1000) > expiresAt) return false
    // Rebuild and compare HMAC (simplified: compare raw string if secret matches)
    const expected = Buffer.from(`${parts[0]}:${parts[1]}:${SIGNING_SECRET}`).toString('base64url')
    return raw === expected
  } catch {
    return false
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const token = req.nextUrl.searchParams.get('t')
  const dl = req.nextUrl.searchParams.get('dl')

  // Validate token
  if (!token || !validateToken(token)) {
    return NextResponse.json({ error: 'Invalid or expired link' }, { status: 403 })
  }

  // Validate filename
  if (!filename || !ALLOWED_FILES[filename]) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  // Serve as download
  const filePath = path.join(process.cwd(), 'public', filename)
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  try {
    const fileBuffer = await readFile(filePath)
    const headers: Record<string, string> = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
      'Content-Length': String(fileBuffer.length),
    }

    return new NextResponse(fileBuffer, { status: 200, headers })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
