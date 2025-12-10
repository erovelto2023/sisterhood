'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';
import { getConversations } from '@/lib/actions/message.actions';
import { useUser } from '@clerk/nextjs';

export default function ChatLayout() {
    const { user } = useUser();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const targetUserId = searchParams.get('userId');

    useEffect(() => {
        if (user) {
            loadConversations();
        }
    }, [user]);

    // Handle direct message link from profile
    useEffect(() => {
        if (targetUserId && conversations.length > 0) {
            // Find existing conversation with this user
            // Note: conversations have participants populated.
            // We need to check if any participant matches targetUserId (Mongo ID)
            const existing = conversations.find(c =>
                c.participants.some((p: any) => p._id === targetUserId)
            );

            if (existing) {
                setSelectedConversation(existing);
            } else {
                // If no conversation exists, we might want to create a temporary one or handle it.
                // For now, let's just log or maybe trigger a "New Chat" state.
                // Ideally, we'd fetch the target user details and create a temp conversation object.
                console.log("No existing conversation found for user", targetUserId);
                // TODO: Handle new conversation creation UI
            }
        }
    }, [targetUserId, conversations]);

    const loadConversations = async () => {
        try {
            if (!user) return;

            // Pass Clerk ID directly, action handles resolution
            const convs = await getConversations(user.id);
            setConversations(convs);

            setLoading(false);
        } catch (error) {
            console.error("Error loading conversations", error);
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
                </div>
                <ConversationList
                    conversations={conversations}
                    selectedId={selectedConversation?._id}
                    onSelect={setSelectedConversation}
                />
            </div>
            <div className="w-2/3 flex flex-col">
                {selectedConversation ? (
                    <ChatWindow conversation={selectedConversation} currentUserClerkId={user?.id} />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                        <div className="text-center">
                            <p className="text-xl font-medium">Select a conversation</p>
                            <p className="text-sm mt-2">Choose a thread from the left to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
