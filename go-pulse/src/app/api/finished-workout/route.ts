import { NextResponse } from 'next/server';
import pool from '../../db/database'; // Ensure correct import path

// Function to check authentication status and get userId by calling check-auth route
async function checkAuth(req: Request) {
  const response = await fetch(`http://localhost:3000/api/check-auth`, {
    headers: req.headers, // Pass the headers (including cookie)
  });
  const data = await response.json();
  return data; // Contains both `authenticated` and `userId`
}

export async function POST(req: Request) {
  try {
    const {exerciseName } = await req.json();

    // Call check-auth endpoint to verify user authentication and get userId
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = authData.userId; // Get userId from check-auth response


    if (!userId || !exerciseName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into the database
    await pool.query(
      `INSERT INTO finished_exercises (user_id, exercise_name) 
       VALUES ($1, $2)`,
      [userId, exerciseName]
    );

    return NextResponse.json({ message: 'Exercise logged successfully' }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to log exercise' }, { status: 500 });
  }
}
