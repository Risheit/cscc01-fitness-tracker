import { NextResponse } from 'next/server';
import pool from "@/app/db/database";
import checkAuth from "@/app/api/check-auth/CheckAuth";
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ workoutId: string }> }) {
    const { workoutId } = await context.params;
    const authData = await checkAuth(req);
    const userId = authData.userId;

    const parsedWorkoutId = parseInt(workoutId, 10);

    if (isNaN(parsedWorkoutId)) {
        return NextResponse.json({ error: 'Invalid workout ID' }, { status: 400 });
    }

    try {
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

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}