'use client';

import YouTubePlayer from '@/app/components/YouTubePlayer';
import { ExerciseData, WorkoutState } from '@/app/models/Workout';

interface Props {
  className?: string;
  data?: ExerciseData;
  state: WorkoutState;
  onCompletion: () => void;
}

function getHeadingText(state: WorkoutState) {
  switch (state) {
    case 'start':
      return 'Beginning with...';
    case 'paused':
      return 'Coming up...';
    case 'running':
      throw new Error('Intermediate page shown when exercise running.');
    case 'end':
      return 'All done!';
  }
}

export default function IntermediateBottomSheet({
  className,
  data,
  state,
  onCompletion,
}: Props) {
  return (
    <div
      className={`${
        className ?? ''
      } flex gap-1 flex-col p-5 rounded-3xl bg-gray-100`}
    >
      <h1 className="text-lg text-center">{getHeadingText(state)}</h1>
      <h1 className="text-3xl text-center">{data?.name ?? 'Good work!'}</h1>
      <p className="flex-auto h-fit text-justify text-sm">
        {data?.description ??
          "Take a breather. Don't forget to hydrate between workouts, other miscellaneous workout stuff here."}
      </p>

      {data?.videoId ? (
        <YouTubePlayer videoId={data.videoId} />
      ) : data?.name ? ( 
        // Show message only if name exists but videoId is missing
        <p className="text-center text-gray-500 italic">
          Tutorial video will be added soon.
        </p>
      ) : null}

      <div className="flex justify-center w-full mt-4">
        <button
          className="bg-blue-600 rounded-md h-16 w-48 border border-r-2 border-blue-800 text-white hover:bg-blue-700 transition-colors"
          onClick={onCompletion}
        >
          {state != 'end' ? 'Continue' : 'Finish'}
        </button>
      </div>
    </div>
  );
}
