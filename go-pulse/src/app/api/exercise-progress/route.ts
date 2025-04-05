import { NextResponse } from "next/server";
import pool from "@/app/db/database";
import checkAuth from '../check-auth/CheckAuth';

export async function GET(req: Request) {
  try {
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authData.userId;
    const url = new URL(req.url);
    const exerciseName = url.searchParams.get("exercise");

    if (!exerciseName) {
      return NextResponse.json({ error: "Exercise name is required" }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT weight_lbs, recorded_at FROM exercise_progress 
       WHERE user_id = $1 AND exercise_name = $2
       ORDER BY recorded_at ASC`,
      [userId, exerciseName]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching exercise progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
