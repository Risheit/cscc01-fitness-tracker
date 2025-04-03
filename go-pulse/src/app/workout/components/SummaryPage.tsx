'use client';

import { useState } from 'react';
import { ExerciseData } from '@/app/models/Workout';
import { redirect, RedirectType } from 'next/navigation';
import { endianness } from 'os';

interface Props {
  exercises: ExerciseData[];
  workoutId: number;
}

export default function SummaryPage({ exercises, workoutId }: Props) {
  const [workoutEnded, setWorkoutEnded] = useState(false);

  const endWorkout = () => {
    setWorkoutEnded(true);
  };

  const goBack = () => {
    redirect('/home?tab=workouts', RedirectType.replace)
  };

  if (workoutEnded) {
    console.log('Workout ended');
    redirect('/home?tab=workouts', RedirectType.replace)
  }

  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* Back Button in the top-left, conditionally adjusts for small screen */}
      <button
        onClick={goBack}
        className="absolute top-6 left-1 text-blue-800 p-2 bg-blue rounded-full shadow-md hover:bg-blue-100 transition duration-200"
      >
        Back
      </button>

      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6 sm:mt-12">
        Workout Summary
      </h1>
      
      {/* List of exercises */}
      <ul className="space-y-6">
        {exercises.map((exercise, index) => (
          <li key={index} className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800">{exercise.name}</h2>
            <p className="text-lg text-gray-600">Day: {exercise.dayOfWeek}</p>
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
