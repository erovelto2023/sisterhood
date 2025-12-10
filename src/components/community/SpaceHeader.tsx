'use client';

import { joinSpace, leaveSpace } from '@/lib/actions/community.actions';
import { useState } from 'react';
import { FaUsers, FaLock, FaHashtag } from 'react-icons/fa';

interface SpaceHeaderProps {
    space: any;
    membership: any;
}

export default function SpaceHeader({ space, membership }: SpaceHeaderProps) {
    const [isMember, setIsMember] = useState(!!membership);
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        setLoading(true);
        try {
            await joinSpace(space._id);
            setIsMember(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave this space?')) return;
        setLoading(true);
        try {
            await leaveSpace(space._id);
            setIsMember(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            <div className="max-w-5xl mx-auto px-6 pb-6">
                <div className="flex justify-between items-end -mt-8">
                    <div className="flex items-end gap-4">
                        <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center text-4xl border-4 border-white">
                            {space.icon || (space.type === 'private' ? <FaLock className="text-gray-400" /> : <FaHashtag className="text-gray-400" />)}
                        </div>
                        <div className="mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <FaUsers /> {space.membersCount} members
                                </span>
                                <span className="capitalize px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                                    {space.type} Group
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-2">
                        {isMember ? (
                            <button
                                onClick={handleLeave}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                {loading ? 'Leaving...' : 'Joined'}
                            </button>
                        ) : (
                            <button
                                onClick={handleJoin}
                                disabled={loading}
                                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            >
                                {loading ? 'Joining...' : 'Join Space'}
                            </button>
                        )}
                    </div>
                </div>
                {space.description && (
                    <p className="mt-6 text-gray-600 max-w-3xl">{space.description}</p>
                )}
            </div>
        </div>
    );
}
