/**
 * GET /api/auth/gsc/callback?code=...
 * Exchanges auth code for refresh token, then displays it so Joe can save it as GSC_REFRESH_TOKEN env var.
 */
import { NextResponse } from 'next/server'

const CLIENT_ID     = process.env.GSC_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GSC_CLIENT_SECRET || ''
const REDIRECT_URI  = 'https://www.yourofficespace.au/api/auth/gsc/callback'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return new Response(`OAuth error: ${error}`, { status: 400, headers: { 'Content-Type': 'text/plain' } })
  }
  if (!code) {
    return new Response('No code received', { status: 400 })
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri:  REDIRECT_URI,
      grant_type:    'authorization_code',
    }),
  })

  const data = await res.json() as { refresh_token?: string; error?: string; error_description?: string }

  if (data.error || !data.refresh_token) {
    return new Response(
      `Token exchange failed: ${data.error} — ${data.error_description}`,
      { status: 400, headers: { 'Content-Type': 'text/plain' } }
    )
  }

  // Display refresh token for Joe to save — styled page
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>GSC Connected</title>
<style>
  body { background: #0a0a0a; color: white; font-family: system-ui, sans-serif; padding: 3rem; max-width: 640px; margin: 0 auto; }
  h1 { color: #00B5A5; font-size: 1.5rem; margin-bottom: 0.5rem; }
  p { color: rgba(255,255,255,0.7); line-height: 1.7; }
  code { background: rgba(255,255,255,0.08); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9rem; word-break: break-all; }
  .token-box { background: rgba(0,181,165,0.08); border: 1px solid rgba(0,181,165,0.3); padding: 1.25rem; margin: 1.5rem 0; border-radius: 6px; }
  .steps { background: rgba(255,255,255,0.04); padding: 1.25rem; border-radius: 6px; }
  .steps ol { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .steps li { margin-bottom: 0.5rem; color: rgba(255,255,255,0.8); font-size: 0.9rem; }
  button { background: #00B5A5; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem; margin-top: 0.75rem; }
</style>
</head>
<body>
  <h1>✓ Google Search Console connected</h1>
  <p>Copy the refresh token below and send it to YOS (your OpenClaw assistant) — it will save it as <code>GSC_REFRESH_TOKEN</code> in Vercel automatically.</p>

  <div class="token-box">
    <p style="margin:0 0 0.5rem; color: #00B5A5; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Refresh Token</p>
    <code id="token">${data.refresh_token}</code>
    <br>
    <button onclick="navigator.clipboard.writeText(document.getElementById('token').textContent); this.textContent='Copied!'">Copy to clipboard</button>
  </div>

  <div class="steps">
    <p style="margin:0; font-weight:600;">What to do next:</p>
    <ol>
      <li>Copy the token above</li>
      <li>Send it to YOS in Telegram: <strong>GSC refresh token: [paste here]</strong></li>
      <li>YOS will save it and live rankings will appear in the SEO dashboard within 60 seconds</li>
    </ol>
  </div>
</body>
</html>`

  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
}
