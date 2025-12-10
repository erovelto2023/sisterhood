'use client';

import { useState, useEffect } from 'react';
import { createBookClubPost } from '@/lib/actions/book-club.actions';
import { format } from 'date-fns';
import { FaRegComment, FaThumbsUp, FaPaperPlane } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface BookClubFeedProps {
    bookClubId: string;
    initialPosts: any[];
    isMember: boolean;
}

export default function BookClubFeed({ bookClubId, initialPosts, isMember }: BookClubFeedProps) {
    const { user } = useUser();
    const router = useRouter();
    const [posts, setPosts] = useState(initialPosts);
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsPosting(true);
        try {
            await createBookClubPost({ bookClubId, content });
            setContent('');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to post');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {isMember ? (
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-100">
                    <div className="flex gap-4">
                        <img
                            src={user?.imageUrl || "https://via.placeholder.com/40"}
                            alt="Me"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                            <form onSubmit={handlePost}>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Discuss the book..."
                                    className="w-full bg-gray-50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px] resize-none"
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        type="submit"
                                        disabled={isPosting || !content.trim()}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium text-sm hover:bg-amber-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <FaPaperPlane size={12} /> Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl mb-8 text-center">
                    Join this book club to start posting and commenting.
                </div>
            )}

            <div className="space-y-6">
                {posts.map((post: any) => (
                    <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={post.author.imageUrl || "https://via.placeholder.com/40"}
                                alt={post.author.firstName}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    {post.author.firstName} {post.author.lastName}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {format(new Date(post.createdAt), 'MMM d, yyyy • h:mm a')}
                                </p>
                            </div>
                        </div>

                        <div className="text-gray-800 mb-4 whitespace-pre-wrap">
                            {post.content}
                        </div>

                        <div className="flex items-center gap-6 text-gray-500 text-sm border-t border-gray-100 pt-4">
                            <button className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                                <FaThumbsUp /> {post.likes?.length || 0} Likes
                            </button>
                            <button className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                                <FaRegComment /> {post.comments?.length || 0} Comments
                            </button>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No discussions yet. Be the first to start one!
                    </div>
                )}
            </div>
        </div>
    );
}
