'use client';

import NavBar from './components/NavBar';
import { useState } from 'react';
import ExerciseVideosTab from './components/ExerciseVideosTab';
import { notFound } from 'next/navigation';
import WorkoutSelectionTab from './components/WorkoutSelectionTab';

function displayTab(tabName: string) {
  switch (tabName) {
    case 'Workouts':
      return <WorkoutSelectionTab />;
    case 'Videos':
      return <ExerciseVideosTab />;
    case 'About':
      return <ExerciseVideosTab />;
    default:
      notFound();
  }
}

export default function Home() {
  const [currentTab, setCurrentTab] = useState('Workouts');

  return (
    <div className="flex flex-col w-full h-full">
      <main className="flex-1">{displayTab(currentTab)}</main>
      <NavBar
        tabNames={['Workouts', 'Videos', 'About']}
        setCurrentTab={setCurrentTab}
      />
    </div>
  );
}
