"use client";

import { useEffect, useState } from "react";

type Conversation = {
    conversation_id: number; 
    my_user_id: number
    other_user_id: number;
    other_user_username: string;
    created_at: string;
};

type ConversationsListProps = {
    onSelect: (conversationId: number, myUserId: number, otherUserId: number, otherUserUsername: string) => void;
};

export default function ConversationsList({ onSelect }: ConversationsListProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/conversations", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data: Conversation[]) => {
                setConversations(data);
            })
            .catch((error) => {
                console.error("Error fetching conversations:", error);
            });
    }, []);

    const handleSelect = (conversationId: number, myUserId: number, otherUserId: number, otherUserUsername: string) => {
        setSelectedConversationId(conversationId);
        onSelect(conversationId, myUserId, otherUserId, otherUserUsername);
    };

    return (
        <div>
            <ul>
                {conversations.map((conv) => (
                    <li key={conv.conversation_id} className="mb-2">
                        <button
                            onClick={() => handleSelect(conv.conversation_id, conv.my_user_id, conv.other_user_id, conv.other_user_username)}
                            className={`w-full p-2 rounded-lg text-left ${
                                selectedConversationId === conv.conversation_id ? "bg-blue-400" : "bg-blue-100 hover:bg-blue-300"
                            }`}
                        >
                            {conv.other_user_username}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}