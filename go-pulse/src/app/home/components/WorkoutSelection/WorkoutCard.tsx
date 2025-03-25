import { WorkoutPlan } from '@/app/models/Workout';
import Image from 'next/image';
import { redirect, RedirectType } from 'next/navigation';

interface Props {
  plan: WorkoutPlan;
}

export default function WorkoutCard({ plan }: Props) {
  return (
    <div
      className="flex flex-col h-44 w-40 align-top overflow-hidden rounded-xl border-1 border-gray-600 hover:cursor-pointer transition-all duration-200"
      onClick={() => redirect(`/workout?id=${plan.id}`, RedirectType.push)}
    >
      <div className="h-3/4 flex-auto overflow-hidden relative group">
        <Image
          src={plan.imagePath ?? '/stock-running.jpg'}
          alt="workout image"
          fill
          className="object-cover object-top transition-all duration-200"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
      </div>
      <div className="flex-initial h-fit w-full flex flex-col py-2 px-4 bg-gray-100">
        <p className="text-sm text-purple-800 font-black">{plan.name}</p>
        <p className="text-xs">Select</p>
      </div>
    </div>
  );
}
