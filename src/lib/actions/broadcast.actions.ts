'use server';

import dbConnect from '../db';
import Broadcast from '@/models/Broadcast';
import User from '@/models/User';
import { createNotification } from './notification.actions';
import { revalidatePath } from 'next/cache';

export async function createBroadcast(params: {
    senderId?: string;
    senderClerkId?: string;
    title: string;
    message: string;
    type: string;
    targetCriteria: any;
    channels: string[];
    scheduledFor?: Date;
}) {
    try {
        await dbConnect();
        let { senderId, senderClerkId, title, message, type, targetCriteria, channels, scheduledFor } = params;

        if (!senderId && senderClerkId) {
            const sender = await User.findOne({ clerkId: senderClerkId });
            if (!sender) throw new Error("Sender not found");
            senderId = sender._id.toString();
        }

        if (!senderId) throw new Error("Sender ID required");

        const broadcast = await Broadcast.create({
            senderId,
            title,
            message,
            type,
            targetCriteria,
            channels: channels as any,
            scheduledFor,
            status: scheduledFor ? 'scheduled' : 'draft',
        });

        return JSON.parse(JSON.stringify(broadcast));
    } catch (error) {
        console.error('Error creating broadcast:', error);
        throw error;
    }
}

export async function sendBroadcast(broadcastId: string) {
    try {
        await dbConnect();

        const broadcast = await Broadcast.findById(broadcastId);
        if (!broadcast) throw new Error('Broadcast not found');

        if (broadcast.status === 'sent') throw new Error('Broadcast already sent');

        // 1. Find Target Users
        const query: any = { status: 'active' }; // Only active users

        // Apply filters
        if (broadcast.targetCriteria) {
            const { role, membershipTier, courseIds } = broadcast.targetCriteria;

            if (role && role.length > 0) {
                query.role = { $in: role };
            }

            // Note: membershipTier and courseIds would require looking up Enrollment or specific User fields
            // For now, let's assume simple role-based or all-user broadcast
            // If courseIds present, we'd need to find users enrolled in those courses.
            // This logic can be expanded.
        }

        const users = await User.find(query).select('_id email firstName');

        // 2. Send to Channels
        let sentCount = 0;

        // In-App Notifications
        if (broadcast.channels.includes('in_app')) {
            const notificationPromises = users.map((user) =>
                createNotification({
                    recipientId: user._id.toString(),
                    type: 'admin_broadcast',
                    title: broadcast.title,
                    message: broadcast.message,
                    priority: 'important',
                    data: { broadcastId: broadcast._id.toString() },
                })
            );
            await Promise.all(notificationPromises);
            sentCount = users.length;
        }

        // Email (Placeholder)
        if (broadcast.channels.includes('email')) {
            // TODO: Integrate email service (Resend/SendGrid)
            // await sendBulkEmails(users, broadcast.title, broadcast.message);
            console.log(`[Mock] Sending emails to ${users.length} users`);
        }

        // 3. Update Broadcast Status
        broadcast.status = 'sent';
        broadcast.stats.sentCount = sentCount;
        await broadcast.save();

        revalidatePath('/admin/communications'); // Assuming this page exists
        return { success: true, sentCount };
    } catch (error) {
        console.error('Error sending broadcast:', error);
        throw error;
    }
}

export async function getBroadcasts() {
    try {
        await dbConnect();
        const broadcasts = await Broadcast.find()
            .sort({ createdAt: -1 })
            .populate('senderId', 'firstName lastName');
        return JSON.parse(JSON.stringify(broadcasts));
    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        throw error;
    }
}
