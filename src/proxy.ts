import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// Optimistic UX redirect only: it checks that a session cookie EXISTS, not that it
// is valid. Real authorization happens server-side in lib/admin.ts (getAdminSession).
export function proxy(request: NextRequest) {
  const session = getSessionCookie(request)

  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
