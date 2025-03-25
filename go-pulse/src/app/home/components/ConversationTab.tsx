"use client";

import { useState } from "react";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";

export default function ConversationsTab() {
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [myUserId, setMyUserId] = useState<number | null>(null);
    const [otherUserId, setOtherUserId] = useState<number | null>(null);
    const [otherUserUsername, setOtherUserUsername] = useState<string | null>(null);

    const handleSelectConversation = (conversationId: number, myUserId: number, otherUserId: number, otherUserUsername: string) => {
        console.log("Selected conversation:", conversationId);
        setSelectedConversationId(conversationId);
        setMyUserId(myUserId);
        setOtherUserId(otherUserId);
        setOtherUserUsername(otherUserUsername);
    };

    return (
        <div className="h-screen bg-gray-200 flex flex-col">
            <div className="p-2 flex flex-1 border rounded-lg overflow-hidden">
                <div className="w-1/5 p-4 bg-gray-700 rounded-lg border-r">
                    <ConversationsList onSelect={handleSelectConversation} />
                </div>
                
                {/* Chat Window */}
                <div className="flex-1 pl-4 h-full">
                    {selectedConversationId && myUserId && otherUserId && otherUserUsername ? (
                        <ChatWindow
                            conversationId={selectedConversationId}
                            myUserId={myUserId}
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