import { NextResponse } from 'next/server';
import pool from "@/app/db/database";
import checkAuth from "@/app/api/check-auth/CheckAuth";

export async function GET(req: Request, context: { params: { workoutId: string } }) {
    const authData = await checkAuth(req);
    const userId = authData.userId;

    const params = await context.params;
    const workoutId = params.workoutId;
    const parsedWorkoutId = parseInt(workoutId, 10);

    if (isNaN(parsedWorkoutId)) {
        return NextResponse.json({ error: 'Invalid workout ID' }, { status: 400 });
    }

    try {
        // Query to fetch comments with likes and likedByUser

        console.log("User ID:", userId);
        const { rows } = await pool.query(
            `
            SELECT 
                c.id,
                c.content,
                c.created_at,
                c.user_id,
                u.username,
                COUNT(cl.id) AS likes,
                EXISTS (
                    SELECT 1 
                    FROM comment_likes cl2 
                    WHERE cl2.comment_id = c.id AND cl2.user_id = $2
                ) AS likedByUser
            FROM comments c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN comment_likes cl ON cl.comment_id = c.id
            WHERE c.workout_id = $1
            GROUP BY c.id, u.username
            ORDER BY c.created_at ASC
            `,
            [parsedWorkoutId, userId]
        );

        console.log("Fetched comments:", rows);

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}