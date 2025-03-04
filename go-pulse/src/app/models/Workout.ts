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
    e.description,
    e.video_id AS "videoId",
    e.image_path AS "imagePath",
    workout_type AS "type",
    mins,
    sets,
    reps
  FROM workout AS w JOIN exercises AS e ON w.exercise = e.name
  WHERE plan = $1
  ORDER BY w.position ASC`,
    [planId]);
  
  console.log(rows);

  return rows;
}