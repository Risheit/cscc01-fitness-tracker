'use client';

import { WorkoutPlan } from '@/app/models/Workout';
import { useState } from 'react';
import WorkoutCard from './WorkoutCard';

interface Props {
  workouts: WorkoutPlan[]
}

export default function WorkoutSelectionTab({ workouts }: Props) {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col">
      <label htmlFor='workout-search' className='hidden'>Search Workouts</label>
      <input
        id='workout-search'
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
