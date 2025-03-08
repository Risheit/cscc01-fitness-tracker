import { NextResponse } from "next/server";
import pool from "@/app/db/database";
import jwt from "jsonwebtoken";  // Ensure jsonwebtoken is installed

const SECRET = process.env.JWT_SECRET!;  // Use your secret key here

// GET method to fetch conversations
export async function GET(req: Request) {
    const cookies = req.headers.get("cookie");
    const token = cookies?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET) as { userId: string };
        const userId = decoded.userId;

        console.log("Fetching conversations of User ID:", userId);

        // Fetch conversations with the other user's details
        const { rows: conversations } = await pool.query(
            `SELECT 
                c.id AS conversation_id,
                c.user1_id,
                c.user2_id,
                c.created_at,
                u1.id AS user1_id,
                u1.username AS user1_username,
                u2.id AS user2_id,
                u2.username AS user2_username
             FROM 
                conversations c
             JOIN 
                users u1 ON c.user1_id = u1.id
             JOIN 
                users u2 ON c.user2_id = u2.id
             WHERE 
                c.user1_id = $1 OR c.user2_id = $1`,
            [userId]
        );

        // Map the response to include the other user's details
        const formattedConversations = conversations.map((conv) => ({
            id: conv.conversation_id,
            my_user_id: userId,
            other_user_id: conv.user1_id === userId ? conv.user2_id : conv.user1_id,
            other_user_username: conv.user1_id === userId ? conv.user2_username : conv.user1_username,
            created_at: conv.created_at,
        }));

        console.log("Fetched conversations:", formattedConversations);
        return NextResponse.json(formattedConversations);
    } catch (error) {
        console.error("Error in GET /api/conversations:", error);
        return NextResponse.json({ error: "Failed to verify token or fetch conversations" }, { status: 500 });
    }
}

// POST method to create a new conversation
export async function POST(req: Request) {
    const cookies = req.headers.get("cookie");
    const token = cookies?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, SECRET) as { userId: string, username: string };
        const userId = decoded.userId;
        const username = decoded.username;

        const { otherUsername } = await req.json(); // Expecting the other user's username in the request body

        console.log("Creating conversation between User:", username, "and User:", otherUsername);

        // Check if a user with this username exists
        const otherUserIdResult = await pool.query(
            "SELECT id FROM users WHERE username = $1",
            [otherUsername]
        );

        if (otherUserIdResult.rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const otherUserId = otherUserIdResult.rows[0].id;

        console.log("User found with Id:", otherUserId);

        if (userId === otherUserId) {
            return NextResponse.json({ error: "Cannot start a conversation with yourself" }, { status: 400 });
        }
        
        // Check if a conversation already exists between these two users
        const existingConversation = await pool.query(
            "SELECT * FROM conversations WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)",
            [userId, otherUserId]
        );

        if (existingConversation.rows.length > 0) {
            // If a conversation already exists, return the existing conversation
            console.log("Conversation already exists:", existingConversation.rows[0]);
            return NextResponse.json(existingConversation.rows[0]);
        }

        // Create a new conversation
        const newConversation = await pool.query(
            "INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING *",
            [userId, otherUserId]
        );

        // Format the conversation object
        const formattedConversation = {
            id: newConversation.rows[0].id,
            my_user_id: userId,
            other_user_id: otherUserId,
            other_user_username: otherUsername,
            created_at: newConversation.rows[0].created_at,
        };

        
        console.log("New conversation created:", formattedConversation);
        return NextResponse.json(formattedConversation);
    } catch (error) {
        console.error("Error in POST /api/conversations:", error);
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }
}
