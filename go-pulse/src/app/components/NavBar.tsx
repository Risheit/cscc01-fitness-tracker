"use client";

import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";

const NavBar = () => {
    return (
        <div className="bg-gray-800 text-white p-4 flex space-x-4">
            <nav className="flex space-x-4">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/conversations" className="hover:underline">Chat</Link>
                <Link href="/exercise-videos" className="hover:underline">Info</Link>
                <Link href="/about" className="hover:underline">About</Link>
            </nav>
            <LogoutButton />
        </div>        
    );
};

export default NavBar;
