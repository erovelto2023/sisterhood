'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { toggleLike, addComment, deletePost } from '@/lib/actions/member.actions';
import EmojiPicker from 'emoji-picker-react';
import { User, Post } from '@/types';

export default function PostCard({ post, currentUser }: { post: Post; currentUser: User }) {
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const isLiked = post.likes.includes(currentUser._id);
    const isAuthor = post.author._id === currentUser._id;
    const isRecipient = post.recipient === currentUser._id;
    const canDelete = isAuthor || isRecipient;

    const handleLike = async () => {
        try {
            await toggleLike(post._id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await deletePost(post._id);
        } catch (error) {
            console.error(error);
            alert('Failed to delete post');
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            setLoading(true);
            await addComment(post._id, commentText);
            setCommentText('');
            setIsCommenting(false);
            setShowEmojiPicker(false);
        } catch (error) {
            console.error(error);
            alert('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    const onEmojiClick = (emojiObject: any) => {
        setCommentText((prev) => prev + emojiObject.emoji);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <Image
                            src={post.author.imageUrl || '/placeholder-avatar.png'}
                            alt={post.author.firstName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">
                            {post.author.firstName} {post.author.lastName}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                {canDelete && (
                    <button
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-red-500 text-sm"
                    >
                        Delete
                    </button>
                )}
            </div>

            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
                <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={post.imageUrl}
                        alt="Post content"
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="flex items-center space-x-4 pt-3 border-t border-gray-50">
                <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 text-sm ${isLiked ? 'text-purple-600 font-medium' : 'text-gray-500 hover:text-purple-600'
                        }`}
                >
                    <span>{isLiked ? '👍 Liked' : '👍 Like'}</span>
                    {post.likes.length > 0 && <span>({post.likes.length})</span>}
                </button>
                <button
                    onClick={() => setIsCommenting(!isCommenting)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-purple-600"
                >
                    <span>💬</span>
                    <span className="text-sm">Comment</span>
                    {post.comments.length > 0 && <span>({post.comments.length})</span>}
                </button>
            </div>

            {/* Comments Section */}
            {(isCommenting || post.comments.length > 0) && (
                <div className="mt-4 pt-4 border-t border-gray-50 space-y-4">
                    {post.comments.map((comment: any, index: number) => (
                        <div key={index} className="flex space-x-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <Image
                                    src={comment.author.imageUrl || '/placeholder-avatar.png'}
                                    alt={comment.author.firstName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex-1">
                                <div className="flex justify-between items-baseline">
                                    <h5 className="text-sm font-semibold text-gray-900">
                                        {comment.author.firstName} {comment.author.lastName}
                                    </h5>
                                    <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                            </div>
                        </div>
                    ))}

                    {isCommenting && (
                        <div className="flex space-x-3 relative">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                <Image
                                    src={currentUser.imageUrl || '/placeholder-avatar.png'}
                                    alt="Me"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <form onSubmit={handleCommentSubmit} className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-100 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                                    >
                                        😊
                                    </button>
                                </div>
                                {showEmojiPicker && (
                                    <div className="absolute z-10 mt-2">
                                        <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading || !commentText.trim()}
                                    className="hidden" // Submit on enter
                                >
                                    Post
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
