"use client";

import { useState } from "react";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";

export default function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

    return (
        <div className="flex h-screen">
            <ConversationsList onSelect={setSelectedConversation} />
            {selectedConversation ? (
                <ChatWindow conversationId={selectedConversation} />
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Select a conversation to start chatting</p>
                </div>
            )}
        </div>
    );
}
