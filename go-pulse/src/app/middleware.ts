import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Allow access to login and register pages
  if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") {
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply to all pages except API routes and static assets
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
