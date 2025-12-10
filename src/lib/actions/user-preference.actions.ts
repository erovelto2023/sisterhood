'use server';

import dbConnect from '../db';
import UserPreference from '@/models/UserPreference';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

export async function getUserPreference(userId: string) {
    try {
        await dbConnect();
        let preference = await UserPreference.findOne({ userId });

        if (!preference) {
            // Create default preferences if they don't exist
            preference = await UserPreference.create({
                userId,
                notifications: {
                    email: { messages: true, mentions: true, courseUpdates: true, marketing: true },
                    push: { messages: true, mentions: true, courseUpdates: true }
                },
                privacy: {
                    allowDMsFrom: 'members',
                    showOnlineStatus: true,
                    showReadReceipts: true
                }
            });
        }

        return JSON.parse(JSON.stringify(preference));
    } catch (error) {
        console.error('Error fetching user preference:', error);
        throw error;
    }
}

export async function updateUserPreference(userId: string, updateData: any, path?: string) {
    try {
        await dbConnect();
        const preference = await UserPreference.findOneAndUpdate(
            { userId },
            updateData,
            { new: true, upsert: true }
        );

        if (path) {
            revalidatePath(path);
        }

        return JSON.parse(JSON.stringify(preference));
    } catch (error) {
        console.error('Error updating user preference:', error);
        throw error;
    }
}

export async function blockUser(blockerId: string, targetId: string, path?: string) {
    try {
        await dbConnect();

        // Add to blocker's list
        await UserPreference.findOneAndUpdate(
            { userId: blockerId },
            { $addToSet: { blockedUsers: targetId } },
            { upsert: true }
        );

        if (path) {
            revalidatePath(path);
        }
        return { success: true };
    } catch (error) {
        console.error('Error blocking user:', error);
        throw error;
    }
}

export async function unblockUser(blockerId: string, targetId: string, path?: string) {
    try {
        await dbConnect();

        await UserPreference.findOneAndUpdate(
            { userId: blockerId },
            { $pull: { blockedUsers: targetId } }
        );

        if (path) {
            revalidatePath(path);
        }
        return { success: true };
    } catch (error) {
        console.error('Error unblocking user:', error);
        throw error;
    }
}

export async function checkCanMessage(senderId: string, recipientId: string): Promise<{ allowed: boolean; reason?: string }> {
    try {
        await dbConnect();

        // 1. Check if recipient has blocked sender
        const recipientPref = await UserPreference.findOne({ userId: recipientId });
        if (recipientPref?.blockedUsers?.includes(senderId as any)) {
            return { allowed: false, reason: 'blocked' };
        }

        // 2. Check recipient's privacy settings
        const privacy = recipientPref?.privacy?.allowDMsFrom || 'members';

        if (privacy === 'everyone') return { allowed: true };

        if (privacy === 'admins_only') {
            const sender = await User.findById(senderId);
            if (sender?.role === 'admin' || sender?.role === 'moderator') {
                return { allowed: true };
            }
            return { allowed: false, reason: 'privacy_admins_only' };
        }

        // Default 'members' - assuming all authenticated users are members for now.
        // If you implement friend-only logic, add it here.
        return { allowed: true };

    } catch (error) {
        console.error('Error checking message permission:', error);
        return { allowed: false, reason: 'error' };
    }
}
