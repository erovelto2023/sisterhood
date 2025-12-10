'use client';

import { useState } from 'react';
import { createCommunityPost, votePoll } from '@/lib/actions/community.actions';
import { format } from 'date-fns';
import { FaRegComment, FaThumbsUp, FaPaperPlane, FaPoll, FaTimes, FaPlus, FaCheckCircle } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';

interface SpaceFeedProps {
    spaceId: string;
    initialPosts: any[];
    isMember: boolean;
    currentUserId: string;
}

export default function SpaceFeed({ spaceId, initialPosts, isMember, currentUserId }: SpaceFeedProps) {
    const { user } = useUser();
    const [posts, setPosts] = useState(initialPosts);
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [postType, setPostType] = useState<'post' | 'poll'>('post');
    const [pollOptions, setPollOptions] = useState(['', '']);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        if (postType === 'poll' && pollOptions.some(opt => !opt.trim())) {
            alert("Please fill in all poll options");
            return;
        }

        setIsPosting(true);
        try {
            await createCommunityPost({
                spaceId,
                content,
                type: postType,
                pollOptions: postType === 'poll' ? pollOptions : []
            });
            setContent('');
            setPostType('post');
            setPollOptions(['', '']);
            // In a real app we'd optimistically update or re-fetch
        } catch (error) {
            console.error(error);
            alert('Failed to post');
        } finally {
            setIsPosting(false);
        }
    };

    const handleVote = async (postId: string, optionIndex: number) => {
        try {
            await votePoll(postId, optionIndex);
            // Optimistic update could happen here
        } catch (error) {
            console.error(error);
        }
    };

    const addPollOption = () => {
        if (pollOptions.length < 5) {
            setPollOptions([...pollOptions, '']);
        }
    };

    const removePollOption = (index: number) => {
        if (pollOptions.length > 2) {
            const newOptions = [...pollOptions];
            newOptions.splice(index, 1);
            setPollOptions(newOptions);
        }
    };

    const updatePollOption = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
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
                                    placeholder={postType === 'poll' ? "Ask a question..." : "Start a discussion..."}
                                    className="w-full bg-gray-50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
                                />

                                {postType === 'poll' && (
                                    <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-xl">
                                        <label className="text-sm font-semibold text-gray-700">Poll Options</label>
                                        {pollOptions.map((option, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updatePollOption(idx, e.target.value)}
                                                    placeholder={`Option ${idx + 1}`}
                                                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                                />
                                                {pollOptions.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePollOption(idx)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {pollOptions.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={addPollOption}
                                                className="text-sm text-purple-600 font-medium hover:underline flex items-center gap-1"
                                            >
                                                <FaPlus size={10} /> Add Option
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-3">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setPostType(postType === 'post' ? 'poll' : 'post')}
                                            className={`p-2 rounded-lg transition-colors ${postType === 'poll' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-100'}`}
                                            title="Create Poll"
                                        >
                                            <FaPoll size={18} />
                                        </button>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isPosting || !content.trim()}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <FaPaperPlane size={12} /> {postType === 'poll' ? 'Create Poll' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-8 text-center">
                    Join this space to start posting and commenting.
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

                        <div className="text-gray-800 mb-4 whitespace-pre-wrap font-medium">
                            {post.content}
                        </div>

                        {post.type === 'poll' && post.pollOptions && (
                            <div className="mb-6 space-y-2">
                                {post.pollOptions.map((option: any, idx: number) => {
                                    const totalVotes = post.pollOptions.reduce((acc: number, curr: any) => acc + curr.votes.length, 0);
                                    const percentage = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);
                                    const hasVoted = option.votes.includes(currentUserId);

                                    return (
                                        <div key={idx} className="relative">
                                            <button
                                                onClick={() => handleVote(post._id, idx)}
                                                disabled={!isMember}
                                                className={`w-full text-left p-3 rounded-lg border relative overflow-hidden transition-all ${hasVoted ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                                            >
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-purple-100 transition-all duration-500"
                                                    style={{ width: `${percentage}%`, opacity: 0.5 }}
                                                />
                                                <div className="relative z-10 flex justify-between items-center">
                                                    <span className="font-medium text-gray-800">{option.text}</span>
                                                    <span className="text-sm text-gray-500">{percentage}% ({option.votes.length})</span>
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                                <p className="text-xs text-gray-400 text-right">
                                    {post.pollOptions.reduce((acc: number, curr: any) => acc + curr.votes.length, 0)} votes total
                                </p>
                            </div>
                        )}

                        <div className="flex items-center gap-6 text-gray-500 text-sm border-t border-gray-100 pt-4">
                            <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                                <FaThumbsUp /> {post.likes.length} Likes
                            </button>
                            <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                                <FaRegComment /> {post.comments.length} Comments
                            </button>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No posts yet. Be the first to start a conversation!
                    </div>
                )}
            </div>
        </div>
    );
}
