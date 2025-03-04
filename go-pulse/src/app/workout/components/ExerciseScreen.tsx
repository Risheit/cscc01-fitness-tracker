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

export default function ExerciseScreen({ exercises }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [workoutState, setWorkoutState] = useState('start' as WorkoutState);
  const router = useRouter();

  const completeExercise = () => {
    setCurrentIndex(currentIndex + 1);
    setWorkoutState(
      currentIndex + 1 < (exercises?.length ?? 0) ? 'paused' : 'end'
    );
  };

  const nextExercise = () => {
    if (workoutState == 'end') {
      router.push('/');
    } else {
      setWorkoutState('running');
    }
  };

  return (
    <main className="flex flex-col h-full w-full">
      <div className="flex h-2/5 relative overflow-hidden">
        <Image
          src={
            workoutState == 'end'
              ? '/stock-running.jpg'
              : exercises[currentIndex].imagePath
          }
          alt=""
          fill
          className="w-full h-2/3 object-cover object-top"
        />
      </div>
      {workoutState == 'running' ? (
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
