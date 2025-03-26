import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('req', req);
  console.log('reqUrl', req.url);
  console.log('redirect url', new URL('/api/check-auth', req.url));

  const res = await fetch(new URL('/api/check-auth', req.url), {
    headers: { Cookie: (await cookies()).toString() },
    credentials: 'include',
  });

  if (res.ok) {
    console.log('success');
    return NextResponse.next();
  } else {
    console.log('failed');
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Apply to all pages except API routes and static assets
export const config = {
  matcher: ['/((?!api|login|register|_next|static|favicon.ico).*)'],
};
