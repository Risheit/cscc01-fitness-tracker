import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export interface AuthResponse {
  authenticated: boolean;
  userId?: number;
}

export async function GET(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: number };
    console.log(decoded);
    if (decoded.userId === 1)
      return NextResponse.json(
        { authenticated: true, userId: decoded.userId },
        { status: 200 }
      );
    else return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
