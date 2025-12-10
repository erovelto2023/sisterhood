'use client';

import { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ActivityFeed from './ActivityFeed';
import FriendsList from './FriendsList';
import PhotoGallery from './PhotoGallery';

import { User, Post, Photo } from '@/types';

interface ProfileViewProps {
    user: User;
    currentUser: User;
    friendStatus: 'friends' | 'request_sent' | 'request_received' | 'none';
    posts: Post[];
    friends: User[]; // This user's friends
    photos: Photo[];
}

export default function ProfileView({ user, currentUser, friendStatus, posts, friends, photos }: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState('activity');

    const isOwnProfile = currentUser._id === user._id;
    const canPost = isOwnProfile || friendStatus === 'friends';

    return (
        <div className="max-w-5xl mx-auto">
            <ProfileHeader user={user} currentUserId={currentUser._id} friendStatus={friendStatus} />

            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Sidebar / About (Left on desktop) */}
                <div className="w-full md:w-80 space-y-6 flex-shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                        <div className="space-y-3 text-gray-600">
                            <p>
                                <span className="font-medium text-gray-900">Joined:</span>{' '}
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">Email:</span> {user.email}
                            </p>
                            {/* Add more fields like Location, Work, etc if added to model */}
                        </div>
                    </div>

                    {/* Photos Preview */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Photos</h2>
                            <button onClick={() => setActiveTab('gallery')} className="text-purple-600 text-sm hover:underline">See All</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {photos.slice(0, 6).map((photo) => (
                                <div key={photo._id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                                    {/* Use next/image here if possible, but for preview just a div or img */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={photo.url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            {photos.length === 0 && <p className="text-gray-500 text-sm col-span-3">No photos yet.</p>}
                        </div>
                    </div>

                    {/* Friends Preview */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Friends</h2>
                            <button onClick={() => setActiveTab('friends')} className="text-purple-600 text-sm hover:underline">See All</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {friends.slice(0, 6).map(friend => (
                                <div key={friend._id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                                    {/* Image would go here */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content (Right on desktop) */}
                <div className="flex-1 min-w-0 w-full">
                    {/* Tabs Navigation */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex overflow-x-auto">
                        {['activity', 'friends', 'gallery', 'about'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 font-medium text-sm capitalize whitespace-nowrap transition-colors border-b-2 ${activeTab === tab
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'activity' && (
                            <ActivityFeed
                                currentUser={currentUser}
                                profileUserId={user._id}
                                posts={posts}
                                canPost={canPost}
                            />
                        )}
                        {activeTab === 'friends' && <FriendsList friends={friends} />}
                        {activeTab === 'gallery' && <PhotoGallery photos={photos} isOwnProfile={isOwnProfile} />}
                        {activeTab === 'about' && (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold mb-4">About {user.firstName}</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{user.bio || 'No bio available.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
