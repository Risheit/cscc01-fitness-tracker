'use client';

import { ExerciseData } from '@/app/models/Workout';
import { useState } from 'react';

interface Props {
  className?: string;
  data: ExerciseData;
  isCapped: boolean;
  onCompletion: () => void;
}

export default function RepBottomSheet({
  className,
  data,
  isCapped,
  onCompletion,
}: Props) {
  const [reps, setReps] = useState(1);
  const [sets, setSets] = useState(1);

  const nextRep = () => {
    if (isCapped && reps >= data.reps!) {
      nextSet();
      return;
    }

    setReps(reps + 1);
  };

  const nextSet = () => {
    if (isCapped && sets >= data.sets!) {
      onCompletion();
    }

    setReps(1);
    setSets(sets + 1);
  };

  return (
    <div
      className={`${className ?? ''} flex flex-col p-5 rounded-3xl bg-gray-100`}
    >
      <h1 className="text-3xl text-center">{data.name}</h1>
      <p className="flex-auto h-fit text-justify text-sm">{data.description}</p>

      <div className="flex flex-col items-center gap-2">
        <div className="flex justify-between gap-3">
          <div className="flex flex-col items-center">
            <p className="text-3xl">Sets: {sets}</p>
            {isCapped && <p className="text-md">of {data.sets!}</p>}
          </div>
          <p className="text-3xl">|</p>
          <div className="flex flex-col items-center">
            <p className="text-3xl">Reps: {reps}</p>
            {isCapped && <p className="text-md">of {data.reps!}</p>}
          </div>
        </div>

        {/* Flex container for the first row of buttons */}
        <div
          className={`flex ${
            isCapped ? 'justify-center' : 'justify-between'
          } gap-4 w-full max-w-64 mt-6`}
        >
          {!isCapped && (
            <button
              className="bg-green-600 rounded-md h-16 w-48 border border-r-2 border-green-800 text-white hover:bg-green-700 transition-colors"
              onClick={nextSet}
            >
              Next Set
            </button>
          )}
          <button
            className="bg-green-600 rounded-md h-16 w-48 border border-r-2 border-green-800 text-white hover:bg-green-700 transition-colors"
            onClick={nextRep}
          >
            Next Rep
          </button>
        </div>

        {/* "Next Workout" button centered on the next line */}
        <div className="flex justify-center w-full mt-4">
          <button
            className="bg-red-600 rounded-md h-16 w-48 border border-r-2 border-red-800 text-white hover:bg-red-700 transition-colors"
            onClick={onCompletion}
          >
            {isCapped ? 'Skip' : 'Next Workout'}
          </button>
        </div>
      </div>
    </div>
  );
}
