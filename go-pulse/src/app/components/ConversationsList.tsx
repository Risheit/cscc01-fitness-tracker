"use client";

import { useEffect, useState } from "react";

type Conversation = {
    id: number;
    user1_id: string;
    user2_id: string;
};

export default function ConversationsList({ onSelect }: { onSelect: (id: number) => void }) {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        fetch("/api/conversations", {
            method: "GET",
            credentials: "include", // Ensures that cookies (including the token) are included in the request
        })
            .then(res => res.json())
            .then((data: Conversation[]) => {
                console.log("Conversations data:", data);  // Log the fetched data
                setConversations(data);
            })
            .catch((error) => {
                console.error("Error fetching conversations:", error);
                // Handle errors (e.g., show a message to the user)
            });
    }, []);
   

    return (
        <div className="p-4 w-64 border-r border-gray-300">
            {conversations.map((conv) => (
                <button
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className="block w-full text-left p-2 hover:bg-gray-200"
                >
                    Chat with {conv.user1_id} or {conv.user2_id}
                </button>
            ))}
        </div>
    );
}
