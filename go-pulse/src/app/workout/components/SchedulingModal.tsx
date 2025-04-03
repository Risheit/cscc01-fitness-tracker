'use client';

import { useRef, useState } from 'react';

interface Props {
  workoutId: number;
  onClose: () => void;
}

export function SchedulingModal({ workoutId, onClose }: Props) {
  const daySelected = useRef<HTMLSelectElement>(null);
  const timeSelected = useRef<HTMLInputElement>(null);
  const [isSchedulingError, setIsSchedulingError] = useState(false);

  async function saveSchedule() {
    const res = await fetch('/api/workouts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workoutId,
        dayOfWeek: daySelected.current?.value ?? 'Monday',
        time: Number(timeSelected.current?.value ?? 0),
      }),
    });

    if (res.status === 409) {
      setIsSchedulingError(true);
      return;
    }

    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg px-20 py-14 shadow-lg text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xl font-bold">Schedule this workout for</p>
        <select className="mt-4 p-4 border rounded" ref={daySelected}>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <p className="my-4 text-xl font-bold">at</p>
        <div className="flex flex-row w-fit mx-auto items-center">
          <input
            type="number"
            min="1"
            max="23"
            title={`Set time`}
            defaultValue="0"
            ref={timeSelected}
            onBlur={(e) => {
              if (e.target.value === '') {
                e.target.value = '0';
              } else if (Number(e.target.value) > 23) {
                e.target.value = '23';
              } else if (Number(e.target.value) < 0) {
                e.target.value = '0';
              }
            }}
            style={{
              appearance: 'none', // Firefox
              WebkitAppearance: 'none', // Chrome, Safari, Edge
              MozAppearance: 'textfield', // Firefox (alternative)
            }}
            className="w-10 h-8 text-center rounded-md border border-gray-600 mx-1"
          />
          <p className="text-gray-400 text-md mr-2">:00</p>
        </div>
        <button
          onClick={saveSchedule}
          className="flex-initial w-fit mt-10 bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
        >
          Schedule Workout
        </button>
        <p className={`text-red-500 mt-4 ${isSchedulingError ? '' : 'invisible'}`}>
          You&apos;ve already scheduled this workout for this time!
        </p>
      </div>
    </div>
  );
}
