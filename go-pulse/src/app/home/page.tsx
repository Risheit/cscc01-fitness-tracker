'use client';

import NavBar from './components/NavBar';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import ExerciseVideosTab from './components/ExerciseVideosTab';
import WorkoutSelectionTab from './components/WorkoutSelectionTab';

function displayTab(tabName: string) {
  switch (tabName) {
    case 'Workouts':
      return <WorkoutSelectionTab />;
    case 'Videos':
      return <ExerciseVideosTab />;
    case 'About':
      return <h1>About us</h1>
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
