/**
 * POST /api/blog-rewrite-now
 * Triggers the blog-rewriter automation job immediately.
 * Called by the "Rewrite" button in the Approvals tab dashboard.
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response

  try {
    const { stdout, stderr } = await execAsync(
      '/opt/homebrew/bin/python3 /Users/yourofficespace-main/.openclaw/tools/yos_run_job.py blog-rewriter --force',
      {
        timeout: 30000,
        env: {
          ...process.env,
          PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin',
        },
      }
    )
    return NextResponse.json({
      ok: true,
      message: 'Blog rewriter triggered — rewrites will appear in Approvals tab within 5 minutes',
      output: stdout.trim(),
    })
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: err instanceof Error ? err.message : 'Failed to trigger rewriter',
    }, { status: 500 })
  }
}
