import NavBar from './components/NavBar';
import { redirect, RedirectType } from 'next/navigation';
import WorkoutSelectionTab from './components/WorkoutSelection/WorkoutSelectionTab';
import { getAllWorkoutPlans } from '../models/Workout';
import WorkoutBuilder from './components/WorkoutBuilder/WorkoutBuilder';
import ConversationsTab from './components/ChatWindow/ConversationTab';
import ScheduledWorkouts from './components/ScheduledWorkots/ScheduledWorkouts';

// Internally, represent tabs in all lowercase with dashes between words:
//    About Us --> about-us

async function displayTab(tabName?: string) {
  switch (tabName) {
    case 'workouts':
      return <WorkoutSelectionTab workouts={await getAllWorkoutPlans()} />;
    case 'workout-builder':
      return <WorkoutBuilder />;
    case 'conversation':
      return (
        <ConversationsTab
          wsUrl={`ws://${process.env.WS_HOST}:${process.env.WS_PORT}`}
        />
      );
    case 'scheduled-workouts':
      return <ScheduledWorkouts />;
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
        <NavBar
          tabs={[
            { name: 'Workouts', image: '/homeicon.png' },
            { name: 'Scheduled Workouts', image: '/schedule-icon.png' },
            { name: 'Workout Builder', image: '/buildericon.jpg' },
            { name: 'Conversation', image: '/chaticon.png' },
          ]}
        />
      </div>
    </div>
  );
}
