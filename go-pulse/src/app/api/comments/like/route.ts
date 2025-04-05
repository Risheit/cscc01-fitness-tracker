import { NextResponse } from 'next/server';
import pool from '@/app/db/database';
import checkAuth from '../../check-auth/CheckAuth';

export async function POST(req: Request) {
    const authData = await checkAuth(req);
    if (!authData.authenticated) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const userId = authData.userId;
    const { commentId } = await req.json();

    if (!commentId) {
        return NextResponse.json({ error: "Missing comment ID" }, { status: 400 });
    }

    try {
        let likedByUser = false;
        // Check if the user has already liked the comment
        const existingLike = await pool.query(
            'SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
            [commentId, userId]
        );

        if (existingLike.rowCount && existingLike.rowCount > 0) {
            // If the like exists, remove it (toggle off)
            likedByUser = false;
            await pool.query(
                'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
                [commentId, userId]
            );
        } else {
            // If the like does not exist, add it (toggle on)
            likedByUser = true;
            await pool.query(
                'INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)',
                [commentId, userId]
            );
        }

        // Fetch the updated like count
        const likeCountResult = await pool.query(
            'SELECT COUNT(*) AS likes FROM comment_likes WHERE comment_id = $1',
            [commentId]
        );

        const likeCount = parseInt(likeCountResult.rows[0].likes, 10);

        
        return NextResponse.json({ likedByUser, likes: likeCount });
    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}