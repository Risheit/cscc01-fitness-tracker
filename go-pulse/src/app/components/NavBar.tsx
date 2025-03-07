'use client';

import LogoutButton from './LogoutButton';

interface Props {
  tabNames: string[];
  setCurrentTab: (name: string) => void;
}

const NavBar = ({ tabNames, setCurrentTab }: Props) => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between flex-initial space-x-4 h-fit">
      <div className="flex flex-row gap-3">
        {tabNames.map((name) => (
          <div
            key={name}
            className="hover:underline flex-auto"
            onClick={() => setCurrentTab(name)}
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
