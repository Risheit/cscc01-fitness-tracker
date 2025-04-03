import { NextResponse } from 'next/server';
import pool from '@/app/db/database'; // Use your existing database pool
import checkAuth from '../check-auth/CheckAuth';
import { addExercise } from '@/app/models/Workout';

interface AddExerciseRequest {
  workout_id: number;
  day_of_week: string;
  time: number;
  name: string;
  exercise_type: string;
  sets?: number;
  reps?: number;
  mins?: number;
  weight?: number;
  rest_time?: number;
  position: number;
  description: string;
}

export async function POST(req: Request) {
  try {
    const {
      workout_id,
      day_of_week,
      time,
      name,
      exercise_type,
      sets,
      reps,
      mins,
      weight,
      position,
      description,
    }: AddExerciseRequest = await req.json();

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
      'SELECT id FROM workout_days WHERE workout_id = $1 AND day_of_week = $2 AND time = $3',
      [workout_id, day_of_week, time]
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

    // Insert exercise into exercises table if it is new
    addExercise({ name, description });

    // Insert exercise into workout_exercises table
    await pool.query(
      `INSERT INTO workout_exercises
      (workout_id,
      workout_day_id,
      name,
      exercise_type,
      sets,
      reps,
      mins,
      weight,
      position,
      description)
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

export async function UPDATE(req: Request) {
  try {
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id, time }: { id: number; time: number } = await req.json();
    if (!id || !time) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE workout_days
      SET time = $1
      WHERE id = $2
      RETURNING *`,
      [time, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No workout day found with the given ID' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Workout day updated successfully',
        updatedRow: result.rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update Exercise Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id }: { id: number } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM workout_days WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No workout day found with the given ID' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Workout day deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete Exercise Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
