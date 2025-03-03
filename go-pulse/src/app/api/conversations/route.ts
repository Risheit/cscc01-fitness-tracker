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
        const decoded: any = jwt.verify(token, SECRET);
        const userId = decoded.userId;
        console.log("Fetching conversations of User ID:", userId);  // Log the userId
        const { rows: conversations } = await pool.query(
            "SELECT * FROM conversations WHERE user1_id = $1 OR user2_id = $1",
            [userId]
        );

        console.log("Fetched conversations:", conversations);  // Log the fetched data
        return NextResponse.json(conversations);
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
        const decoded: any = jwt.verify(token, SECRET);
        const userId = decoded.userId;

        const { otherUserId } = await req.json(); // Expecting the other user's ID in the request body

        console.log("Creating conversation between User ID:", userId, "and User ID:", otherUserId);

        // Check if a conversation already exists between these two users
        const existingConvo = await pool.query(
            "SELECT * FROM conversations WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)",
            [userId, otherUserId]
        );

        if (existingConvo.rows.length > 0) {
            // If a conversation already exists, return the existing conversation
            console.log("Conversation already exists:", existingConvo.rows[0]);
            return NextResponse.json(existingConvo.rows[0]);
        }

        // Create a new conversation
        const newConvo = await pool.query(
            "INSERT INTO conversations (user1_id, user2_id) VALUES ($1, $2) RETURNING *",
            [userId, otherUserId]
        );
        console.log("New conversation created:", newConvo.rows[0]);
        return NextResponse.json(newConvo.rows[0]);
    } catch (error) {
        console.error("Error in POST /api/conversations:", error);
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }
}
