'use client';

import { useState } from 'react';
import { ExerciseData } from '@/app/models/Workout';
import ExerciseScreen from './ExerciseScreen';

interface Props {
  exercises: ExerciseData[];
  workoutId: number;
}

export default function OverviewPage({ exercises, workoutId }: Props) {
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const startWorkout = () => {
    setWorkoutStarted(true);
  };

  const shareableLink = `${window.location.origin}/workout?id=${workoutId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  if (workoutStarted) {
    return <ExerciseScreen exercises={exercises} />;
  }

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4">Workout Summary</h1>
      <ul className="space-y-4">
        {exercises.map((exercise, index) => (
          <li key={index} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{exercise.name}</h2>
            <p>Day: {exercise.dayOfWeek}</p> {/* Display the day of the week */}
            <p>Type: {exercise.type}</p>
            {exercise.type === 'Timed' && exercise.mins && (
              <p>Duration: {exercise.mins} minutes</p>
            )}
            {exercise.type === 'Sets' && (
              <p>
                Sets: {exercise.sets}, Reps: {exercise.reps}
              </p>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={startWorkout}
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Start Workout
      </button>
      <div className="mt-4">
        <p>Share this workout:</p>
        <button
          onClick={copyToClipboard}
          className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}