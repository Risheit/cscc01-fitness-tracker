"use client";
import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import ConversationsList from "@/app/components/ConversationsList";
import { useRouter } from "next/navigation";

export default function ConversationsPage() {
    const router = useRouter();

    return (
        <div>
            <NavBar />
            <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <Link href="/conversations/new-conversation" className="hover:underline">New Conversation</Link>
            <ConversationsList
                onSelect={(id) => router.push(`/conversations/${id}`)}
            />
            </div>
        </div>
        
    );
}
