'use client';

import { WorkoutPlan } from '@/app/models/Workout';
import { useEffect, useState } from 'react';
import WorkoutCard from './WorkoutCard';

export default function WorkoutSelectionTab() {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]); // Store exercises

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await fetch('/api/workouts');
        const data = await response.json();

        if (response.ok) {
          setWorkouts(data); // Store retrieved exercises
        } else {
          console.error('Failed to fetch workouts');
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    }

    fetchWorkouts();
  }, []);

  return (
    <div className="flex flex-row flex-wrap gap-4 align-middle justify-evenly px-2 py-4">
      {workouts.map((plan) => (
        <WorkoutCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
