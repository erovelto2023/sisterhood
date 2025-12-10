'use client';

import { useState, useEffect, useRef } from 'react';
import MessageInput from '@/components/chat/MessageInput';
import { getMessages, sendMessage } from '@/lib/actions/message.actions';
import { format } from 'date-fns';

interface ChatWindowProps {
    conversation: any;
    currentUserClerkId?: string;
}

export default function ChatWindow({ conversation, currentUserClerkId }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversation?._id) {
            loadMessages();
        }
    }, [conversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        setLoading(true);
        try {
            const msgs = await getMessages(conversation._id);
            setMessages(msgs);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (content: string, attachments: any[]) => {
        try {
            // Optimistic update
            const tempId = Date.now().toString();
            const newMessage = {
                _id: tempId,
                content,
                senderId: { _id: 'me', firstName: 'Me' }, // Placeholder
                createdAt: new Date(),
                attachments
            };
            setMessages(prev => [...prev, newMessage]);

            // Actual send
            if (!currentUserClerkId) return;

            await sendMessage({
                senderClerkId: currentUserClerkId,
                recipientId: '', // Conversation ID is enough if it exists
                conversationId: conversation._id,
                content,
                attachments
            });

            // Reload to get real message
            // Ideally we just replace the optimistic one, but reloading is safer for now
            loadMessages();

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                    {/* Display other participant name */}
                    Conversation
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId?._id === 'me' || msg.senderId?.clerkId === currentUserClerkId; // Logic needs refinement
                        return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                    }`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {format(new Date(msg.createdAt), 'h:mm a')}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <MessageInput onSend={handleSendMessage} />
        </div>
    );
}
