import { NextResponse } from "next/server";
import pool from "../../db/database";

export async function GET(req: Request) {
    try {
        const result = await pool.query("SELECT * FROM exercises");

        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}