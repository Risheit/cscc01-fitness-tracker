import { getWorkoutPlan } from '@/app/models/Workout';
import OverviewPage from './components/OverviewPage';
import ExerciseScreen from './components/ExerciseScreen';
import SummaryPage from './components/SummaryPage';
import { notFound } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ id?: string; view?: string }>;
}

export default async function WorkoutPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const paramsId = parseInt(params?.id ?? '-1', 10);
  const cleanId = Number.isNaN(paramsId) ? -1 : paramsId;
  const view = params?.view ?? 'overview'; // Default to 'overview'
  const data = await getWorkoutPlan(cleanId);

  if (!data || data.length === 0) {
    notFound();
  }
  // Dynamically render the appropriate component based on the `view` parameter
  switch (view) {
    case 'overview':
      return <OverviewPage exercises={data} workoutId={cleanId} />;
    case 'exercise':
      return <ExerciseScreen exercises={data} workoutId={cleanId} />;
    case 'summary':
      return <SummaryPage exercises={data} workoutId={cleanId} />;
    default:
      notFound();
  }
}