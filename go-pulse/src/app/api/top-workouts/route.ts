import { NextResponse } from 'next/server';
import pool from '../../db/database';
import checkAuth from '../check-auth/CheckAuth';

export async function GET(req: Request) {
  try {


    // Call check-auth endpoint to verify user authentication and get userId
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = authData.userId; // Get userId from check-auth response

    const result = await pool.query(
      `
      SELECT exercise_name, COUNT(*) as count
      FROM finished_exercises
      WHERE user_id = $1
      GROUP BY exercise_name
      ORDER BY count DESC
      LIMIT 10;
      `,
      [userId]
    );

    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error('Error fetching top workouts:', error);
    return NextResponse.json(
      { message: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}