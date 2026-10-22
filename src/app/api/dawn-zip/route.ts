import { requireAuth } from '@/lib/auth'
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  try {
    const filePath = join(process.cwd(), '..', '..', 'tmp', 'dawn_theme.zip');
    const file = await readFile(filePath);
    
    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="dawn_theme.zip"',
        'Content-Length': String(file.length),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('Failed to serve dawn_theme.zip:', err);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
