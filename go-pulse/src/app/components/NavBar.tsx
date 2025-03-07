'use client';

interface Props {
  tabNames: string[];
  setCurrentTab: (name: string) => void;
}

const NavBar = ({ tabNames, setCurrentTab }: Props) => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-initial space-x-4 h-fit">
      {tabNames.map((name) => (
        <div
          key={name}
          className="hover:underline"
          onClick={() => setCurrentTab(name)}
        >
          {name}
        </div>
      ))}
    </nav>
  );
};

export default NavBar;
