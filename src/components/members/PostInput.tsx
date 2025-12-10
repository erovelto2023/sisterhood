'use client';

import { useState } from 'react';
import { createPost } from '@/lib/actions/member.actions';
import Image from 'next/image';
import EmojiPicker from 'emoji-picker-react';

import { User } from '@/types';

export default function PostInput({ currentUser, recipientId }: { currentUser: User; recipientId?: string }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setLoading(true);
            await createPost({ content, recipientId });
            setContent('');
            setShowEmojiPicker(false);
        } catch (error) {
            console.error(error);
            alert('Failed to post');
        } finally {
            setLoading(false);
        }
    };

    const onEmojiClick = (emojiObject: any) => {
        setContent((prev) => prev + emojiObject.emoji);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 relative">
            <div className="flex space-x-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image
                        src={currentUser.imageUrl || '/placeholder-avatar.png'}
                        alt="Me"
                        fill
                        className="object-cover"
                    />
                </div>
                <form onSubmit={handleSubmit} className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`What's on your mind, ${currentUser.firstName}?`}
                        className="w-full p-3 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-purple-100 resize-none h-24"
                    />
                    <div className="flex justify-between items-center mt-3">
                        <div className="flex space-x-2 relative">
                            <button
                                type="button"
                                className="text-gray-400 hover:text-purple-600"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                😊
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute z-10 mt-2 top-8">
                                    <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                                </div>
                            )}
                            <button type="button" className="text-gray-400 hover:text-purple-600">
                                📷
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !content.trim()}
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
