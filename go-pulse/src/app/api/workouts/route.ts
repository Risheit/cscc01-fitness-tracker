import { NextResponse } from 'next/server';
import { getAllWorkoutPlans } from '@/app/models/Workout';
import pool from '@/app/db/database';
import { checkAuth } from '../check-auth/route';

export async function POST(req: Request) {
  try {
    const { name, days } = await req.json(); // Days should be an array like ["Monday", "Wednesday"]

    // Call check-auth endpoint to verify user authentication and get userId
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authData.userId; // Get userId from check-auth response

    // Insert workout
    const workoutResult = await pool.query(
      'INSERT INTO workouts (user_id, name) VALUES ($1, $2) RETURNING id',
      [userId, name]
    );

    const workoutId = workoutResult.rows[0].id;

    // Insert workout days
    const dayValues = days
      .map((day: string) => `('${day}', ${workoutId})`)
      .join(',');
    await pool.query(
      `INSERT INTO workout_days (day_of_week, workout_id) VALUES ${dayValues}`
    );

    return NextResponse.json(
      { workout_id: workoutId, message: 'Workout plan created' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Workout Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Call check-auth endpoint to verify user authentication and get userId
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const result = await getAllWorkoutPlans();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
