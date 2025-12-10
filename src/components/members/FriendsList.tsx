'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/types';
import { removeFriend } from '@/lib/actions/member.actions';
import { useState } from 'react';

export default function FriendsList({ friends, isOwnProfile = false }: { friends: User[]; isOwnProfile?: boolean }) {
    const [friendList, setFriendList] = useState(friends);

    const handleUnfriend = async (friendId: string) => {
        if (!confirm('Are you sure you want to remove this friend?')) return;
        try {
            await removeFriend(friendId);
            setFriendList((prev) => prev.filter((f) => f._id !== friendId));
        } catch (error) {
            console.error(error);
            alert('Failed to remove friend');
        }
    };

    if (!friendList || friendList.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">No friends yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {friendList.map((friend) => (
                <div key={friend._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative group">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-3">
                        <Image
                            src={friend.imageUrl || '/placeholder-avatar.png'}
                            alt={`${friend.firstName} ${friend.lastName}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                        {friend.firstName} {friend.lastName}
                    </h3>
                    <Link
                        href={`/members/${friend._id}`}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                        View Profile
                    </Link>
                    {isOwnProfile && (
                        <button
                            onClick={() => handleUnfriend(friend._id)}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Unfriend
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
