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
}

export interface WorkoutScheduleItem {
  id: number;
  userId: number;
  name: string;
  imagePath: string;
  day: string;
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
    w.reps
  FROM workout_exercises AS w INNER JOIN exercises AS e ON w.name = e.name
  WHERE workout_id = $1
  ORDER BY w.position ASC`,
    [planId]
  );

  return rows;
}

export async function getUserWorkouts(userId: number): Promise<WorkoutScheduleItem[]> {
  const { rows } = await pool.query(`SELECT 
    w.id,
    w.user_id AS userId,
    w.name,
    w.image_path AS imagePath,
    d.day_of_week AS day
    FROM workouts AS w JOIN workout_days AS d
    ON w.id = d.workout_id
    WHERE w.user_id = $1`,
    [userId]);
  
  return rows;
}