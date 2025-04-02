'use client';

import {
  NinjaApiExercise,
  Day,
  fetchNinjaExercises,
  addExerciseToWorkout,
  createWorkout,
  SelectedExercise,
  DayOfWeek,
} from '@/app/models/Ninja';
import { useState, useEffect } from 'react';
import StepperMenu from './StepperMenu';
import { DropdownMenu } from './DropdownMenu';

export default function WorkoutBuilder() {
  const daysOfWeek: DayOfWeek[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const [exercises, setExercises] = useState<NinjaApiExercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [search, setSearch] = useState('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [muscleGroup, setMuscleGroup] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');

  useEffect(() => {
    async function fetchExercises() {
      const uniqueExercises = await fetchNinjaExercises(
        muscleGroup,
        exerciseType,
        difficulty,
        search
      );
      setExercises(uniqueExercises);
    }

    fetchExercises();
  }, [exerciseType, muscleGroup, difficulty, search]);

  function addSelectedExercise(exercise: NinjaApiExercise) {
    const exerciseToAdd =
      exercise.type !== 'cardio'
        ? { ...exercise, sets: 3, reps: 10 }
        : { ...exercise, mins: 10 };

    setSelectedExercises((prev) => prev.concat(exerciseToAdd));
  }

  function updateExerciseDetails(
    exerciseName: string,
    field: 'sets' | 'reps' | 'mins',
    value: number
  ) {
    setSelectedExercises((prev) =>
      prev.map((exercise) => {
        return exerciseName === exercise.name
          ? { ...exercise, [field]: Math.max(1, value) }
          : exercise;
      })
    );
  }

  function removeSelectedExercise(exercise: NinjaApiExercise) {
    setSelectedExercises((prev) =>
      prev.filter((e) => e.name !== exercise.name)
    );
  }

  function removeSelectedDay(day: Day) {
    setSelectedDays((prev) =>
      prev.filter((d) => !(d.day === day.day && d.time === day.time))
    );
  }

  function addNewDay(newDay: DayOfWeek) {
    // Find some time period without conflicts
    let time = 0;
    while (selectedDays.some((d) => d.day === newDay && d.time === time)) {
      time += 1;
      if (time > 23) {
        // No time periods available
        return;
      }
    }

    setSelectedDays((prev) =>
      prev.some((d) => d.day === newDay && d.time === time) // Check if the day already exists
        ? prev
        : prev.concat({ day: newDay, time })
    );
  }

  async function addWorkout() {
    const workoutId = await createWorkout(workoutName, selectedDays);

    for (const day of selectedDays) {
      let position = 1;
      for (const exercise of selectedExercises) {
        addExerciseToWorkout(workoutId, day, exercise, position);
        position++;
      }
    }

    alert('Workout Created!');
  }

  return (
    <div className="min-h-screen bg-gray-100 text-white">
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
            {daysOfWeek.map((day) => (
              <button
                key={day}
                onClick={() => addNewDay(day)}
                className={`p-2 mr-2 mb-2 rounded-md bg-blue-500`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time selection */}
        <div className="mb-4">
          {selectedDays.length > 0 &&
            selectedDays.map((day, index) => (
              <li
                key={`${index}`}
                className="bg-gray-700 p-2 my-1 rounded-md flex items-center justify-between"
              >
                <span className="text-sm">{day.day} at</span>
                <div className="flex items-center space-x-2">
                  <StepperMenu
                    name="sets"
                    value={day.time}
                    displayed={`:00`}
                    min={0}
                    max={23}
                    onValueUpdate={(time, changeType) => {
                      let newTime = time;
                      const timeExists = (d: Day) =>
                        d.day === day.day && d.time === newTime;
                      while (selectedDays.some(timeExists)) {
                        newTime += changeType === 'decrease' ? -1 : 1;
                        if (newTime > 23) {
                          newTime = 0;
                        } else if (newTime < 0) {
                          newTime = 23;
                        }

                        if (newTime === time) {
                          return; // No time periods available
                        }
                      }

                      setSelectedDays((prev) =>
                        prev.map((d) =>
                          d.day === day.day && d.time === day.time
                            ? { ...d, time: newTime }
                            : d
                        )
                      );
                    }}
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => removeSelectedDay(day)}
                    className="text-red-500 text-sm px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-700"
                  >
                    ✖
                  </button>
                </div>
              </li>
            ))}
        </div>

        <div className="flex space-x-4 mb-4">
          {/* Filter Dropdowns for Exercise */}
          <DropdownMenu
            options={[
              { value: '', name: 'Select Type' },
              { value: 'cardio', name: 'Cardio' },
              { value: 'strength', name: 'Strength' },
              { value: 'olympic_weightlifting', name: 'Olympic Weightlifting' },
              { value: 'plyometrics', name: 'Plyometrics' },
              { value: 'powerlifting', name: 'Powerlifting' },
              { value: 'stretching', name: 'Stretching' },
              { value: 'strongman', name: 'Strongman' },
            ]}
            value={exerciseType}
            onChange={setExerciseType}
          />

          {/* Muscle Group Dropdown */}
          <DropdownMenu
            options={[
              { value: '', name: 'Select Muscle' },
              { value: 'abdominals', name: 'Abdominals' },
              { value: 'abductors', name: 'Abductors' },
              { value: 'adductors', name: 'Adductors' },
              { value: 'biceps', name: 'Biceps' },
              { value: 'calves', name: 'Calves' },
              { value: 'chest', name: 'Chest' },
              { value: 'forearms', name: 'Forearms' },
              { value: 'glutes', name: 'Glutes' },
              { value: 'hamstrings', name: 'Hamstrings' },
              { value: 'lats', name: 'Lats' },
              { value: 'lower_back', name: 'Lower Back' },
              { value: 'middle_back', name: 'Middle Back' },
              { value: 'neck', name: 'Neck' },
              { value: 'quadriceps', name: 'Quadriceps' },
              { value: 'traps', name: 'Traps' },
              { value: 'triceps', name: 'Triceps' },
            ]}
            value={muscleGroup}
            onChange={setMuscleGroup}
          />

          {/* Difficulty Level */}
          <DropdownMenu
            options={[
              { value: '', name: 'Select Difficulty' },
              { value: 'beginner', name: 'Beginner' },
              { value: 'intermediate', name: 'Intermediate' },
              { value: 'expert', name: 'Expert' },
            ]}
            value={difficulty}
            onChange={setDifficulty}
          />
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
              <div
                key={exercise.name}
                className="bg-gray-700 p-4 rounded-lg shadow-md"
              >
                <h3 className="font-semibold">{exercise.name}</h3>
                <p className="text-sm text-gray-300">
                  {exercise.muscle} | {exercise.equipment}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => addSelectedExercise(exercise)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md mb-2"
                  >
                    Add to Workout
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Selected Exercises */}
        {selectedExercises.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-6">Selected Exercises</h2>
            <ul className="mt-2 space-y-2">
              {selectedExercises.map((exercise, index) => (
                <li
                  key={`${index}`}
                  className="bg-gray-700 p-2 my-1 rounded-md flex items-center justify-between"
                >
                  <span className="text-sm">{exercise.name}</span>

                  <div className="flex items-center space-x-2">
                    {/* Set/Rep Stepper */}
                    {exercise.type !== 'cardio' && (
                      <StepperMenu
                        name="sets"
                        value={exercise.sets ?? 3}
                        min={1}
                        onValueUpdate={(updated) =>
                          updateExerciseDetails(exercise.name, 'sets', updated)
                        }
                      />
                    )}
                    {exercise.type !== 'cardio' && (
                      <StepperMenu
                        name="reps"
                        value={exercise.reps ?? 3}
                        min={1}
                        onValueUpdate={(updated) =>
                          updateExerciseDetails(exercise.name, 'reps', updated)
                        }
                      />
                    )}

                    {/* Minutes Stepper */}
                    {exercise.type === 'cardio' && (
                      <StepperMenu
                        name="minutes"
                        value={exercise.mins ?? 3}
                        min={1}
                        onValueUpdate={(updated) =>
                          updateExerciseDetails(exercise.name, 'mins', updated)
                        }
                      />
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeSelectedExercise(exercise)}
                      className="text-red-500 text-sm px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-700"
                    >
                      ✖
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Save Workout Button */}
        <button
          onClick={addWorkout}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold"
        >
          Save Workout
        </button>
      </div>
    </div>
  );
}
