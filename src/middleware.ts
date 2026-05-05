import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Users: { username: password }
// Add users here or define them all in DASHBOARD_USERS env var as JSON:
// e.g. '{"joe":"pass1","sarah":"pass2"}'
function getUsers(): Record<string, string> {
  const fromEnv = process.env.DASHBOARD_USERS
  if (fromEnv) {
    try { return JSON.parse(fromEnv) } catch { /* fall through */ }
  }
  return {
    [process.env.DASHBOARD_USER  || 'joe']:   process.env.DASHBOARD_PASSWORD  || 'djRG-dcw_4IiyzbGqn5Tnw',
    [process.env.DASHBOARD_USER2 || 'sarah']: process.env.DASHBOARD_PASSWORD2 || '',
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/dashboard-data')) {
    const authHeader = req.headers.get('authorization')

    if (authHeader) {
      const [scheme, encoded] = authHeader.split(' ')
      if (scheme === 'Basic' && encoded) {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
        const colonIdx = decoded.indexOf(':')
        if (colonIdx > 0) {
          const user = decoded.slice(0, colonIdx)
          const pass = decoded.slice(colonIdx + 1)
          const users = getUsers()
          const validPass = users[user]
          if (validPass && pass === validPass) {
            // Attach username as header so dashboard can greet by name
            const res = NextResponse.next()
            res.headers.set('x-dashboard-user', user)
            return res
          }
        }
      }
    }

    return new NextResponse('Access denied', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="YOS Dashboard", charset="UTF-8"' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/api/dashboard-data'],
}
