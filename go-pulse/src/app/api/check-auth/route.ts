import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export interface AuthResponse {
  authenticated: boolean;
  userId?: number;
}

// Function to check authentication status and get userId by calling check-auth route
export async function checkAuth(req: Request) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/check-auth`, {
    headers: req.headers, // Pass the headers (including cookie)
  });
  return response.json() as Promise<AuthResponse>;
}

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: number };
    return NextResponse.json({ authenticated: true, userId: decoded.userId}, { status: 200 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
