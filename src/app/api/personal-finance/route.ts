import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)
export const dynamic = 'force-dynamic'
export const revalidate = 0
export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  try {
    const { stdout } = await execAsync('/usr/bin/python3 ~/.openclaw/tools/pf_bills_cashflow.py')
    const d = JSON.parse(stdout)
    return NextResponse.json(d)
  } catch {
    return NextResponse.json(null)
  }
}
