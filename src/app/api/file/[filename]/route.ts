/**
 * GET /api/file/[filename]
 *
 * Validates a signed download token and streams the requested file.
 * The token format is: base64url(`${filename}:${expiresAt}`).base64url(HMAC-SHA256)
 * Files are served from /public/ only — path traversal is blocked.
 */
import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { validateDownloadToken } from '@/lib/download-token.mjs'

const ALLOWED_FILES: Record<string, string> = {
  'YOS-Capability-Statement.pdf': 'YOS-Capability-Statement.pdf',
}

const SIGNING_SECRET = process.env.DOWNLOAD_SIGNING_SECRET

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const token = req.nextUrl.searchParams.get('t')

  if (!SIGNING_SECRET) {
    return NextResponse.json({ error: 'Download service not configured' }, { status: 503 })
  }

  // Validate token
  if (!token || !validateDownloadToken(token, filename, SIGNING_SECRET)) {
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
