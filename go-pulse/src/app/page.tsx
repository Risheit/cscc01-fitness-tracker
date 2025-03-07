'use client';

import NavBar from './components/NavBar';
import LogoutButton from './components/LogoutButton';
import { useState } from 'react';
import ExerciseVideosTab from './components/ExerciseVideosTab';
import { notFound } from 'next/navigation';

function displayTab(tabName: string) {
  switch (tabName) {
    case 'Workouts':
      return (
        <h1 className="text-2xl font-bold mt-6">Welcome to the Home Page</h1>
      );
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
      <LogoutButton />
      <NavBar
        tabNames={['Workouts', 'Videos', 'About']}
        setCurrentTab={setCurrentTab}
      />
    </div>
  );
}
