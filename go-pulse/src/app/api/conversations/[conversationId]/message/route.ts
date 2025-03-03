import { NextResponse } from "next/server";
import pool from "@/app/db/database";
import jwt from "jsonwebtoken";  // Make sure you have jsonwebtoken installed

const SECRET = process.env.JWT_SECRET!;  // Use your secret key here

export async function GET(req: Request) {
    // Get the token from the cookies
    const cookies = req.headers.get("cookie");
    const token = cookies?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
        return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, SECRET);
        const convId = decoded.conversationId;

        console.log("Fetching messages of Conversation:", convId);  // Log the conversationId

        // Fetch conversations from the database based on userId
        const { rows: messages } = await pool.query(
            "SELECT * FROM messages WHERE conversation_id $1",
            [convId]
        );

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Failed to verify token or fetch messages" }, { status: 500 });
    }
}
