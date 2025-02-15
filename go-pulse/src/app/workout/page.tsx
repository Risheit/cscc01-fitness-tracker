import ExerciseData from "../models/Workout";
import ExerciseScreen from "./components/ExerciseScreen";

export default function WorkoutPage() {
  const dummyData: ExerciseData[] = [
    {
      name: 'Bench Press',
      description:
        "Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it's dark, and listening at a volume that allows you to hear traffic and other hazards.",
      imagePath: '/weight.jpg',
      video_id: 'gMgvBspQ9lk',
      type: 'Sets',
      sets: 4,
      reps: 2,
    },
    {
      name: 'Squats',
      description:
        "Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it's dark, and listening at a volume that allows you to hear traffic and other hazards.",
      imagePath: '/weight.jpg',
      video_id: 'i7J5h7BJ07g',
      type: 'Timed',
      mins: 1,
    },
    {
      name: 'Squats 2',
      description:
        "Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it's dark, and listening at a volume that allows you to hear traffic and other hazards.",
      imagePath: '/weight.jpg',
      video_id: 'i7J5h7BJ07g',
      type: 'Timed',
      mins: 1,
    },
  ];

  return (
    <ExerciseScreen exercises={dummyData} />
  );
}
