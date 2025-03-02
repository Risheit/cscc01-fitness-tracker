'use client';

import { useState, useEffect } from "react";
import NavBar from "../components/NavBar"; // Importing the NavBar component

interface Exercise {
  name: string;
  muscle: string;
  type: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

interface Day {
  day: string;
  exercises: Exercise[];
}

export default function WorkoutBuilder() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Day[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // Track selected days
  const [exerciseType, setExerciseType] = useState<string>("");
  const [muscleGroup, setMuscleGroup] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");

  const API_KEY = "NdkDHejsQYSeUoRM7IbM7g==LURTckWlIS0A8S1P";

  async function fetchExercises() {
    let url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscleGroup}&type=${exerciseType}&difficulty=${difficulty}`;

    if (search) {
      url += `&name=${search}`;
    }

    const response = await fetch(url, {
      headers: { "X-Api-Key": API_KEY },
    });

    const data = await response.json();
    setExercises(data);
  }

  useEffect(() => {
    fetchExercises();
  }, [exerciseType, muscleGroup, difficulty, search]);

  function addExerciseToDay(exercise: Exercise, day: string) {
    // Check if the day already has exercises, otherwise create a new entry
    setSelectedExercises((prev) => {
      const dayExists = prev.find((item) => item.day === day);
      if (dayExists) {
        dayExists.exercises.push(exercise);
        return [...prev];
      }
      return [...prev, { day, exercises: [exercise] }];
    });
  }

  function removeExerciseFromDay(exercise: Exercise, day: string) {
    setSelectedExercises((prev) => {
      const dayExercises = prev.find((item) => item.day === day);
      if (dayExercises) {
        dayExercises.exercises = dayExercises.exercises.filter(
          (e) => e.name !== exercise.name
        );
      }
      return [...prev];
    });
  }

  function toggleDaySelection(day: string) {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      }
      return [...prev, day];
    });
  }

  async function createWorkout() {
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: workoutName, days: selectedDays }),
    });

    const workout = await res.json();

    for (const day of selectedExercises) {
      for (const exercise of day.exercises) {
        await fetch("/api/workout_exercises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workout_id: workout.id,
            day_of_week: day.day,
            name: exercise.name,
            sets: 3,
            reps: 10,
            weight: null,
            rest_time: 60,
          }),
        });
      }
    }

    alert("Workout Created!");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />

      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Workout</h1>

        {/* Workout Name Input */}
        <input
          type="text"
          placeholder="Workout Name"
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white focus:ring focus:ring-blue-500"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
        />

        {/* Day Selection */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Select Days of the Week</h3>
          <div className="flex flex-wrap">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <button
                key={day}
                onClick={() => toggleDaySelection(day)}
                className={`p-2 mr-2 mb-2 rounded-md ${
                  selectedDays.includes(day) ? "bg-blue-500" : "bg-gray-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Dropdowns for Exercise */}
        <div className="flex space-x-4 mb-4">
          {/* Exercise Type */}
          <select
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="olympic_weightlifting">Olympic Weightlifting</option>
            <option value="plyometrics">Plyometrics</option>
            <option value="powerlifting">Powerlifting</option>
            <option value="stretching">Stretching</option>
            <option value="strongman">Strongman</option>
          </select>

          {/* Muscle Group */}
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring focus:ring-blue-500"
          >
            <option value="">Select Muscle</option>
            <option value="abdominals">Abdominals</option>
            <option value="abductors">Abductors</option>
            <option value="adductors">Adductors</option>
            <option value="biceps">Biceps</option>
            <option value="calves">Calves</option>
            <option value="chest">Chest</option>
            <option value="forearms">Forearms</option>
            <option value="glutes">Glutes</option>
            <option value="hamstrings">Hamstrings</option>
            <option value="lats">Lats</option>
            <option value="lower_back">Lower Back</option>
            <option value="middle_back">Middle Back</option>
            <option value="neck">Neck</option>
            <option value="quadriceps">Quadriceps</option>
            <option value="traps">Traps</option>
            <option value="triceps">Triceps</option>
          </select>

          {/* Difficulty Level */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring focus:ring-blue-500"
          >
            <option value="">Select Difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search exercises..."
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-white focus:ring focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Exercise List */}
        <h2 className="text-xl font-semibold mb-3">Select Exercises</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises
            .filter((exercise) =>
              exercise.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((exercise) => (
              <div key={exercise.name} className="bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold">{exercise.name}</h3>
                <p className="text-sm text-gray-300">{exercise.muscle} | {exercise.equipment}</p>
                <div className="mt-2">
                  {selectedDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => addExerciseToDay(exercise, day)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md mb-2"
                    >
                      Add to {day}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Selected Exercises */}
        {selectedExercises.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-6">Selected Exercises</h2>
            <ul className="mt-2">
              {selectedExercises.map((day, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-lg">{day.day}</h3>
                  {day.exercises.map((exercise, idx) => (
                    <li key={idx} className="bg-gray-700 p-2 rounded-md mt-2 flex justify-between">
                      {exercise.name}
                      <button
                        onClick={() => removeExerciseFromDay(exercise, day.day)}
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </div>
              ))}
            </ul>
          </>
        )}

        {/* Save Workout Button */}
        <button
          onClick={createWorkout}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold"
        >
          Save Workout
        </button>
      </div>
    </div>
  );
}
