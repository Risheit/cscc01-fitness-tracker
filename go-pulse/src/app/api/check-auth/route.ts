import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: number; username: string };
    return NextResponse.json(
      { authenticated: true, userId: decoded.userId, username: decoded.username },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
