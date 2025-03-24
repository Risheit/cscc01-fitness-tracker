import { NextRequest, NextResponse } from "next/server";
import pool from "../../db/database";
import checkAuth from "../check-auth/CheckAuth";

export async function GET(req: NextRequest) {

    const authData = await checkAuth(req);
    if (!authData.authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {

        const { rows } = await pool.query(`
            SELECT full_name, weight_lbs, age, gender, bio
            FROM users
            WHERE id = $1;
        `, [authData.userId]);

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

    const authData = await checkAuth(req);
    if (!authData.authenticated) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const { fullName, age, weight, gender, bio } = await req.json();

        if (!fullName || !age || !weight || !gender || !bio) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const updateQuery = `
            UPDATE users
            SET full_name = $2,
                age = $3,
                weight_lbs = $4,
                gender = $5,
                bio = $6
            WHERE id = $1;
        `;

        await pool.query(updateQuery, [authData.userId, fullName, age, weight, gender, bio]);
        return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
    }
}
