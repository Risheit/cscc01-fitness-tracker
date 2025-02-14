'use client';

import RepData from '@/app/models/RepData';
import { useState } from 'react';

interface Props {
  className?: string;
  data: RepData;
}

export default function RepBottomScreen({ className, data }: Props) {
  const [session, setSession] = useState(data);

  const nextRep = () => {
    setSession({ ...session, currentRep: session.currentRep + 1 });
  };

  const nextSet = () => {
    setSession({ ...session, currentSet: session.currentSet + 1, currentRep: 1 });
  };

  const resetWorkout = () => {
    setSession({ ...session, currentSet: 1, currentRep: 1 });
  };

  return (
    <div className={`${className ?? ''} flex flex-col p-5 rounded-3xl bg-gray-100`}>
      <h1 className="text-3xl text-black text-center">{session.exerciseName}</h1>
      <p className="text-center text-black">{session.exerciseDescription}</p>

      <div className="flex flex-col items-center gap-2 mt-">
        <p className="text-3xl text-black">Set: {session.currentSet} | Rep: {session.currentRep}</p>

        {/* Flex container for the first row of buttons */}
        <div className="flex justify-between gap-4 w-full max-w-64 mt-6">
          <button className="bg-green-600 rounded-md h-16 w-48 border border-r-2 border-green-800 text-white hover:bg-green-700 transition-colors" onClick={nextRep}>
            Next Rep
          </button>
          <button className="bg-green-600 rounded-md h-16 w-48 border border-r-2 border-green-800 text-white hover:bg-green-700 transition-colors" onClick={nextSet}>
            Next Set
          </button>
        </div>

        {/* "Next Workout" button centered on the next line */}
        <div className="flex justify-center w-full mt-4">
          <button className="bg-red-600 rounded-md h-16 w-48 border border-r-2 border-red-800 text-white hover:bg-red-700 transition-colors" onClick={resetWorkout}>
            Next Workout
          </button>
        </div>
      </div>
    </div>
  );
}
