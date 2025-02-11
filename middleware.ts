import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add CSP headers
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://www.figma.com https://embed.figma.com"
  )

  // Add X-Frame-Options header
  response.headers.set('X-Frame-Options', 'ALLOW-FROM https://www.figma.com')

  return response
}

export const config = {
  matcher: '/:path*',
}