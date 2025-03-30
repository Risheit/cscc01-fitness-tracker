import NavBar from './components/NavBar';
import { redirect, RedirectType } from 'next/navigation';
import ExerciseVideosTab from './components/ExerciseVideosTab';
import WorkoutSelectionTab from './components/WorkoutSelectionTab';
import { getAllWorkoutPlans } from '../models/Workout';
import WorkoutBuilder from './components/WorkoutBuilder';
import ConversationsTab from './components/ConversationTab';
import FinishedWorkouts from '../finished_workouts/page'
// Internally, represent tabs in all lowercase with dashes between words:
//    About Us --> about-us

async function displayTab(tabName?: string) {
  switch (tabName) {
    case 'workouts':
      return <WorkoutSelectionTab workouts={await getAllWorkoutPlans()} />;
    case 'videos':
      return <ExerciseVideosTab />;
    case 'about':
      return <h1>About us</h1>;
    case 'workout-builder':
      return <WorkoutBuilder />;
    case 'conversation':
      return <ConversationsTab />;
    case 'finished-workouts':
      return <FinishedWorkouts/>
    default:
      redirect('/home?tab=workouts', RedirectType.replace);
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const tab = displayTab((await searchParams)?.tab);

  return (
    <div className="flex flex-col w-full h-full">
      <main className="flex-1">{tab}</main>
      <NavBar tabNames={['Workouts', 'Workout Builder', 'Videos', 'Conversation', 'Finished-Workouts']} />
    </div>
  );
}
