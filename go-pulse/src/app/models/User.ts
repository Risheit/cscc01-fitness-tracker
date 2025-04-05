import { notFound } from "next/navigation";

export interface User {
  fullName?: string;
  weight?: number;
  age?: number;
  gender?: string;
  bio?: string;
}

export async function getProfile(): Promise<User> {
  const response = await fetch("/api/profile");
  if (!response.ok) {
    notFound();
  }

  return await response.json();
}

export function updateProfile(profile: User) {
  fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
}