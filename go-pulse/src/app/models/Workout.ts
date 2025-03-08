import pool from "../db/database";

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

export type WorkoutState = 'start' | 'paused' | 'running' | 'end';

export async function getWorkoutPlan(planId: number): Promise<ExerciseData[]> {
  if (planId < 0)
    return [];

  const { rows } = await pool.query(
  `SELECT
    w.position,
    e.name,
    w.description,
    e.video_id AS "videoId",
    e.image_path AS "imagePath",
    exercise_type AS "type",
    mins,
    sets,
    reps
  FROM workout_exercises AS w INNER JOIN exercises AS e ON w.name = e.name
  WHERE workout_id = $1
  ORDER BY w.position ASC`,
    [planId]);
  
  console.log(rows);

  return rows;
}