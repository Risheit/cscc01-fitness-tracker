"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ProgressData {
  weight_lbs: number;
  recorded_at: string;
}

export default function ProgressPage() {
  const [exercise, setExercise] = useState("");
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [exercises, setExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch exercise options
  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch(`/api/logged-exercises`);
        if (!res.ok) throw new Error("Failed to fetch exercises");
        const data = await res.json();
        setExercises(data);
      } catch (error) {
        console.error("Error loading exercises:", error);
      }
    }
    fetchExercises();
  }, []);

  // Fetch progress data for selected exercise
  useEffect(() => {
    async function fetchProgress() {
      if (!exercise) return;
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/exercise-progress?exercise=${encodeURIComponent(exercise)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch progress");
        }

        setProgress(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [exercise]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-center mb-6">Weight Progression</h1>

      {/* Exercise Selection */}
      <div className="w-full max-w-md">
        <label htmlFor="exercise" className="block text-gray-300 mb-2">Select an Exercise:</label>
        <select
          id="exercise"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Choose an exercise</option>
          {exercises.length > 0 ? (
            exercises.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))
          ) : (
            <option disabled>Loading exercises...</option>
          )}
        </select>
      </div>

      {loading && <p className="text-center text-gray-300">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Line Graph */}
      {progress.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progress}>
            <XAxis
              dataKey="recorded_at"
              tick={{ fill: "#fff" }}
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis tick={{ fill: "#fff" }} />
            <Tooltip contentStyle={{ backgroundColor: "black", borderRadius: "8px" }} />
            <Line type="monotone" dataKey="weight_lbs" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-300 mt-4">No data available for this exercise.</p>
      )}
    </div>
  );
}
