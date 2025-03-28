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
  const [weight, setWeight] = useState("");
  const [error, setError] = useState(false);

  function isWeightValid() {
    return weight.trim() !== "" && parseFloat(weight) > 0;
  }

  async function logProgress() {
    await fetch(`http://localhost:3000/api/log-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exercise_name: data.name,
        weight_lbs: parseFloat(weight) || 0,
        sets: sets,
        reps: reps,
      }),
    });
  }

  const nextRep = () => {
    if (isCapped && reps >= data.reps!) {

      if (!isWeightValid()) {
        setError(true);
        return;
      }
  
      setError(false);

      nextSet();
      return;
    }

    setReps(reps + 1);
  };

  const nextSet = () => {
    if (isCapped && sets >= data.sets!) {
      logProgress();
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

        {/* Weight Input */}
        <input
          type="number"
          placeholder="Enter weight (lbs)"
          className="w-full max-w-64 p-3 rounded-md bg-gray-700 text-white text-center"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          min="0"
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm">Please enter a valid weight before proceeding.</p>
        )}

        {/* Flex container for the first row of buttons */}
        <div
          className={`flex ${
            isCapped ? 'justify-center' : 'justify-between'
          } gap-4 w-full max-w-64 mt-6`}
        >
          {!isCapped && (
            <button
              className="bg-blue-600 rounded-md h-16 w-48 border border-r-2 border-blue-800 text-white hover:bg-blue-700 transition-colors"
              onClick={nextSet}
            >
              Next Set
            </button>
          )}
          <button
            className="bg-blue-600 rounded-md h-16 w-48 border border-r-2 border-blue-800 text-white hover:bg-blue-700 transition-colors"
            onClick={nextRep}
          >
            Next Rep
          </button>
        </div>

        {/* "Next Workout" button centered on the next line */}
        <div className="flex justify-center w-full mt-4">
          <button
            className="bg-red-600 rounded-md h-16 w-48 border border-r-2 border-red-800 text-white hover:bg-red-700 transition-colors"
            onClick={async () => {
              if (!isWeightValid()) {
                setError(true);
                return;
              }
              await logProgress();
              onCompletion();
            }}
            disabled={!isWeightValid()}
          >
            {isCapped ? 'Skip' : 'Next Workout'}
          </button>
        </div>
      </div>
    </div>
  );
}
