'use client';

import { acceptFriendRequest, rejectFriendRequest } from '@/lib/actions/member.actions';
import Image from 'next/image';
import { useState } from 'react';

import { FriendRequest } from '@/types';

export default function FriendRequestsList({ requests }: { requests: FriendRequest[] }) {
    const [pendingRequests, setPendingRequests] = useState(requests);

    const handleAccept = async (requestId: string) => {
        try {
            await acceptFriendRequest(requestId);
            setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
        } catch (error) {
            console.error(error);
            alert('Failed to accept request');
        }
    };

    const handleDecline = async (requestId: string) => {
        try {
            await rejectFriendRequest(requestId);
            setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
        } catch (error) {
            console.error(error);
            alert('Failed to decline request');
        }
    };

    if (pendingRequests.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">No pending friend requests.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {pendingRequests.map((request) => (
                <div key={request._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            <Image
                                src={request.sender.imageUrl || '/placeholder-avatar.png'}
                                alt={request.sender.firstName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {request.sender.firstName} {request.sender.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">wants to be your friend.</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleAccept(request._id)}
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleDecline(request._id)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Decline
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
