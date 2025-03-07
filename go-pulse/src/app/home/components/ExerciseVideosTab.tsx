'use client';

import { useEffect, useState } from 'react';
import YouTubePlayer from '../../components/YouTubePlayer';
import ExerciseSelector from './ExerciseSelector';
import { ExerciseData } from '../../models/Workout';

export default function ExerciseVideosTab() {
  const [videoId, setVideoId] = useState<string>('M7lc1UVf-VE'); // Default videoId
  const [exercises, setExercises] = useState<ExerciseData[]>([]); // Store exercises

  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch('/api/exercises');
        const data = await response.json();

        if (response.ok) {
          setExercises(data); // Store retrieved exercises
          if (data.length > 0) {
            setVideoId(data[0].video_id); // Set default video to first exercise
          }
        } else {
          console.error('Failed to fetch exercises');
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    }

    fetchExercises();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Exercise Videos
      </h1>
      <p className="text-lg text-gray-600 text-center mb-6">
        Select an exercise to watch its tutorial.
      </p>

      {exercises.length > 0 ? (
        <div className="flex flex-col items-center gap-6">
          {/* Exercise Selector */}
          <ExerciseSelector
            exercises={exercises}
            selectedVideoId={videoId}
            onSelect={setVideoId}
          />

          {/* YouTube Player */}
          <div className="w-full max-w-2xl">
            <YouTubePlayer videoId={videoId} />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p className="animate-pulse">Loading exercises...</p>
        </div>
      )}
    </div>
  );
}
