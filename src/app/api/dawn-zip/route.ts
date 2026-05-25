import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = join(process.cwd(), '..', '..', 'tmp', 'dawn_theme.zip');
    const file = await readFile(filePath);
    
    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="dawn_theme.zip"',
        'Content-Length': String(file.length),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Failed to serve dawn_theme.zip:', err);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
