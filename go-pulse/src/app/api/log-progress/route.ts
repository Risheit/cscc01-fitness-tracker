import { NextResponse } from "next/server";
import pool from "@/app/db/database";
import checkAuth from '../check-auth/CheckAuth';

export async function POST(req: Request) {
  try {
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authData.userId;
    const { exercise_name, weight_lbs, sets, reps } = await req.json();

    if (!exercise_name || !weight_lbs || !sets || !reps) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO exercise_progress (user_id, exercise_name, weight_lbs, sets, reps) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, exercise_name, weight_lbs, sets, reps]
    );

    return NextResponse.json({ message: "Workout logged successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Log Progress Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
