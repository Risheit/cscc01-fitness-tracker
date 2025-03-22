"use client";

import { useRouter } from "next/navigation";
//import React, { useState } from "react";
import React, { useEffect, useState } from "react";

export default function EditProfile() {
    const router = useRouter();

    /*
    const [name, setName] = useState("Khabib Nurmagomedov");
    const [age, setAge] = useState("36");
    const [weight, setWeight] = useState("155");
    const [gender, setGender] = useState("Male");
    const [bio, setBio] = useState("#1 Pound for Pound fighter");
    const [profilePic, setProfilePic] = useState("/profile-picture.jpg");*/

    //const [isClient, setIsClient] = useState(false);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("");
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState("/default-profile.jpg");


    useEffect(() => {
        
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/profile`);
                if (!res.ok) throw new Error('Failed to load profile');

                const data = await res.json();
                setName(data.full_name || '');
                setWeight(data.weight_lbs?.toString() || '');
                setAge(data.age?.toString() || '');
                setGender(data.gender || '');
                setBio(data.bio || '');
                    
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);


    // Handle profile picture upload
    const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const imageUrl = URL.createObjectURL(event.target.files[0]);
            //setProfile({ ...profile, profile_pic: imageUrl });
            setProfilePic(imageUrl);
        }
    };
/*
    const handleSave = async () => {
        try {
          const res = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              full_name: name,
              weight_lbs: Number(weight),
              age: Number(age),
              gender,
              bio,
            }),
          });
          
          if (res.ok) {
            router.push("/profile");
          } else {
            const Data = await res.json();
            console.error("Failed to save:", Data.message || "Unknown error");
          }
        } catch (error) {
            console.error("Error saving profile:", error);
        }  
    };
*/

    const handleSave = () => {
        const profileData = {
            full_name: name,
            weight_lbs: weight,
            age: age,
            gender: gender,
            bio: bio,
        };
    
        // Save to localStorage
        localStorage.setItem("profileData", JSON.stringify(profileData));
    
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

                <div className="flex justify-center mb-4">
                    <img 
                        src={profilePic} 
                        alt="Profile Picture" 
                        className="w-24 h-24 rounded-full object-cover"
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
                    value={name}
                    //onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    onChange={(e) => setName(e.target.value)}
                />
                

                {/* Age Input */}
                <label className="block text-gray-800 font-medium mt-4">Age</label>
                <input 
                    type="number" 
                    placeholder="Enter age"
                    className="w-full p-2 border border-gray-400 rounded-lg text-gray-900"
                    value={age}
                    //onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    onChange={(e) => setAge(e.target.value)}
                />

                {/* Weight Input */}
                <label className="block text-gray-800 font-medium mt-4">Weight (lbs)</label>
                <input 
                    type="number" 
                    placeholder="Enter weight"
                    className="w-full p-2 border border-gray-400 rounded-lg text-gray-900"
                    value={weight}
                    //onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    onChange={(e) => setWeight(e.target.value)}
                />

                {/* Gender Selection */}
                <label className="block text-gray-800 font-medium mt-4">Gender</label>
                <select 
                    className="w-full p-2 border border-gray-400 rounded-lg text-gray-900"
                    value={gender}
                    //onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    onChange={(e) => setGender(e.target.value)}
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
                    value={bio}
                    //onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    onChange={(e) => setBio(e.target.value)}
                />
                <p className="text-sm text-gray-500">{bio.length}/500 characters</p>

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
                        //onClick={() => alert("Feature not implemented yet!")}
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </main>
    );
}