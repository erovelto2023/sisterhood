'use client';

import Image from 'next/image';
import { sendFriendRequest } from '@/lib/actions/member.actions';
import { useState } from 'react';

interface ProfileHeaderProps {
    user: any;
    currentUserId: string;
    friendStatus: 'friends' | 'request_sent' | 'request_received' | 'none';
}

import EditProfileModal from './EditProfileModal';

export default function ProfileHeader({ user, currentUserId, friendStatus: initialStatus }: ProfileHeaderProps) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleAddFriend = async () => {
        try {
            setLoading(true);
            await sendFriendRequest(user._id);
            setStatus('request_sent');
        } catch (error) {
            console.error(error);
            alert('Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    const isOwnProfile = user._id === currentUserId;

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex flex-row items-end -mt-12 mb-6">
                        <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image
                                src={user.imageUrl || '/placeholder-avatar.png'}
                                alt={user.firstName}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0 ml-6 mb-2">
                            <div className="flex flex-row justify-between items-end">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 truncate">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                    <p className="text-gray-500 mt-1 truncate">{user.bio || 'No bio yet.'}</p>
                                </div>

                                <div className="flex-shrink-0 ml-4">
                                    {!isOwnProfile && (
                                        <>
                                            {status === 'none' && (
                                                <button
                                                    onClick={handleAddFriend}
                                                    disabled={loading}
                                                    className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                                >
                                                    {loading ? 'Sending...' : 'Add Friend'}
                                                </button>
                                            )}
                                            {status === 'request_sent' && (
                                                <button disabled className="px-6 py-2 bg-gray-100 text-gray-500 font-medium rounded-lg cursor-default">
                                                    Request Sent
                                                </button>
                                            )}
                                            {status === 'friends' && (
                                                <button disabled className="px-6 py-2 bg-green-100 text-green-700 font-medium rounded-lg cursor-default">
                                                    Friends
                                                </button>
                                            )}
                                            {status === 'request_received' && (
                                                <button disabled className="px-6 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg cursor-default">
                                                    Request Received
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {isOwnProfile && (
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOwnProfile && (
                <EditProfileModal
                    user={user}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </>
    );
}
