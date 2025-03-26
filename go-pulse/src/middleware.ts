import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function middleware() {
  const res = await fetch(`${process.env.URL}/api/check-auth`, {
    headers: { Cookie: (await cookies()).toString() },
    credentials: 'include',
  });

  if (res.ok) {
    console.log('success');
    return NextResponse.next();
  } else {
    console.log('failed');
    return NextResponse.redirect(`${process.env.URL}/login`);
  }
}

// Apply to all pages except API routes and static assets
export const config = {
  matcher: ['/((?!api|login|register|_next|static|favicon.ico).*)'],
};
