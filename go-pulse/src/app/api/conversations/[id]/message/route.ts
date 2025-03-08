import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/db/database";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // Get ID from the route
    const convId = parseInt(id, 10);

    if (isNaN(convId)) {
        console.error("Invalid conversation ID:", id);
        return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 });
    }

    // Get the token from the request headers
    const cookies = req.headers.get("cookie");
    const token = cookies?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET) as { userId: string };
        const userId = decoded.userId;

        console.log(`Fetching messages of Conversation: ${convId} for User: ${userId}`);

        const { rows: messages } = await pool.query(
            "SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC",
            [convId]
        );

        // console.log("Fetched messages:", messages);

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // Get ID from the route
    const convId = parseInt(id, 10);

    if (isNaN(convId)) {
        console.error("Invalid conversation ID:", id);
        return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 });
    }

    // Get the token from the request headers
    const cookies = req.headers.get("cookie");
    const token = cookies?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET) as { userId: string };
        const userId = decoded.userId;

        const { content } = await req.json(); 

        console.log("Adding message:", content, "by User ID:", userId);

        // Create a new conversation
        const newMessages = await pool.query(
            "INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *",
            [convId, userId, content]
        );

        return NextResponse.json(newMessages.rows[0], { status: 201 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}
