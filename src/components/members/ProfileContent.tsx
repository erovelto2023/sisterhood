'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendEmail } from '@/lib/actions/email.actions';
import { createPost, toggleLike, addComment, deletePost } from '@/lib/actions/member.actions';
import { FaEnvelope, FaComment, FaUserPlus, FaEllipsisH, FaPen, FaImages, FaSmile, FaRegImage, FaTrash, FaThumbsUp, FaRegComment, FaDownload, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { useUser } from '@clerk/nextjs';

interface ProfileContentProps {
    user: any;
    currentUser: any;
    initialPosts: any[];
    photos: any[];
    friendStatus: string;
}

export default function ProfileContent({ user, currentUser, initialPosts, photos, friendStatus }: ProfileContentProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Activity');
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [postContent, setPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    // We rely on server revalidation for posts, but could add local state if needed for instant feedback
    // For now, let's just use the props which will update on revalidatePath
    const posts = initialPosts;

    const isOwnProfile = currentUser?.clerkId === user.clerkId;

    const handleMessage = () => {
        router.push(`/members/chat?userId=${user._id}`);
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendEmail({
                senderClerkId: currentUser.clerkId,
                recipientId: user._id,
                subject,
                body
            });
            setIsEmailModalOpen(false);
            setSubject('');
            setBody('');
            alert("Email sent!");
        } catch (error) {
            console.error("Error sending email", error);
            alert("Failed to send email.");
        }
    };

    const handleCreatePost = async () => {
        if (!postContent.trim()) return;
        setIsPosting(true);
        try {
            await createPost({
                content: postContent,
                recipientId: user._id
            });
            setPostContent('');
        } catch (error) {
            console.error("Error creating post", error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleLike = async (postId: string) => {
        try {
            await toggleLike(postId);
        } catch (error) {
            console.error("Error liking post", error);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await deletePost(postId);
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-6 font-sans text-slate-800">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Gradient Cover */}
                <div className="h-[200px] bg-gradient-to-r from-[#a855f7] to-[#ec4899]"></div>

                {/* Profile Bar */}
                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col md:flex-row items-end -mt-12">
                        {/* Profile Picture */}
                        <div className="relative z-10">
                            <img
                                src={user.imageUrl || "https://via.placeholder.com/150"}
                                alt={user.firstName}
                                className="w-[168px] h-[168px] rounded-full object-cover border-[6px] border-white bg-white"
                            />
                        </div>

                        {/* Name & Bio */}
                        <div className="md:ml-5 flex-1 mt-4 md:mt-0 mb-4 text-center md:text-left">
                            <h1 className="text-[32px] font-bold text-gray-900 leading-tight">{user.firstName} {user.lastName}</h1>
                            <p className="text-gray-500 text-base mt-1">{user.bio || "No bio yet."}</p>
                        </div>

                        {/* Action Button */}
                        <div className="mb-6 mt-4 md:mt-0">
                            {isOwnProfile ? (
                                <button className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleMessage}
                                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Message
                                    </button>
                                    <button
                                        onClick={() => setIsEmailModalOpen(true)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Email
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* About Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                        <h3 className="font-bold text-xl text-gray-900 mb-4">About</h3>
                        <div className="space-y-3 text-[15px] text-gray-600">
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900">Joined:</span>
                                <span>{user.createdAt ? format(new Date(user.createdAt), 'M/d/yyyy') : 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900">Email:</span>
                                <span className="truncate">{user.email || 'Hidden'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Photos Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl text-gray-900">Photos</h3>
                            <button
                                onClick={() => setActiveTab('Gallery')}
                                className="text-purple-600 text-sm font-medium hover:underline"
                            >
                                See All
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {photos.slice(0, 9).map((photo: any) => (
                                <div
                                    key={photo._id}
                                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setActiveTab('Gallery')}
                                >
                                    <img src={photo.url} alt="Photo" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            {photos.length === 0 && <div className="col-span-3 text-center text-gray-400 text-sm py-4">No photos yet</div>}
                        </div>
                    </div>

                    {/* Friends Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl text-gray-900">Friends</h3>
                            <button className="text-purple-600 text-sm font-medium hover:underline">See All</button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {user.friends && user.friends.length > 0 ? (
                                user.friends.slice(0, 9).map((friend: any) => (
                                    <div key={friend._id} className="text-center">
                                        <div className="w-full aspect-square bg-gray-200 rounded-lg mb-1 overflow-hidden">
                                            <img src={friend.imageUrl || "https://via.placeholder.com/150"} alt={friend.firstName} className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-xs font-medium text-gray-700 truncate">{friend.firstName}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 text-center text-gray-400 text-sm py-4">No friends yet</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Tabs Bar */}
                    <div className="bg-white px-4 rounded-2xl shadow-sm">
                        <div className="flex gap-8 overflow-x-auto">
                            {['Activity', 'Friends', 'Gallery', 'About'].map((tab, index) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 text-[15px] font-medium border-b-[3px] transition-colors whitespace-nowrap ${activeTab === tab ? 'border-[#a855f7] text-[#a855f7]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'Activity' && (
                        <>
                            {/* Create Post */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                <div className="flex gap-4 mb-4">
                                    <img src={currentUser?.imageUrl || "https://via.placeholder.com/40"} alt="Me" className="w-10 h-10 rounded-full" />
                                    <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                                        <input
                                            type="text"
                                            value={postContent}
                                            onChange={(e) => setPostContent(e.target.value)}
                                            placeholder={`What's on your mind, ${currentUser?.firstName}?`}
                                            className="bg-transparent w-full focus:outline-none text-[15px] text-gray-600 placeholder-gray-500"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleCreatePost();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <div className="flex gap-3 text-gray-400">
                                        <FaSmile className="text-xl text-yellow-500 cursor-pointer" />
                                        <FaRegImage className="text-xl text-gray-500 cursor-pointer" />
                                    </div>
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={isPosting || !postContent.trim()}
                                        className="px-6 py-2 bg-[#c084fc] text-white text-sm font-semibold rounded-lg hover:bg-[#a855f7] transition-colors disabled:opacity-50"
                                    >
                                        {isPosting ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </div>

                            {/* Feed Posts */}
                            {posts.length > 0 ? (
                                posts.map((post: any) => (
                                    <div key={post._id} className="bg-white p-5 rounded-2xl shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <img src={post.author.imageUrl || "https://via.placeholder.com/40"} alt={post.author.firstName} className="w-10 h-10 rounded-full object-cover" />
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-[15px]">{post.author.firstName} {post.author.lastName}</h4>
                                                    <p className="text-xs text-gray-500">{format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}</p>
                                                </div>
                                            </div>
                                            {(currentUser?.clerkId === post.author.clerkId || isOwnProfile) && (
                                                <button onClick={() => handleDeletePost(post._id)} className="text-gray-400 text-xs hover:text-red-600">Delete</button>
                                            )}
                                        </div>
                                        <p className="text-gray-800 mb-4 text-[15px] whitespace-pre-wrap">
                                            {post.content}
                                        </p>
                                        {post.imageUrl && (
                                            <div className="mb-4 rounded-lg overflow-hidden">
                                                <img src={post.imageUrl} alt="Post content" className="w-full h-auto" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                                            <button
                                                onClick={() => handleLike(post._id)}
                                                className={`flex items-center gap-1 hover:text-[#a855f7] ${post.likes.includes(currentUser?._id) ? 'text-[#a855f7]' : ''}`}
                                            >
                                                <FaThumbsUp /> {post.likes.length} Likes
                                            </button>
                                            <span className="flex items-center gap-1">
                                                <FaRegComment /> {post.comments.length} Comments
                                            </span>
                                        </div>

                                        {/* Comments */}
                                        <div className="space-y-3">
                                            {post.comments.map((comment: any, idx: number) => (
                                                <div key={idx} className="bg-gray-50 p-3 rounded-xl flex gap-3">
                                                    <img src={comment.author.imageUrl || "https://via.placeholder.com/32"} alt="User" className="w-8 h-8 rounded-full" />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="font-bold text-xs text-gray-900">{comment.author.firstName} {comment.author.lastName}</span>
                                                            <span className="text-[10px] text-gray-400">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                                                        </div>
                                                        <p className="text-[13px] text-gray-700 mt-1">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-10">No posts yet. Be the first to post!</div>
                            )}
                        </>
                    )}

                    {activeTab === 'Friends' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-center text-gray-500">
                            Friends list coming soon...
                        </div>
                    )}

                    {activeTab === 'Gallery' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-xl text-gray-900 mb-4">Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {photos.length > 0 ? (
                                    photos.map((photo: any) => (
                                        <div
                                            key={photo._id}
                                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer"
                                            onClick={() => setSelectedPhoto(photo.url)}
                                        >
                                            <img src={photo.url} alt="Gallery photo" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500 py-10">No photos to display.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'About' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-xl text-gray-900 mb-4">About {user.firstName}</h3>
                            <p className="text-gray-700">{user.bio || "No bio available."}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Email Modal */}
            {isEmailModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800">Send Email to {user.firstName}</h3>
                            <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSendEmail} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEmailModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Send Email
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Photo Lightbox Modal */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
                    <button
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                    >
                        <FaTimes className="text-3xl" />
                    </button>

                    <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <img
                            src={selectedPhoto}
                            alt="Full size"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="mt-4 flex gap-4">
                            <a
                                href={selectedPhoto}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-2 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                            >
                                <FaDownload /> Download
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
