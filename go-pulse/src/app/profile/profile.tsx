'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProfile, User } from '../models/User';

export default function Profile() {
  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  return (
    <main className="relative w-full h-screen overflow-y-auto bg-gray-100 flex flex-col items-center">
      <header className="w-full text-center py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <Link
          href="/profile/edit"
          className="absolute right-4 top-4 bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-600 transition"
        >
          Edit
        </Link>
      </header>

      <div className="flex items-center bg-white p-6 rounded-lg shadow-md mt-3 w-11/12 max-w-2xl">
        {/* Profile Picture - Left Side */}
        <div className="relative flex-initial mr-6 w-48 h-48">
          <Image
            src="/profile-picture.jpg"
            alt="User Profile"
            fill
            className="object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="text-gray-900">
          <h2 className="text-lg font-semibold">{profile?.fullName ?? ''}</h2>
          <p className="text-sm text-gray-600">Age: {profile?.age ?? ''}</p>
          <p className="text-sm text-gray-600">
            Weight: {profile?.weight ?? ''} lbs
          </p>
          <p className="text-sm text-gray-600">
            Gender: {profile?.gender ?? ''}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center bg-white p-4 mt-4 rounded-lg shadow-md w-11/12 max-w-2xl">
        <h3 className="text-md font-semibold text-gray-900 mb-2">Bio</h3>
        <p className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 resize-none focus:ring focus:ring-blue-300">
          {profile?.bio ?? ''}
        </p>
      </div>

      <div className="flex flex-col items-center bg-white p-4 mt-4 rounded-lg shadow-md w-11/12 max-w-2xl">
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          You&#39;re on a
        </p>
        <p className="text-lg font-bold text-gray-900 flex items-center">
          3 day streak <span className="text-red-500 text-xl ml-2">🔥</span>
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 mt-4 w-11/12 max-w-2xl">
        <button className="flex items-center bg-white p-4 w-full rounded-lg shadow-md hover:bg-gray-200 transition">
          <Image
            src="/achievements-icon.png"
            alt="Achievements"
            width={50}
            height={50}
          />
          <p className="ml-4 text-gray-900 font-semibold">My Achievements</p>
        </button>

        <button className="flex items-center bg-white p-4 w-full rounded-lg shadow-md hover:bg-gray-200 transition">
          <Image src="/friends-icon.png" alt="Friends" width={50} height={50} />
          <p className="ml-4 text-gray-900 font-semibold">My Friends</p>
        </button>

        <button className="flex items-center bg-white p-4 w-full rounded-lg shadow-md hover:bg-gray-200 transition">
          <Image
            src="/schedule-icon.png"
            alt="Schedule"
            width={50}
            height={50}
          />
          <p className="ml-4 text-gray-900 font-semibold">My Schedule</p>
        </button>
      </div>
    </main>
  );
}
