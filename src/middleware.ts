import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from 'next-auth/middleware'
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl
  if (token &&
    (
      url.pathname === '/' || 
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up')
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if(!token && url.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/',
    '/:username/edit-profile',
    '/create-post',
    "/create-reel",
    "/create-story",
    "/messages",
    "/saved",
    "/notifications",
  ],
}
