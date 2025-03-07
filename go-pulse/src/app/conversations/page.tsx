"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import ConversationsList from "@/app/components/ConversationsList";
import ChatWindow from "@/app/components/ChatWindow";

export default function ConversationsPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [myUserId, setMyUserId] = useState<number | null>(null);
    const [otherUserId, setOtherUserId] = useState<number | null>(null);
    const [otherUserUsername, setOtherUserUsername] = useState<string | null>(null);

    const handleSelectConversation = (conversationId: number, myUserId: number, otherUserId: number, otherUserUsername: string) => {
        setSelectedConversationId(conversationId);
        setMyUserId(myUserId);
        setOtherUserId(otherUserId);
        setOtherUserUsername(otherUserUsername);
    };

    return (
        <div className="h-screen flex flex-col">
            <NavBar />
            <div className="p-2 flex flex-1 border rounded-lg overflow-hidden">
                <div className="w-1/5 p-4 bg-blue-200 rounded-lg border-r">
                    <h1 className="text-2xl font-bold mb-2">Messages</h1>
                    <Link href="/conversations/new-conversation" className="hover:underline">
                        New Conversation
                    </Link>
                    <div>
                        {/* Conversations List */}
                        <div>
                            <ConversationsList onSelect={handleSelectConversation} />
                        </div>
                    </div>
                </div>
                
                {/* Chat Window */}
                <div className="flex-1 pl-4 h-full">
                    {selectedConversationId && myUserId && otherUserId && otherUserUsername ? (
                        <ChatWindow
                            conversationId={selectedConversationId}
                            myUserId={myUserId}
                            otherUserId={otherUserId}
                            otherUserUsername={otherUserUsername}
                        />
                    ) : (
                        <div className="text-gray-500">Select a conversation to start chatting.</div>
                    )}
                </div>
            </div>
        </div>
    );
}