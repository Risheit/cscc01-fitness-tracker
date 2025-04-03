import { getWorkoutPlan } from '@/app/models/Workout';
import OverviewPage from './components/OverviewPage';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function WorkoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const paramsId = parseInt(params?.id ?? '-1', 10);
  const cleanId = Number.isNaN(paramsId) ? -1 : paramsId;
  const data = await getWorkoutPlan(cleanId);

  if (!data || data.length === 0) {
    return <p>There was an issue fetching exercises.</p>
  }

  return <OverviewPage exercises={data} workoutId={cleanId} />;
}