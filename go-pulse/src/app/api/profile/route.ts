import { NextRequest, NextResponse } from "next/server";
import pool from "../../db/database";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!; 

async function getUserFromToken(req: NextRequest) {
    try {
        const cookies = req.headers.get("cookie");
        const token = cookies?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        const decoded = jwt.verify(token, SECRET) as { username: string };
        return decoded.username;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}


export async function GET(req: NextRequest) {

    const username = await getUserFromToken(req);
    if (!username) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {

        const { rows } = await pool.query(`
            SELECT full_name, weight_lbs, age, gender, bio
            FROM profiles
            WHERE username = $1;
        `, [username]);

        if (rows.length === 0) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        console.log("Profile data fetched successfully:", rows[0]);
        return NextResponse.json(rows[0], { status: 200 });
       
    } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
}

export async function POST(req: NextRequest) {
    console.log("Received POST request to /api/profile");

    const username = await getUserFromToken(req);
    if (!username) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const { full_name, age, weight_lbs, gender, bio } = await req.json();

        if (!full_name || !age || !weight_lbs || !gender || !bio) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        console.log("Updating user's bio:", username);

        const updateQuery = `
            INSERT INTO profiles (username, full_name, age, weight_lbs, gender, bio)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (username) 
            DO UPDATE SET full_name = EXCLUDED.full_name, age = EXCLUDED.age, 
                          weight_lbs = EXCLUDED.weight_lbs, gender = EXCLUDED.gender, 
                          bio = EXCLUDED.bio;
        `;

        await pool.query(updateQuery, [username, full_name, age, weight_lbs, gender, bio]);

        console.log("Profile updated successfully for:", username);
        return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
    }
}
