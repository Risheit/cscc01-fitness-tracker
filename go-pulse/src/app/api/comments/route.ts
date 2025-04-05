import { NextResponse } from 'next/server';
import pool from '@/app/db/database';
import checkAuth from '../check-auth/CheckAuth';

export async function POST(req: Request) {
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = authData.userId;
    const username = authData.username;
    const { workoutId, content } = await req.json();

    if (!workoutId || !content) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const result = await pool.query(
            'INSERT INTO comments (content, user_id, workout_id) VALUES ($1, $2, $3) RETURNING id, created_at',
            [content, userId, workoutId]
        );

        const newComment = result.rows[0];
        return NextResponse.json({
            id: newComment.id,
            content,
            username,
            created_at: newComment.created_at,
            likes: 0,
            likedByUser: false,
        });
    } catch (error) {
        console.error("Error inserting comment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = authData.userId;
    const { commentId } = await req.json();

    if (!commentId) {
        return NextResponse.json({ error: "Missing comment ID" }, { status: 400 });
    }

    const result = await pool.query(
        'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id',
        [commentId, userId]
    );

    if (result.rowCount === 0) {
        return NextResponse.json({ error: "Comment not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}