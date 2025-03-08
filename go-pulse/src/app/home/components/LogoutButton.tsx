'use client';

import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' }); // Call logout API
      router.push('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-5 h-5 flex-initial"
      title="logout"
    >
      <FontAwesomeIcon
        icon={faArrowRightFromBracket}
        color="white"
        fixedWidth
      />
    </button>
  );
};

export default LogoutButton;
