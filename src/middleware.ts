import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /dashboard and /api/dashboard-data
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/dashboard-data')) {
    const authHeader = req.headers.get('authorization')

    if (authHeader) {
      const [scheme, encoded] = authHeader.split(' ')
      if (scheme === 'Basic' && encoded) {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
        const [user, pass] = decoded.split(':')
        const validUser = process.env.DASHBOARD_USER || 'joe'
        const validPass = process.env.DASHBOARD_PASSWORD || 'djRG-dcw_4IiyzbGqn5Tnw'
        if (user === validUser && pass === validPass) {
          return NextResponse.next()
        }
      }
    }

    return new NextResponse('Access denied', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="YOS Dashboard", charset="UTF-8"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/api/dashboard-data'],
}
