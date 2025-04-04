'use client';

import { useState, useEffect } from 'react';
import { ExerciseData } from '@/app/models/Workout';
import { useRouter } from 'next/navigation';

interface Props {
  exercises: ExerciseData[];
}

export default function SummaryPage({ exercises }: Props) {
  const [workoutEnded, setWorkoutEnded] = useState(false);
  const router = useRouter();

  const endWorkout = () => {
    setWorkoutEnded(true);
  };

  useEffect(() => {
    if (workoutEnded) {
      router.push('/home?tab=workouts');
    }
  }, [workoutEnded, router]);

  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6 sm:mt-12">
        Workout Summary
      </h1>

      {/* List of exercises */}
      <ul className="space-y-6">
        {exercises.map((exercise, index) => (
          <li
            key={index}
            className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{exercise.name}</h2>
            <p className="text-lg text-gray-600">Type: {exercise.type}</p>
            {exercise.type === 'Timed' && exercise.mins && (
              <p className="text-lg text-gray-600">Duration: {exercise.mins} minutes</p>
            )}
            {exercise.type === 'Sets' && (
              <p className="text-lg text-gray-600">
                Sets: {exercise.sets}, Reps: {exercise.reps}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-8 text-center">
        <button
          onClick={endWorkout}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          End Workout
        </button>
      </div>
    </div>
  );
}
