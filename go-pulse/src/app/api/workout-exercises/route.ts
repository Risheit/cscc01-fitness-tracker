import { NextResponse } from 'next/server';
import pool from '@/app/db/database'; // Use your existing database pool
import checkAuth from '../check-auth/CheckAuth';

export async function POST(req: Request) {
  try {
    const {
      workout_id,
      day_of_week,
      name,
      exercise_type,
      sets,
      reps,
      mins,
      weight,
      position,
      description,
    } = await req.json();

    // Call check-auth endpoint to verify user authentication and get userId
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get `workout_day_id` for this workout and day
    const dayResult = await pool.query(
      'SELECT id FROM workout_days WHERE workout_id = $1 AND day_of_week = $2',
      [workout_id, day_of_week]
    );

    if (dayResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid workout or day' },
        { status: 400 }
      );
    }

    const workout_day_id = dayResult.rows[0].id;

    // Convert API exercise types into "Timed" or "Sets"
    const typeMapping: Record<string, 'Timed' | 'Sets'> = {
      cardio: 'Timed',
      olympic_weightlifting: 'Sets',
      plyometrics: 'Sets',
      powerlifting: 'Sets',
      strength: 'Sets',
      stretching: 'Sets',
      strongman: 'Sets',
    };

    const mappedType = typeMapping[exercise_type as keyof typeof typeMapping];

    if (!mappedType) {
      console.log('Invalid exercise type');
      return NextResponse.json(
        { error: 'Invalid exercise type' },
        { status: 400 }
      );
    }

    // Validate required fields based on "Timed" or "Sets"
    if (mappedType === 'Timed' && mins == null) {
      console.log("Timed exercises must include 'mins'");
      return NextResponse.json(
        { error: "Timed exercises must include 'mins'" },
        { status: 400 }
      );
    }

    if (mappedType === 'Sets' && (sets == null || reps == null)) {
      console.log("Sets-based exercises must include 'sets' and 'reps'");
      return NextResponse.json(
        { error: "Sets-based exercises must include 'sets' and 'reps'" },
        { status: 400 }
      );
    }

    if (position <= 0) {
      console.log('Position must be greater than 0');
      return NextResponse.json(
        { error: 'Position must be greater than 0' },
        { status: 400 }
      );
    }

    // Insert exercise into workout_exercises table
    await pool.query(
      `INSERT INTO workout_exercises (workout_id, workout_day_id, name, exercise_type, sets, reps, mins, weight, position, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        workout_id,
        workout_day_id,
        name,
        mappedType,
        sets,
        reps,
        mins,
        weight,
        position,
        description,
      ]
    );

    return NextResponse.json(
      { message: 'Exercise added to workout day' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add Exercise Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
