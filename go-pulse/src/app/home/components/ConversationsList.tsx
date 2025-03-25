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
  const [selectedConversationId, setSelectedConversationId] = useState<number | undefined>(undefined);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const handleNewConversation = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleSelect = (conversationId: number, myUserId: number, otherUserId: number, otherUserUsername: string) => {
    setSelectedConversationId(conversationId);
    onSelect(conversationId, myUserId, otherUserId, otherUserUsername);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAddNewConversation = async () => {
    try {
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
    handleAddNewConversation();
    setSearchQuery("");
    setShowSearchBar(false);
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        {/* Title only visible on screens larger than 800px */}
        <h1 className="text-2xl font-bold hidden lg:block">Messages</h1>
        <button onClick={handleNewConversation} className="text-blue-500 hover:text-blue-700">
          <FaPlus size={20} />
        </button>
      </div>
  
      {showSearchBar && (
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for users..."
            className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      )}
  
      <ul className="space-y-2">
        {conversations.map((conv) => (
          <li key={conv.id}>
            <button
              onClick={() =>
                handleSelect(
                  conv.id,
                  conv.my_user_id,
                  conv.other_user_id,
                  conv.other_user_username
                )
              }
              className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                selectedConversationId === conv.id
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
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
