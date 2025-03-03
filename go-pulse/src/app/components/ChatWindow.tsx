"use client";

import { useEffect, useState } from "react";

type Message = {
    id: number;
    sender_id: string;
    content: string;
    created_at: string;
};

export default function ChatWindow({ conversationId }: { conversationId: number }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (conversationId) {
            console.log("Fetching messages for conversation:", conversationId);
            fetch(`/api/conversations/message`,{
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ conversationId: conversationId}),
            })
                .then(res => res.json())
                .then((data: Message[]) => setMessages(data));
        }
    }, [conversationId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        console.log("Sending POST message:", newMessage);
        const res = await fetch(`/api/conversations/${conversationId}/messages`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: newMessage, conversationId: conversationId }),
        });

        if (res.ok) {
            const message: Message = await res.json();
            setMessages((prev) => [...prev, message]);
            setNewMessage("");
        }
    };

    return (
        <div className="flex flex-col flex-1 p-4">
            <div className="flex-1 overflow-y-auto border p-2">
                {messages.map((msg) => (
                    <div key={msg.id} className={`p-2 my-1 rounded ${msg.sender_id === "YOUR_USER_ID_HERE" ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black"}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="flex mt-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
                    Send
                </button>
            </div>
        </div>
    );
}
