'use client';

import { WorkoutPlan } from '@/app/models/Workout';
import { useEffect, useState } from 'react';
import WorkoutCard from './WorkoutCard';

export default function WorkoutSelectionTab() {
  const [search, setSearch] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]); // Store exercises

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await fetch('/api/workouts');
        const data = (await response.json()) as WorkoutPlan[];

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
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Search for a workout..."
        className="border-2 m-5 rounded-full px-3 py-1"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-row flex-wrap gap-4 align-middle justify-evenly px-2 py-4">
        {workouts
          .filter((plan) =>
            plan.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((plan) => (
            <WorkoutCard key={plan.id} plan={plan} />
          ))}
      </div>
    </div>
  );
}
