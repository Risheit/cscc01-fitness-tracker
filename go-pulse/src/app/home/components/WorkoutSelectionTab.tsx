'use client';

import { WorkoutPlan } from '@/app/models/Workout';
import { useEffect, useState } from 'react';
import WorkoutCard from './WorkoutCard';
import {
  notificationUnsupported,
  trySubscribeToNotifications,
} from '@/app/models/Push';

interface Props {
  workouts: WorkoutPlan[];
}

export default function WorkoutSelectionTab({ workouts }: Props) {
  const [search, setSearch] = useState('');
  const [notificationsAllowed, setNotificationsAllowed] = useState(true);

  useEffect(() => {
    if (notificationUnsupported()) return;
    setNotificationsAllowed(Notification.permission !== 'default');
    trySubscribeToNotifications(Notification.permission);
  }, []);

  return (
    <div className="flex flex-col">
      {!notificationsAllowed && (
        <button
          className="bg-gray-800 text-white p-1 rounded-2xl m-5"
          onClick={() => {
            Notification.requestPermission()
              .then(trySubscribeToNotifications)
              .then(setNotificationsAllowed);
          }}
        >
          Subscribe for workout notifications!
        </button>
      )}
      <label htmlFor="workout-search" className="hidden">
        Search Workouts
      </label>
      <input
        id="workout-search"
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
