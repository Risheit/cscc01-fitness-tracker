'use client';

import { ExerciseData } from '@/app/models/Workout';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

interface Props {
  className?: string;
  data: ExerciseData;
  onCompletion: () => void;
}

export default function TimedBottomSheet({
  className,
  data,
  onCompletion,
}: Props) {
  const [isLiked, setIsLiked] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [displayTimeRemaining, setDisplayTimeRemaining] = useState(
    `${data.mins}m 0s`
  );
  const remainingMillis = useRef(data.mins! * 60 * 1000);
  const audioRef = useRef(new Audio('/Timer.mp3'));

  const onLikedButtonClicked = () => {
    setIsLiked(!isLiked);
  };

  const onPauseButtonClicked = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    const startTimedExercise = () => {
      const oneSecondInMillis = 1 * 1000;

      const timerId = setInterval(() => {
        if (isPaused) {
          return;
        }

        if (remainingMillis.current <= 0) {
          setDisplayTimeRemaining(`All done!`);
          setIsFinished(true);
          audioRef.current.play();
          return;
        }

        remainingMillis.current -= oneSecondInMillis;
        const remainingTime = new Date(remainingMillis.current);
        const remainingMins = remainingTime.getMinutes();
        const remainingSecs = remainingTime.getSeconds();
        setDisplayTimeRemaining(`${remainingMins}m ${remainingSecs}s`);
      }, 1000);

      return timerId;
    };

    if (data.type === 'Timed') {
      const timerId = startTimedExercise();
      return () => {
        clearInterval(timerId);
      };
    }
  }, [data.type, isPaused, onCompletion]);

  return (
    <div
      className={`${className ?? ''} flex flex-col p-5 rounded-3xl bg-gray-100`}
    >
      <h1 className="flex-initial text-xl ">{data.name}</h1>
      <div className="flex-auto flex flex-col gap-2 items-center justify-center">
        <p className="text-sm text-center">Time Remaining:</p>
        <p className="text-4xl text-center">{displayTimeRemaining}</p>
      </div>
      <p className="flex-auto h-fit text-justify text-sm">{data.description}</p>
      <div className="flex flex-row justify-between items-stretch w-full gap-5 px-2 py-10">
        <button
          className="w-fit h-fit px-2 border-gray-200 border bg-white rounded-md"
          onClick={onLikedButtonClicked}
        >
          <div className="w-5 h-5 my-3 mx-7">
            <FontAwesomeIcon
              icon={isLiked ? faSolidHeart : faHeart}
              color={isLiked ? 'red' : 'gray'}
              fixedWidth
            />
          </div>
        </button>
        <div className="flex-initial flex gap-0 min-w-48 w-full max-w-64">
          <button
            className="bg-green-600 rounded-l-md h-full w-full max-w-32 border border-r-2 border-green-800 text-white hover:bg-green-700 disabled:text-gray-600 disabled:bg-green-800 transition-colors"
            onClick={onPauseButtonClicked}
            disabled={isFinished}
          >
            {isPaused ? 'Continue' : 'Pause'}
          </button>
          <button
            className="bg-green-600 rounded-r-md h-full w-full max-w-32 border border-green-800 text-white hover:bg-green-700 transition-colors"
            onClick={onCompletion}
          >
            {isFinished ? 'Complete' : 'Skip'}
          </button>
        </div>
      </div>
    </div>
  );
}
