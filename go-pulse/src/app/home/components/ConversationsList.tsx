"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

type Conversation = {
    id: number; 
    my_user_id: number;
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
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false); // State to manage search bar visibility
    const [searchQuery, setSearchQuery] = useState<string>(""); // State to manage search query

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
                console.log("Fetched conversations:", data);
                setConversations(data);
            })
            .catch((error) => {
                console.error("Error fetching conversations:", error);
            });
    }, []);

    useEffect(() => {
        console.log("Conversations:", conversations);
    }, [conversations]);

    const handleSelect = (conversationId: number, myUserId: number, otherUserId: number, otherUserUsername: string) => {
        setSelectedConversationId(conversationId);
        onSelect(conversationId, myUserId, otherUserId, otherUserUsername);
    };

    const handleNewConversation = () => {
        setShowSearchBar(!showSearchBar); // Toggle search bar visibility
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleAddNewConversation = async () => {
        try {
            console.log("Starting conversation with User ID:", searchQuery);
            if(searchQuery === "") {
                alert("Please enter a username to start a conversation");
                return;
            }
            const res = await fetch("/api/conversations", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otherUsername: searchQuery })
            });

            if (!res.ok) {
                alert("Failed to start conversation");
                return;
            }

            const newConversation: Conversation = await res.json();
            console.log("New conversation:", newConversation);
            setConversations([...conversations, newConversation]);
            
        } catch (err) {
            alert(err);
        } 
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Implement the logic for creating a new conversation using the search query
        console.log("Search query:", searchQuery);
        handleAddNewConversation();
        // Reset search bar
        setSearchQuery("");
        setShowSearchBar(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">Messages</h1>
                <button onClick={handleNewConversation} className="text-blue-500 hover:text-blue-700">
                    <FaPlus size={20} />
                </button>
            </div>
            {showSearchBar && (
                <form onSubmit={handleSearchSubmit} className="mb-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search for users..."
                        className="w-full p-2 border rounded"
                    />
                </form>
            )}
            <ul>
                {conversations.map((conv) => (
                    console.log(conv),
                    <li key={conv.id} className="mb-2">
                        <button
                            onClick={() => handleSelect(conv.id, conv.my_user_id, conv.other_user_id, conv.other_user_username)}
                            className={`w-full p-2 rounded-lg text-left ${
                                selectedConversationId === conv.id ? "bg-blue-400" : "bg-blue-100 hover:bg-blue-300"
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