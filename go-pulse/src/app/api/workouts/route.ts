import { NextResponse } from 'next/server';
import { getUserWorkouts } from '@/app/models/Workout';
import pool from '@/app/db/database';
import checkAuth from '../check-auth/CheckAuth';
import { Day } from '@/app/models/Ninja';

export async function POST(req: Request) {
  try {
    const { name, days }: { name: string; days: Day[] } = await req.json();

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
      "INSERT INTO workouts (user_id, name, image_path) VALUES ($1, $2, '/stock-running.jpg') RETURNING id",
      [userId, name]
    );

    const workoutId = workoutResult.rows[0].id;

    // Insert workout days
    const dayValues = days
      .map((day) => `('${day.day}', ${workoutId}, ${day.time})`)
      .join(',');
    await pool.query(
      `INSERT INTO workout_days (day_of_week, workout_id, time) VALUES ${dayValues}`
    );

    return NextResponse.json(
      { workoutId: workoutId, message: 'Workout plan created' },
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

export async function PATCH(req: Request) {
  console.log('Update Workout');
  try {
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { workoutId, dayOfWeek, time } = await req.json();
    if (!workoutId || !dayOfWeek || !time) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Check if workout is already scheduled at the given time
    const existingWorkout = await pool.query(
      `SELECT * FROM workout_days WHERE day_of_week = $1 AND time = $2`,
      [dayOfWeek, time]
    );

    if (existingWorkout.rows.length > 0) {
      return NextResponse.json(
        { error: 'Workout already scheduled at this time' },
        { status: 409 }
      );
    }

    // Insert workout days
    await pool.query(
      `INSERT INTO workout_days (day_of_week, workout_id, time) VALUES ($1, $2, $3)`,
      [dayOfWeek, workoutId, time]
    );

    return NextResponse.json(
      { workoutId: workoutId, message: 'Workout updated' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Update Workout Error:', error);
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

    const result = await getUserWorkouts(authData.userId!);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Database query failed:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
