'use server';

import dbConnect from '../db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import { checkCanMessage } from './user-preference.actions';
import { createNotification } from './notification.actions';
import { revalidatePath } from 'next/cache';

export async function sendMessage(params: {
    senderId?: string;
    senderClerkId?: string;
    recipientId: string; // Or conversationId if existing
    content: string;
    attachments?: any[];
    conversationId?: string; // Optional, if replying to existing thread
    path?: string;
}) {
    try {
        await dbConnect();
        let { senderId, senderClerkId, recipientId, content, attachments, conversationId, path } = params;

        // Resolve senderId if only clerkId provided
        if (!senderId && senderClerkId) {
            const sender = await User.findOne({ clerkId: senderClerkId });
            if (!sender) throw new Error("Sender not found");
            senderId = sender._id.toString();
        }

        if (!senderId) throw new Error("Sender ID required");

        // 1. Check permissions (only for 1:1, group logic might differ)
        // If conversationId exists, we might skip this or check if user is still in it.
        // For now, check 1:1 permission if it's a new DM or direct reply.
        if (recipientId) {
            const permission = await checkCanMessage(senderId, recipientId);
            if (!permission.allowed) {
                throw new Error(`Cannot send message: ${permission.reason}`);
            }
        }

        let convId = conversationId;
        let conversation;

        // 2. Find or Create Conversation
        if (convId) {
            conversation = await Conversation.findById(convId);
        } else if (recipientId) {
            // Check if conversation already exists between these two
            conversation = await Conversation.findOne({
                participants: { $all: [senderId, recipientId], $size: 2 },
                isGroup: false,
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, recipientId] as any,
                    unreadCounts: { [senderId]: 0, [recipientId]: 0 },
                    isGroup: false,
                });
            }
            convId = conversation._id.toString();
        } else {
            throw new Error('RecipientId or ConversationId required');
        }

        if (!conversation) throw new Error('Conversation not found');

        // 3. Create Message
        const message = (await Message.create({
            conversationId: convId,
            senderId,
            content,
            attachments: attachments || [],
            readBy: [{ userId: senderId, readAt: new Date() }], // Sender has read it
        } as any)) as any;

        // 4. Update Conversation (Last Message & Unread Counts)
        const otherParticipants = conversation.participants.filter(
            (p: any) => p.toString() !== senderId
        );

        // Increment unread for others
        // Note: Mongoose Map manipulation
        const newUnreadCounts = conversation.unreadCounts || new Map();
        for (const pId of otherParticipants) {
            const pIdStr = pId.toString();
            const current = newUnreadCounts.get(pIdStr) || 0;
            newUnreadCounts.set(pIdStr, current + 1);
        }

        await Conversation.findByIdAndUpdate(convId, {
            lastMessage: {
                content: content.substring(0, 50) + (content.length > 50 ? '...' : ''), // Preview
                senderId,
                createdAt: new Date(),
            },
            unreadCounts: newUnreadCounts,
            updatedAt: new Date(),
        });

        // 5. Send Notification to Recipient (for 1:1)
        // For groups, we might want to fan-out or rely on socket/polling
        if (otherParticipants.length === 1) {
            const recipient = otherParticipants[0];
            const sender = await User.findById(senderId).select('firstName lastName');

            await createNotification({
                recipientId: recipient.toString(),
                type: 'message',
                title: `New message from ${sender?.firstName}`,
                message: content.substring(0, 100),
                data: { conversationId: convId, messageId: message._id.toString() },
            });
        }

        if (path) {
            revalidatePath(path);
        }

        return JSON.parse(JSON.stringify(message));
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

export async function getConversations(userIdOrClerkId: string) {
    try {
        await dbConnect();

        let userId = userIdOrClerkId;

        // Check if it's a Mongo ID (24 hex chars)
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(userIdOrClerkId);

        if (!isMongoId) {
            const user = await User.findOne({ clerkId: userIdOrClerkId });
            if (!user) {
                // If user not found by Clerk ID, return empty or throw? 
                // Return empty array to avoid crashing UI if user sync is delayed
                return [];
            }
            userId = user._id.toString();
        }

        // Find conversations and populate participants
        const conversations = await Conversation.find({ participants: userId })
            .sort({ updatedAt: -1 })
            .populate({
                path: 'participants',
                select: 'firstName lastName imageUrl role',
            });

        return JSON.parse(JSON.stringify(conversations));
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
}

export async function getMessages(conversationId: string, limit = 50, page = 1) {
    try {
        await dbConnect();
        const skip = (page - 1) * limit;

        const messages = await Message.find({ conversationId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'senderId',
                select: 'firstName lastName imageUrl',
            });

        return JSON.parse(JSON.stringify(messages.reverse())); // Return in chronological order
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

export async function markConversationAsRead(
    conversationId: string,
    userId: string,
    path?: string
) {
    try {
        await dbConnect();

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) throw new Error('Conversation not found');

        // Reset unread count for user
        if (conversation.unreadCounts) {
            conversation.unreadCounts.set(userId, 0);
            await conversation.save();
        }

        if (path) {
            revalidatePath(path);
        }

        return { success: true };
    } catch (error) {
        console.error('Error marking conversation as read:', error);
        throw error;
    }
}
