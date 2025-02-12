export default interface ExerciseData {
  exerciseName: string;
  exerciseDescription: string;
  exerciseImagePath: string;
  exerciseType: 'Timed' | 'Sets';
  mins?: number;
  sets?: number;
  reps?: number;
}
