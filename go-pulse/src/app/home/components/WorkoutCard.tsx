import { WorkoutPlan } from '@/app/models/Workout';
import Image from 'next/image';
import { redirect } from 'next/navigation';

interface Props {
  plan: WorkoutPlan;
}

export default function WorkoutCard({ plan }: Props) {
  return (
    <div
      className="flex flex-col h-44 w-40 align-top overflow-hidden rounded-xl border-1 border-gray-600"
      onClick={() => redirect(`/workout?id=${plan.id}`)}
    >
      <div className="h-3/4 flex-auto overflow-hidden relative">
        <Image
          src={plan.imagePath}
          alt="workout image"
          fill
          className="object-cover object-top"
        />
      </div>
      <div className="flex-initial h-fit w-full flex flex-col py-2 px-4 bg-gray-100">
        <p className="text-sm text-purple-800 font-black">{plan.name}</p>
        <p className="text-xs">Select</p>
      </div>
    </div>
  );
}
