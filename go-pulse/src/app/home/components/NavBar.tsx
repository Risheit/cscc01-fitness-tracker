'use client';

import { redirect, RedirectType } from 'next/navigation';
import LogoutButton from './LogoutButton';
import Image from 'next/image';

interface Props {
  tabImages: string[]; 
}

function changeToTab(tabName: string) {
  const cleanedTabName = tabName.toLowerCase().replaceAll(' ', '-');
  redirect(`/home?tab=${cleanedTabName}`, RedirectType.replace);
}

const NavBar = ({ tabImages }: Props) => {
  const tabNames = ['Workouts', 'Workout Builder', 'Conversation', 'Finished_Workouts'];

  return (
    <nav className="bg-gray-700 text-white p-4 flex justify-between flex-initial space-x-4 h-fits">
      <div className="flex flex-row gap-3">
        {tabImages.map((image, index) => (
          <div
            key={index}
            className="hover:underline flex-auto cursor-pointer"
            onClick={() => changeToTab(tabNames[index])}
          >
            <Image
              src={image}
              alt={tabNames[index]}
              width={32}  
              height={32}
              title={tabNames[index]} 
            />
          </div>
        ))}
      </div>
      <div className="flex-initial">
        <LogoutButton />
      </div>
    </nav>
  );
};

export default NavBar;
