import { NextResponse } from "next/server";
import pool from "../../db/database";
import checkAuth from '../check-auth/CheckAuth';

export async function POST(req: Request) {
   try {
    const session = await checkAuth(req);
    console.log("Auth session:", session);

    if (!session?.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Incoming workout POST body:", body);

    const { startTime, endTime, workoutId } = body;

  
    const result = await pool.query(
      `INSERT INTO workout_times (user_id, workout_id, start_time, end_time)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [session.userId, workoutId, startTime, endTime]
    );

    return NextResponse.json({ message: "Workout time logged", data: result.rows[0] });
  } catch (err) {
    console.error(" Failed to insert workout time:", err);
    return NextResponse.json({ error: "Failed to log workout" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await checkAuth(req);
  console.log("Auth session:", session);

  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await pool.query(
        `SELECT w.name AS workout_name, EXTRACT(EPOCH FROM wt.duration)::int AS duration
         FROM workout_times wt
         JOIN workouts w ON wt.workout_id = w.id
         WHERE wt.user_id = $1
         ORDER BY wt.end_time DESC`,
        [session.userId]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}
