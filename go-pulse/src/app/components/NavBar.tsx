"use client";

import Link from "next/link";

const NavBar = () => {
    return (
        <nav className="bg-gray-800 text-white p-4 flex space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/exercise-videos" className="hover:underline">Info</Link>
            <Link href="/about" className="hover:underline">About</Link>
        </nav>
    );
};

export default NavBar;
