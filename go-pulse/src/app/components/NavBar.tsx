"use client";

import Link from "next/link";

const NavBar = () => {
    return (
        <nav className="bg-gray-800 text-white p-4 flex space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/exerciseVideos" className="hover:underline">Info</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/finished_workouts" className="hover:underline">Frequent Workouts</Link>
        </nav>
    );
};

export default NavBar;
