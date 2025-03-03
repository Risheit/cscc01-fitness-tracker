"use client";

import { useState } from "react";
import NavBar from "@/app/components/NavBar";

export default function StartConversation() {
    const [user2, setUser2] = useState<number | string>(""); // Store the ID of the user you want to chat with
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleStartConversation = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Starting conversation with User ID:", user2);
            const res = await fetch("/api/conversations", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otherUserId: user2 })
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to start conversation");
                return;
            }

            alert("Conversation started!");
        } catch (err) {
            setError("Failed to start conversation");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4">
            <NavBar />
            <h2 className="text-xl mb-4">Start a Conversation</h2>
            <input
                type="number"
                placeholder="Enter User ID"
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                className="border p-2 rounded mb-4"
            />
            <button
                onClick={handleStartConversation}
                className="bg-blue-500 text-white p-2 rounded"
                disabled={isLoading || !user2}
            >
                {isLoading ? "Loading..." : "Start Conversation"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
