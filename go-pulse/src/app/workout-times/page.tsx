'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type WorkoutTime = {
  workout_name: string;
  duration: number; //in seconds
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

type SortOption = 'newest' | 'oldest' | 'shortest' | 'longest';

export default function WorkoutTimesPage() {
  const [workoutTimes, setWorkoutTimes] = useState<WorkoutTime[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch("/api/workout-times")
      .then(async res => {
        if (!res.ok) {
          console.error("Error fetching workout times");
          return;
        }
  
        const data = await res.json();
        setWorkoutTimes(data);
      })
      .catch(err => console.error("Fetch error", err));
  }, []);

  const goBack = () => {
    router.push("/profile");
  };

  const totalDuration = workoutTimes.reduce((acc, curr) => acc + curr.duration, 0);
  const averageDuration = workoutTimes.length > 0
    ? Math.floor(totalDuration / workoutTimes.length)
    : 0; 
   
  let filteredWorkoutTimes = workoutTimes.filter(w =>
    w.workout_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let sortedWorkoutTimes = [...filteredWorkoutTimes];
  switch (sortOption) {
    case 'shortest':
      sortedWorkoutTimes.sort((a, b) => a.duration - b.duration);
      break;
    case 'longest':
      sortedWorkoutTimes.sort((a, b) => b.duration - a.duration);
      break;
    case 'oldest':
      sortedWorkoutTimes.reverse();
      break;
    case 'newest':
    default:
      break;
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Workout History</h1>
        <button
          onClick={goBack}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Back
        </button>
      </div>

      {/* Workout Stats */}
      <div className="mb-6 space-y-1">
        <p className="text-lg text-gray-800 font-medium">Total Workouts: {workoutTimes.length}</p>
        <p className="text-lg text-gray-800 font-medium">
          Total Workout Time: <span className="text-blue-600 font-semibold">{formatDuration(totalDuration)}</span>
        </p>
        <p className="text-lg text-gray-800 font-medium">
          Average Workout Duration: <span className="text-green-600 font-semibold">{formatDuration(averageDuration)}</span>
        </p>
      </div>

      {/* Sort and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="border border-gray-300 px-3 py-2 rounded"
          >
            <option value="newest">Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
            <option value="shortest">Shortest to Longest</option>
            <option value="longest">Longest to Shortest</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search by workout name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-full sm:w-[300px] text-base"
          />
        </div>
      </div>

      {workoutTimes.length === 0 ? (
        <p className="text-gray-600">No workouts completed yet.</p>
      ) : (
        <ul className="space-y-4">
            
            {sortedWorkoutTimes.map((w, index) => (
            <li
              key={index}
              className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow transition"
            >
              <p className="text-xl font-semibold text-gray-800">{w.workout_name}</p>
              <p className="text-gray-600">Time Spent: {formatDuration(w.duration)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

