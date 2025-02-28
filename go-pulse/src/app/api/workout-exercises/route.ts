import { NextResponse } from "next/server";
import pool from "@/app/db/database"; // Use your existing database pool

// Function to check authentication status and get userId by calling check-auth route
async function checkAuth(req: Request) {
  const response = await fetch(`${process.env.BASE_URL}/api/check-auth`, {
    headers: req.headers, // Pass the headers (including cookie)
  });
  const data = await response.json();
  return data; // Contains both `authenticated` and `userId`
}

export async function POST(req: Request) {
  try {
    const { workout_id, day_of_week, name, sets, reps, weight, rest_time } = await req.json();

    // Call check-auth endpoint to verify user authentication and get userId
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = authData.userId; // Get userId from check-auth response

    // Get `workout_day_id` for this workout and day
    const dayResult = await pool.query(
      "SELECT id FROM workout_days WHERE workout_id = $1 AND day_of_week = $2",
      [workout_id, day_of_week]
    );

    if (dayResult.rows.length === 0) {
      return NextResponse.json({ error: "Invalid workout or day" }, { status: 400 });
    }

    const workout_day_id = dayResult.rows[0].id;

    // Insert exercise into workout_exercises table
    await pool.query(
      "INSERT INTO workout_exercises (workout_id, workout_day_id, name, sets, reps, weight, rest_time) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [workout_id, workout_day_id, name, sets, reps, weight, rest_time]
    );

    return NextResponse.json({ message: "Exercise added to workout day" }, { status: 201 });
  } catch (error) {
    console.error("Add Exercise Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
