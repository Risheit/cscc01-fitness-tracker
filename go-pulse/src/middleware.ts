import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const isUser = await fetch(new URL('/api/check-auth', req.url), {
    headers: { Cookie: (await cookies()).toString() },
    credentials: 'include',
  });

  if (isUser.ok) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Apply to all pages except API routes and static assets
export const config = {
  matcher: ['/((?!api|login|register|_next|static|favicon.ico).*)'],
};
