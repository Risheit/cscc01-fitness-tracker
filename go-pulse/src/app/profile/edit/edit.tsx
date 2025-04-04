"use client";

import { getProfile, updateProfile, User } from "@/app/models/User";
import Image from "next/image";
import { useRouter } from "next/navigation";;
import React, { useEffect, useRef, useState } from "react";

export default function EditProfile() {
    const router = useRouter();
    const [profile, setProfile] = useState<User>();
    const name = useRef<HTMLInputElement>(null);
    const weight = useRef<HTMLInputElement>(null);
    const age = useRef<HTMLInputElement>(null);
    const gender = useRef<HTMLSelectElement>(null);
    const bio = useRef<HTMLTextAreaElement>(null);
    const [profilePic, setProfilePic] = useState("/profile-picture.jpg");

    useEffect(() => {
        getProfile().then(setProfile);
    }, []);

    // Handle profile picture upload
    const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const imageUrl = URL.createObjectURL(event.target.files[0]);
            setProfilePic(imageUrl);
        }
    };

    const handleSave = () => {
        const profileData: User = {
            fullName: name.current?.value,
            weight: weight.current?.value ? parseInt(weight.current.value) : undefined,
            age: age.current?.value ? parseInt(age.current.value) : undefined,
            gender: gender.current?.value,
            bio: bio.current?.value,
        };
    
        // Save to localStorage
        updateProfile(profileData);
    
        // Redirect to profile page
        router.push("/profile");
    };

    return (
        <main className="relative w-full h-screen overflow-y-auto flex flex-col items-center bg-gray-100 p-4">
            
            {/* Page Header */}
            <header className="w-full text-center py-4 bg-white shadow-md">
                <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            </header>

            {/* Profile Edit Container */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-4 w-11/12 max-w-lg">

                <div className="mx-auto relative w-24 h-24 flex justify-center mb-4">
                    <Image
                        src="/profile-picture.jpg"
                        alt="Profile Picture" 
                        fill
                        className="rounded-full object-cover"
                    />
                </div>

                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-6">
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="mt-2 text-sm"
                        onChange={handleProfilePicChange}
                    />
                </div>

                {/* Name Input */}
                <label className="block text-gray-800 font-medium">Name</label>
                <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full p-2 border border-gray-400 rounded-lg text-gray-900"
                    defaultValue={profile?.fullName ?? ''}
                    ref={name}
                />

                {/* Age Input */}
                <label className="block text-gray-800 font-medium mt-4">Age</label>
                <input 
                    type="number" 
                    placeholder="Enter age"
                    className="w-full p-2 border border-gray-400 rounded-lg text-gray-900"
                    defaultValue={profile?.age ?? ''}
                    ref={age}
                />

                {/* Weight Input */}
                <label className="block text-gray-800 font-medium mt-4">Weight (lbs)</label>
                <input 
                    type="number" 
                    placeholder="Enter weight"
                    className="w-full p-2 border border-gray-400 rounded-lg text-gray-900"
                    defaultValue={profile?.weight ?? ''}
                    ref={weight}
                />

                {/* Gender Selection */}
                <label className="block text-gray-800 font-medium mt-4">Gender</label>
                <select 
                    className="w-full p-2 border border-gray-400 rounded-lg text-gray-900"
                    defaultValue={profile?.gender ?? ''}
                    ref={gender}
                >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                {/* Bio Input */}
                <label className="block text-gray-800 font-medium mt-4">Biography</label>
                <textarea 
                    placeholder="Write about yourself..."
                    maxLength={500}
                    className="w-full p-2 border border-gray-400 rounded-lg text-gray-900"
                    rows={4}
                    defaultValue={profile?.bio ?? ''}
                    ref={bio}
                />

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button 
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        onClick={() => router.push("/profile")}
                    >
                        Cancel
                    </button>
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </main>
    );
}