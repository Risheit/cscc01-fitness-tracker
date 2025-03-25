export interface NinjaApiExercise {
  name: string;
  muscle: string;
  type:
    | 'cardio'
    | 'olympic_weightlifting'
    | 'plyometric'
    | 'powerlifting'
    | 'strength'
    | 'stretching'
    | 'strongman';
  equipment: string;
  difficulty: string;
  instructions: string;
}

export interface SelectedExercise extends NinjaApiExercise {
  sets: number | string;
  reps: number | string;
}

export interface Day {
  day: string;
  exercises: SelectedExercise[];
}

export async function fetchNinjaExercises(
  muscleGroup: string,
  exerciseType: string,
  difficulty: string,
  search: string
) {
  let url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscleGroup}&type=${exerciseType}&difficulty=${difficulty}`;

  if (search) {
    url += `&name=${search}`;
  }

  const response = await fetch(url, {
    headers: { 'X-Api-Key': process.env.NEXT_PUBLIC_NINJA_API_KEY },
  });

  const data: NinjaApiExercise[] = await response.json();

  // The API sometimes returns duplicate responses. This gets rid of those duplicates
  const uniqueExercises = Array.from(
    new Map(
      data.map((exercise: NinjaApiExercise) => [exercise.name, exercise])
    ).values()
  );

  return uniqueExercises;
}

export async function createWorkout(
  name: string,
  days: string[]
): Promise<number> {
  const res = await fetch('/api/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, days }),
  });

  const workout = await res.json();
  return workout.workoutId;
}

export async function addExerciseToWorkout(
  workoutId: number,
  day: Day,
  exercise: SelectedExercise,
  position: number
) {
  await fetch(`/api/workout-exercises`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workout_id: workoutId,
      day_of_week: day.day,
      name: exercise.name,
      exercise_type: exercise.type,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: null,
      rest_time: 60,
      position: position,
      description: exercise.instructions || '',
    }),
  });
}
