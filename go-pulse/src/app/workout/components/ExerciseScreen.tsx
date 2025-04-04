'use client';

import Image from 'next/image';
import TimedBottomSheet from './TimedBottomSheet';
import { ExerciseData, WorkoutState } from '@/app/models/Workout';
import RepBottomSheet from './RepBottomSheet';
import { useState } from 'react';
import IntermediateBottomSheet from './IntermediateBottomSheet';
import { useRouter } from 'next/navigation';

interface Props {
  exercises: ExerciseData[];
  workoutId: number;
}

function renderBottomSheet(exercise: ExerciseData, onCompletion: () => void) {
  switch (exercise.type) {
    case 'Timed':
      return (
        <TimedBottomSheet
          className="flex-auto top-1/3 w-full h-2/3 absolute z-10"
          data={exercise}
          onCompletion={onCompletion}
        />
      );
    case 'Sets':
      return (
        <RepBottomSheet
          className="flex-auto top-1/3 w-full h-2/3 absolute z-10"
          data={exercise}
          onCompletion={onCompletion}
          isCapped={true}
        />
      );
  }
}

export default function ExerciseScreen({ exercises, workoutId }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [workoutState, setWorkoutState] = useState<WorkoutState>('start');
  const router = useRouter();

  const completeExercise = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setWorkoutState(
      currentIndex + 1 < (exercises?.length ?? 0) ? 'paused' : 'end'
    );
  };
  
  const logCompletedExercises = async () => {
    if (!exercises || exercises.length === 0) {
      console.warn('No exercises to log.');
      return;
    }

    console.log('Logging completed exercises...');

    try {
      const results = await Promise.allSettled(
        exercises.map(async (exercise) => {
          const res = await fetch('/api/finished-workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              exerciseName: exercise.name,
            }),
          });

          if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(`${exercise.name} failed: ${errorMsg}`);
          }

          console.log(`Logged: ${exercise.name}`);
        })
      );

      // Find failed logs
      const failedExercises = results
        .filter((result) => result.status === 'rejected')
        .map((result) => (result as PromiseRejectedResult).reason.message);

      if (failedExercises.length > 0) {
        console.error('Some exercises failed to log:');
        failedExercises.forEach((err) => console.error(err));
      } else {
        console.log('All exercises logged successfully!');
      }
    } catch (error) {
      console.error('Unexpected error while logging exercises:', error);
    }
  };

  const nextExercise = () => {
    if (workoutState === 'end') {
      logCompletedExercises().then(() => {
        router.push(`/workout?view=summary&id=${workoutId}`);
      });
    } else {
      setWorkoutState('running');
    }
  };

  return (
    <main className="flex flex-col h-full w-full">
      <div className="flex h-2/5 relative overflow-hidden">
        <Image
          src={
            workoutState === 'end'
              ? '/stock-running.jpg'
              : exercises[currentIndex].imagePath ?? '/stock-running.jpg'
          }
          alt="current exercise"
          fill
          className="w-full h-2/3 object-cover object-top"
        />
      </div>
      {workoutState === 'running' ? (
        renderBottomSheet(exercises[currentIndex], completeExercise)
      ) : (
        <IntermediateBottomSheet
          className="w-full h-2/3 object-cover object-top"
          data={exercises[currentIndex]}
          state={workoutState}
          onCompletion={nextExercise}
        />
      )}
    </main>
  );
}
