export default interface ExerciseData {
  name: string;
  description: string;
  imagePath: string;
  video_id?: string;
  type: 'Timed' | 'Sets';
  mins?: number;
  sets?: number;
  reps?: number;
}

export type WorkoutState = 'start' | 'paused' | 'running' | 'end';