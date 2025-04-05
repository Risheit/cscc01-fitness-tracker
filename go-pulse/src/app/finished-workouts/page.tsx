'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TopWorkout {
  exercise_name: string;
  count: number;
}

export default function TopWorkoutsPage() {
  const [topWorkouts, setTopWorkouts] = useState<TopWorkout[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTopWorkouts = async () => {
      try {
        const res = await fetch('/api/top-workouts');
        if (!res.ok) throw new Error('Failed to fetch workouts');
        const data = await res.json();
        setTopWorkouts(data);
      } catch (error) {
        console.error(error);
        setError('Failed to load top workouts');
      } finally {
        setLoading(false);
      }
    };

    fetchTopWorkouts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Top Workouts
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <ul className="space-y-4">
          {topWorkouts.length > 0 ? (
            topWorkouts.map((workout, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <span className="text-lg font-medium text-gray-700">
                  {workout.exercise_name}
                </span>
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                  {workout.count} times
                </span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No top workouts found</p>
          )}
        </ul>
      )}

      {/* Go to Progress Page Button */}
      <div className="flex justify-center">
        <button
          onClick={() => router.push('/progress')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
        >
          View Progress
        </button>
      </div>
    </div>
  );
}