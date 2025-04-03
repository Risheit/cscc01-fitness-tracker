'use client';

import { DayOfWeek, WorkoutScheduleItem } from '@/app/models/Workout';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { redirect, RedirectType } from 'next/navigation';
import { useEffect, useState } from 'react';

function weekStartingToday(): DayOfWeek[] {
  const days: DayOfWeek[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
  }) as DayOfWeek;

  const todayIndex = days.indexOf(today);
  return [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
}

async function fetchUserWorkouts(): Promise<WorkoutScheduleItem[]> {
  const res = await fetch('/api/workouts');
  if (!res.ok) {
    return [];
  }
  return await res.json();
}

export default function ScheduledWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const days = weekStartingToday();

  async function deleteScheduledWorkout(workout: WorkoutScheduleItem) {
    return fetch(`/api/workout-exercises`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
      body: JSON.stringify({ id: workout.workoutDayId }),
    });
  }

  useEffect(() => {
    fetchUserWorkouts().then((workouts) => {
      setIsLoading(false);
      setWorkouts(workouts);
    });
  }, [isLoading]);

  return (
    <div className="flex flex-col bg-gray-200 py-6 min-h-screen px-8 md:px-20 gap-4">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Currently Scheduled Workouts
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Browse all your finished and upcoming workouts.
        </p>
      </div>

      {!isLoading &&
        days.map((day) => (
          <div key={day}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{day}</h2>
            {workouts.filter((workout) => workout.day === day).length > 0 ? (
              workouts
                .filter((workout) => workout.day === day)
                .sort((a, b) => a.time - b.time)
                .map((workout) => (
                  <div
                    key={workout.workoutDayId}
                    className="flex flex-row h-fit w-full align-top overflow-hidden rounded-xl border-1 border-gray-600 hover:cursor-pointer transition-all duration-200 my-4"
                  >
                    <div
                      className="h-32 w-40 flex-auto overflow-hidden relative group"
                      onClick={() =>
                        redirect(`/workout?id=${workout.id}`, RedirectType.push)
                      }
                    >
                      <Image
                        src={workout.imagePath ?? '/stock-running.jpg'}
                        alt="workout image"
                        fill
                        className="object-cover object-top transition-all duration-200"
                      />
                    </div>
                    <div className="flex flex-row h-fill w-full py-2 px-4 bg-gray-100 justify-between">
                      <div
                        className="flex flex-row h-fill flex-auto"
                        onClick={() =>
                          redirect(
                            `/workout?id=${workout.id}`,
                            RedirectType.push
                          )
                        }
                      >
                        <div className="flex-initial">
                          <p className="text-xl text-purple-800 font-black">
                            {workout.name}
                          </p>
                          <div className="flex-initial h-fit">
                            <p className="text-xs font-semibold">
                              Scheduled at
                            </p>
                            <p className="text-4xl font-black text-gray-800">{`${workout.time}:00`}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-initial flex-col justify-around h-fill px-2">
                        <button className="flex-initial" title="logout">
                          <FontAwesomeIcon
                            icon={faPen}
                            color="black"
                            size="xl"
                            fixedWidth
                          />
                        </button>
                        <button
                          className="flex-initial"
                          title="logout"
                          onClick={() => {
                            deleteScheduledWorkout(workout).then(() => {
                              setIsLoading(true);
                            });
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            color="brown"
                            size="xl"
                            fixedWidth
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-gray-600 mt-8">
                No workouts scheduled!
              </p>
            )}
          </div>
        ))}
    </div>
  );
}
