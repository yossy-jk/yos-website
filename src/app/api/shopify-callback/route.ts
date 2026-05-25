import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const shop = searchParams.get('shop')

  if (!code || !shop) {
    return NextResponse.json({ error: 'Missing code or shop' }, { status: 400 })
  }

  // Save code to temp file for agent to pick up
  const fs = await import('fs')
  const tmpPath = '/tmp/shopify-softwiring-auth-code.txt'
  fs.writeFileSync(tmpPath, JSON.stringify({ code, shop, state, timestamp: Date.now() }))

  return NextResponse.redirect(
    new URL(`/?shopify_callback=success&shop=${shop}`, request.url),
    302
  )
}