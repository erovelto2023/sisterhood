'use client';

import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
    conversations: any[];
    selectedId?: string;
    onSelect: (conversation: any) => void;
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                    No conversations yet.
                </div>
            ) : (
                conversations.map((conv) => {
                    // Determine the "other" participant name/image
                    // This logic needs to be robust (filter out current user)
                    // For now, just taking the first one that isn't "me" (handled in parent or here if we have currentUserId)
                    // Let's assume the parent passes formatted data or we do it here.
                    // Simplified for now:
                    const otherParticipant = conv.participants[0]; // TODO: Fix this logic

                    return (
                        <div
                            key={conv._id}
                            onClick={() => onSelect(conv)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === conv._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                    {otherParticipant?.imageUrl ? (
                                        <img src={otherParticipant.imageUrl} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                            {otherParticipant?.firstName?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {otherParticipant?.firstName} {otherParticipant?.lastName}
                                        </h3>
                                        {conv.lastMessage?.createdAt && (
                                            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                                {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm truncate mt-1 ${conv.unreadCounts?.['me'] > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                        {conv.lastMessage?.content || 'No messages yet'}
                                    </p>
                                </div>
                                {conv.unreadCounts?.['me'] > 0 && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
