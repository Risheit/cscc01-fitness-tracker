import NavBar from './components/NavBar';
import { redirect, RedirectType } from 'next/navigation';
import WorkoutSelectionTab from './components/WorkoutSelectionTab';
import { getAllWorkoutPlans } from '../models/Workout';
import WorkoutBuilder from './components/WorkoutBuilder';
import ConversationsTab from './components/ConversationTab';
import ExerciseVideosTab from './components/ExerciseVideosTab';

// Internally, represent tabs in all lowercase with dashes between words:
//    About Us --> about-us

async function displayTab(tabName?: string) {
  switch (tabName) {
    case 'workouts':
      return <WorkoutSelectionTab workouts={await getAllWorkoutPlans()} />;
    case 'about':
      return <h1>About us</h1>;
    case 'workout-builder':
      return <WorkoutBuilder />;
    case 'conversation':
      return <ConversationsTab />;
    case 'videos':
      return <ExerciseVideosTab/>;
    default:
      redirect('/home?tab=workouts', RedirectType.replace);
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const tab = await displayTab((await searchParams)?.tab);

  return (
    <div className="flex flex-col w-full h-screen">
      <main className="flex-1 overflow-y-auto">{tab}</main>

      <div className="relative">
        <NavBar tabImages={['/homeicon.png', '/buildericon.jpg', '/videoicon.png', '/chaticon.png']} />
      </div>
    </div>
  );
}
