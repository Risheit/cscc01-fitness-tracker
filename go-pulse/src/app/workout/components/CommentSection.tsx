'use client';

import { useState, useEffect } from 'react';

interface Comment {
    content: string;
    username: string;
    created_at: string;
    id: number;
    likes: number;
    likedByUser: boolean;
    user_id: number;
}

export default function CommentSection({ workoutId }: { workoutId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            const res = await fetch(`/api/comments/${workoutId}`);
            const data = await res.json();
            setComments(data);
        };

        const fetchUserId = async () => {
            const res = await fetch('/api/check-auth', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const authData = await res.json();
            setUserId(authData.userId);
        };

        fetchComments();
        fetchUserId();
    }, [workoutId]);

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ workoutId, content: newComment }),
            });

            if (res.ok) {
                const newCommentData = await res.json();
                setComments((prevComments) => [
                    ...prevComments,
                    {
                        ...newCommentData,
                        user_id: userId,
                    },
                ]);
                setNewComment('');
            }
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        const res = await fetch('/api/comments', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ commentId }),
        });

        if (res.ok) {
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        }
    };

    const handleLikeComment = async (commentId: number) => {
        const res = await fetch('/api/comments/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ commentId }),
        });

        if (res.ok) {
            const { likes, likedByUser } = await res.json();
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === commentId
                        ? {
                              ...comment,
                              likes,
                              likedByUser,
                          }
                        : comment
                )
            );
        }
    };

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAddComment}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                    Add
                </button>
            </div>
            <ul className="space-y-4">
                {comments.map((comment) => (
                    <li
                        key={comment.id}
                        className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-start"
                    >
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{comment.username}</p>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
                            <button
                                onClick={() => handleLikeComment(comment.id)}
                                className={`text-blue-600 hover:underline ${
                                    comment.likedByUser ? 'font-bold' : ''
                                }`}
                            >
                                {comment.likedByUser ? 'Unlike' : 'Like'} ({comment.likes})
                            </button>
                            {userId === comment.user_id && (
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-red-600 hover:underline ml-2"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}