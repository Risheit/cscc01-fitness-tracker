import Image from 'next/image';
import ExerciseBottomSheet from './components/ExerciseBottomSheet';
import ExerciseData from '../models/ExerciseData';

export default function ExerciseScreen() {
  const dummyData: ExerciseData = {
    exerciseName: 'Running',
    exerciseDescription:
      "Always warm up before starting and maintain proper form by keeping your posture upright and landing softly on your feet to reduce impact. Stay aware of your surroundings by running in well-lit areas, wearing reflective gear if it's dark, and listening at a volume that allows you to hear traffic and other hazards.",
    exerciseImagePath: '/stock-running.jpg',
    exerciseType: 'Timed',
    mins: 60,
  };

  return (
    <main className="flex flex-col h-full w-full">
      <div className="flex h-2/5 relative overflow-hidden">
        <Image
          src={dummyData.exerciseImagePath}
          alt=""
          fill
          className="w-full h-2/3 object-cover object-top"
        />
      </div>
      <ExerciseBottomSheet
        className="flex-auto top-1/3 w-full h-2/3 absolute z-10"
        data={dummyData}
      />
    </main>
  );
}
