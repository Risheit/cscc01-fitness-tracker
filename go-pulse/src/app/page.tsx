"use client";
import Link from "next/link";
import NavBar from "./components/NavBar";
import PostButton from './components/PostButton';
import pool from './db/database';
import dotenv from 'dotenv';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "./components/LogoutButton";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/check-auth", { credentials: "include" });

      if (!res.ok) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>      
      <NavBar />
      <LogoutButton />
      <main className="p-20">
        {/* Page Content */}
        <h1 className="text-2xl font-bold mt-6">Welcome to the Home Page</h1>
      </main>
    </div>
  );
}
