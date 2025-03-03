"use client";

import { useEffect, useState } from "react";
import ChatWindow from "@/app/components/ChatWindow";
import NavBar from "@/app/components/NavBar";

export default function ConversationPage({ params }: { params: { id: string } }) {
    const [conversationId, setConversationId] = useState<number | null>(null);

    useEffect(() => {
        // Handle async logic for resolving the conversationId
        const resolvedId = parseInt(params.id);
        setConversationId(resolvedId);
    }, [params]);

    if (conversationId === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Chat</h1>
                <ChatWindow conversationId={conversationId} />
            </div>
        </div>
    );
}
