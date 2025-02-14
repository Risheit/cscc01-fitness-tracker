import Image from 'next/image';
import RepBottomButton from '../Workout/Components/RepBottomButton';
import RepData from '../models/RepData';

export default function RepScreen() {
  const dummyData: RepData = {
    exerciseName: 'Weight Lifting',
    exerciseDescription: 'Focus on proper form to avoid injury. Use a full range of motion and control your reps. Remember to rest between sets and stay hydrated.',
    exerciseImagePath: '/weight.jpg',
    currentSet: 1,
    currentRep: 1,
  };

  return (
    <main className="relative w-full h-screen">
      {/* Image takes up the top half of the screen */}
      <div className="absolute top-0 w-full h-2/3">
        <Image 
          src={dummyData.exerciseImagePath} 
          alt="Weight Icon" 
          layout="fill" 
          objectFit="cover"
          className="z-0"
        />
      </div>

      {/* Exercise Link */}
      <div className="absolute top-0 w-full flex justify-center py-4 z-10">
        <a href="#" className="text-xl text-white bg-black px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Watch Exercise Video
        </a>
      </div>

      {/* Rep counter with a little overlap on the image */}
      <RepBottomButton 
        className="flex-auto top-2/4 w-full h-2/4 absolute z-10" 
        data={dummyData} 
      />
    </main>
  );
}
