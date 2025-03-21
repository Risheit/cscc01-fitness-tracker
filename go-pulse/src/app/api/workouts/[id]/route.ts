import { NextResponse } from 'next/server';
import pool from '@/app/db/database'; // Use your existing database pool
import { checkAuth } from '../../check-auth/route';

export async function GET(req: Request) {
  try {
    const id = 0;

    // Call check-auth endpoint to verify user authentication and get userId
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = authData.userId; // Get userId from check-auth response

    // Get workout info
    const workoutResult = await pool.query(
      'SELECT id, name FROM workouts WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (workoutResult.rows.length === 0) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    const workout = workoutResult.rows[0];

    // Get workout days
    const daysResult = await pool.query(
      'SELECT id, day_of_week FROM workout_days WHERE workout_id = $1',
      [id]
    );

    const days = await Promise.all(
      daysResult.rows.map(async (day) => {
        const exercisesResult = await pool.query(
          `SELECT name, exercise_type, sets, reps, mins, weight, position, description 
           FROM workout_exercises 
           WHERE workout_day_id = $1 
           ORDER BY position ASC`,
          [day.id]
        );

        return {
          day_of_week: day.day_of_week,
          exercises: exercisesResult.rows,
        };
      })
    );

    return NextResponse.json({ ...workout, days }, { status: 200 });
  } catch (error) {
    console.error('Fetch Workout Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
