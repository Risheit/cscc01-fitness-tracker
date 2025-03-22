import pool from '../db/database';

export interface WorkoutPlan {
  id: number;
  name: string;
  imagePath?: string;
}

export interface ExerciseData {
  name: string;
  description: string;
  imagePath: string;
  videoId?: string;
  type: 'Timed' | 'Sets';
  mins?: number;
  sets?: number;
  reps?: number;
  dayOfWeek?: string; // Add dayOfWeek to the interface
}

export type WorkoutState = 'start' | 'paused' | 'running' | 'end';

export async function getAllWorkoutPlans(): Promise<WorkoutPlan[]> {
  const { rows } = await pool.query(
    'SELECT id, name, image_path AS "imagePath" FROM workouts'
  );

  return rows;
}

export async function getWorkoutPlan(planId: number): Promise<ExerciseData[]> {
  if (planId < 0) return [];

  const { rows } = await pool.query(
    `SELECT
    w.position,
    e.name,
    w.description,
    e.video_id AS "videoId",
    e.image_path AS "imagePath",
    w.exercise_type AS "type",
    w.mins,
    w.sets,
    w.reps,
    wd.day_of_week AS "dayOfWeek" -- Include day_of_week in the query
  FROM workout_exercises AS w
  INNER JOIN exercises AS e ON w.name = e.name
  INNER JOIN workout_days AS wd ON w.workout_day_id = wd.id
  WHERE w.workout_id = $1
  ORDER BY w.position ASC`,
    [planId]
  );

  return rows;
}