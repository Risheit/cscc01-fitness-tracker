import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function middleware() {
  const baseUrl = process.env.URL || "http://localhost:3000"; // Fallback in case it's undefined

  const res = await fetch(`${baseUrl}/api/check-auth`, {
    headers: { Cookie: (await cookies()).toString() },
    credentials: 'include',
  });

  if (res.ok) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(`${baseUrl}/login`);
  }
}

// Apply to all pages except API routes and static assets
export const config = {
  matcher: ['/((?!api|login|register|_next|static|favicon.ico).*)'],
};
