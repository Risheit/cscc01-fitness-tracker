'use client';

import { redirect, RedirectType } from 'next/navigation';
import LogoutButton from './LogoutButton';
import Image from 'next/image';

interface Props {
  tabs: { name: string; image: string }[];
}

function changeToTab(tabName: string) {
  const cleanedTabName = tabName.toLowerCase().replaceAll(' ', '-');
  redirect(`/home?tab=${cleanedTabName}`, RedirectType.replace);
}

const NavBar = ({ tabs }: Props) => {
  return (
    <nav className="bg-gray-700 text-white p-4 flex justify-between flex-initial space-x-4 h-fits">
      <div className="flex flex-row gap-6">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className="hover:underline flex-auto cursor-pointer"
            onClick={() => changeToTab(tab.name)}
          >
            <Image
              className='invert'
              src={tab.image}
              alt={tab.name}
              width={32}
              height={32}
              title={tab.name}
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
