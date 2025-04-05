import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/db/database";
import checkAuth from '../check-auth/CheckAuth';

export async function GET(req: NextRequest) {
  // Authenticate user
  const authData = await checkAuth(req);
  if (!authData.authenticated) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const userId = authData.userId;

  try {
    // Fetch distinct exercises for the user
    const { rows } = await pool.query(
      `SELECT DISTINCT exercise_name FROM exercise_progress WHERE user_id = $1 ORDER BY exercise_name`,
      [userId]
    );

    // Return exercise names as an array
    return NextResponse.json(rows.map((row) => row.exercise_name));
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
