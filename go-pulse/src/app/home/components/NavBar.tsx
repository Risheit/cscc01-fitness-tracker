'use client';

import { redirect, RedirectType } from 'next/navigation';
import LogoutButton from './LogoutButton';

interface Props {
  tabNames: string[];
}

// Internally, represent tabs in all lowercase with dashes between words:
//    About Us --> about-us
function changeToTab(tabName: string) {
  const cleanedTabName = tabName.toLowerCase().replaceAll(' ', '-');
  redirect(`/home?tab=${cleanedTabName}`, RedirectType.replace);
}


const NavBar = ({ tabNames }: Props) => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between flex-initial space-x-4 h-fit">
      <div className="flex flex-row gap-3">
        {tabNames.map((name) => (
          <div
            key={name}
            className="hover:underline flex-auto"
            onClick={() => changeToTab(name)}
          >
            {name}
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
