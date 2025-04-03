'use client';

import { useState } from 'react';
import { ExerciseData } from '@/app/models/Workout';
import ExerciseScreen from './ExerciseScreen';
import { redirect, RedirectType } from 'next/navigation';
import { SchedulingModal } from './SchedulingModal';

interface Props {
  exercises: ExerciseData[];
  workoutId: number;
}

export default function OverviewPage({ exercises, workoutId }: Props) {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(true);

  const startWorkout = () => {
    setWorkoutStarted(true);
  };

  const shareableLink = `${window.location.origin}/workout?id=${workoutId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const goBack = () => {
    redirect('/home?tab=workouts', RedirectType.replace);
  };

  if (workoutStarted) {
    return <ExerciseScreen exercises={exercises} />;
  }

  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* Modal for scheduling */}
      {isSchedulingModalOpen && (
        <SchedulingModal
          workoutId={workoutId}
          onClose={() => setIsSchedulingModalOpen(false)}
        />
      )}

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
          <li
            key={index}
            className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              {exercise.name}
            </h2>
            <p className="text-lg text-gray-600">Type: {exercise.type}</p>
            {exercise.type === 'Timed' && exercise.mins && (
              <p className="text-lg text-gray-600">
                Duration: {exercise.mins} minutes
              </p>
            )}
            {exercise.type === 'Sets' && (
              <p className="text-lg text-gray-600">
                Sets: {exercise.sets}, Reps: {exercise.reps}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-8 text-center flex flex-col items-center gap-2 w-fit self-center mx-auto">
        <button
          onClick={startWorkout}
          className="w-fit bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Start Workout
        </button>
        <button
          onClick={() => setIsSchedulingModalOpen(true)}
          className="w-fit bg-gray-400 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Schedule Workout
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg text-gray-600">Share this workout:</p>
        <button
          onClick={copyToClipboard}
          className="flex-initial w-fit mt-3 bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
