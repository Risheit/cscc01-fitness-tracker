"use client";

import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";

const NavBar = () => {
    return (
        <nav className="bg-gray-800 text-white p-4 flex space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/conversations" className="hover:underline">Chat</Link>
            <Link href="/exercise-videos" className="hover:underline">Info</Link>
            <Link href="/workout-builder" className="hover:underline">Create a Workout</Link>
            <Link href="/about" className="hover:underline">About</Link>
        </nav>
    );
};

export default NavBar;
