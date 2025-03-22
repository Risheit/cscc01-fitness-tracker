"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


export default function Profile() {
    const [isClient, setIsClient] = useState(false);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("");
    const [bio, setBio] = useState("");    

    useEffect(() => {
        setIsClient(true);

        const storedProfile = localStorage.getItem("profileData");
        if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            setName(profile.full_name || "");
            setAge(profile.age || "");
            setWeight(profile.weight_lbs || "");
            setGender(profile.gender || "");
            setBio(profile.bio || "");
        }
    }, []);

    return (
        <main className="relative w-full h-screen overflow-y-auto bg-gray-100 flex flex-col items-center">
           
            <header className="w-full text-center py-4 bg-white shadow-md">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <Link
                href="/profile/edit"
                className="absolute right-4 top-4 bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                >Edit
                </Link>
            </header>

            <div className="flex items-center bg-white p-6 rounded-lg shadow-md mt-3 w-11/12 max-w-2xl">
                {/* Profile Picture - Left Side */}
                <div className="mr-6">
                    {isClient && (
                        <Image
                            src="/profile-picture.jpg"
                            alt="User Profile"
                            width={150} 
                            height={150}
                            className="w-[150px] h-[150px] object-cover rounded-lg shadow-lg"
                        />
                    )}
                </div>

                <div className="text-gray-900">
                    <h2 className="text-lg font-semibold">{name}</h2>
                    <p className="text-sm text-gray-600">Age: {age}</p>
                    <p className="text-sm text-gray-600">Weight: {weight} lbs</p>
                    <p className="text-sm text-gray-600">Gender: {gender}</p>
                </div>
            </div>

            <div className="flex flex-col items-center bg-white p-4 mt-4 rounded-lg shadow-md w-11/12 max-w-2xl">
                <h3 className="text-md font-semibold text-gray-900 mb-2">Bio</h3>
                <p className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 resize-none focus:ring focus:ring-blue-300">{bio}</p>
            </div>

            <div className="flex flex-col items-center bg-white p-4 mt-4 rounded-lg shadow-md w-11/12 max-w-2xl">
                <p className="text-xs text-gray-500 uppercase tracking-widest">You&#39;re on a</p>
                <p className="text-lg font-bold text-gray-900 flex items-center">
                    3 day streak <span className="text-red-500 text-xl ml-2">🔥</span>
                </p>
            </div>

            <div className="flex flex-col items-center gap-4 mt-4 w-11/12 max-w-2xl">

                <button className="flex items-center bg-white p-4 w-full rounded-lg shadow-md hover:bg-gray-200 transition">
                    <Image src="/achievements-icon.png" alt="Achievements" width={50} height={50} />
                    <p className="ml-4 text-gray-900 font-semibold">My Achievements</p>
                </button>

                <button className="flex items-center bg-white p-4 w-full rounded-lg shadow-md hover:bg-gray-200 transition">
                    <Image src="/friends-icon.png" alt="Friends" width={50} height={50} />
                    <p className="ml-4 text-gray-900 font-semibold">My Friends</p>
                </button>

                <button className="flex items-center bg-white p-4 w-full rounded-lg shadow-md hover:bg-gray-200 transition">
                    <Image src="/schedule-icon.png" alt="Schedule" width={50} height={50} />
                    <p className="ml-4 text-gray-900 font-semibold">My Schedule</p>
                </button>

            </div>
        </main>
    );
}
