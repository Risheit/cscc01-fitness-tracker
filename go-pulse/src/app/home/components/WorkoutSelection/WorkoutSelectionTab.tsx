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
    <div className="flex flex-col bg-gray-200 py-6 min-h-screen px-4">
      {/* Notifications Button */}
      {!notificationsAllowed && (
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg mb-6 self-center hover:bg-blue-700 transition duration-300"
          onClick={() => {
            Notification.requestPermission()
              .then(trySubscribeToNotifications)
              .then(setNotificationsAllowed);
          }}
        >
          Subscribe for workout notifications!
        </button>
      )}

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <label htmlFor="workout-search" className="invisible w-0 h-0">Search workouts</label>
        <input
          id="workout-search"
          type="text"
          placeholder="Search for a workout..."
          className="border-2 rounded-full px-6 py-3 text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Header Underneath Search Bar */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Available Workouts
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Browse and select your next workout routine.
        </p>
      </div>

      {/* Workout Cards */}
      <div className="flex flex-row flex-wrap gap-6 justify-center">
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
