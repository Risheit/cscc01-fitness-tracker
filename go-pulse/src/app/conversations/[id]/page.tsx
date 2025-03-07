"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use Next.js hook to unwrap params
// import ChatWindow from "@/app/components/ChatWindow";
import NavBar from "@/app/components/NavBar";

export default function ConversationPage() {
    const params = useParams<{ id: string }>(); // Unwrap the params using useParams()
    const [conversationId, setConversationId] = useState<number | null>(null);

    useEffect(() => {
        if (params?.id) {
            const resolvedId = parseInt(params.id);
            setConversationId(resolvedId);
        }
    }, [params]);

    if (conversationId === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Chat</h1>
                
            </div>
        </div>
    );
}
