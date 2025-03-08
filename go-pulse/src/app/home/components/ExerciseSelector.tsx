'use client';

import { ExerciseData } from '@/app/models/Workout';

interface ExerciseSelectorProps {
  exercises: ExerciseData[];
  selectedVideoId: string;
  onSelect: (videoId: string) => void;
}

const ExerciseSelector = ({
  exercises,
  selectedVideoId,
  onSelect,
}: ExerciseSelectorProps) => {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      value={selectedVideoId}
      className="mb-6 p-2 border border-gray-300 rounded"
    >
      {exercises.map((exercise) => (
        <option key={exercise.name} value={exercise.videoId}>
          {exercise.name}
        </option>
      ))}
    </select>
  );
};

export default ExerciseSelector;
