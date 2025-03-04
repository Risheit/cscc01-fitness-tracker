import { getWorkoutPlan } from '@/app/models/Workout';
import ExerciseScreen from './components/ExerciseScreen';
import { notFound } from 'next/navigation';

export default async function WorkoutPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const paramsId = parseInt((await searchParams)?.id ?? '-1', 10);
  const cleanId = Number.isNaN(paramsId) ? -1 : paramsId;
  const data = await getWorkoutPlan(cleanId);

  if (!data || data.length === 0) {
    notFound()
  }

  return <ExerciseScreen exercises={data} />;
}
