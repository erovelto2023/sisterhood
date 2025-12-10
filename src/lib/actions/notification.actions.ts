'use server';

import dbConnect from '../db';
import Notification, { INotification } from '@/models/Notification';
import { revalidatePath } from 'next/cache';

export async function createNotification(params: {
    recipientId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    priority?: 'info' | 'important' | 'critical';
}) {
    try {
        await dbConnect();

        const notification = await Notification.create({
            recipientId: params.recipientId,
            type: params.type,
            title: params.title,
            message: params.message,
            data: params.data,
            priority: params.priority || 'info',
        });

        return JSON.parse(JSON.stringify(notification));
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}

export async function getUserNotifications(userId: string, limit = 20, page = 1) {
    try {
        await dbConnect();
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ recipientId: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await Notification.countDocuments({ recipientId: userId });
        const unreadCount = await Notification.countDocuments({ recipientId: userId, isRead: false });

        return {
            notifications: JSON.parse(JSON.stringify(notifications)),
            totalCount,
            unreadCount,
            isNext: totalCount > skip + notifications.length,
        };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}

export async function markNotificationAsRead(notificationId: string, path?: string) {
    try {
        await dbConnect();

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (path) {
            revalidatePath(path);
        }

        return JSON.parse(JSON.stringify(notification));
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}

export async function markAllNotificationsAsRead(userId: string, path?: string) {
    try {
        await dbConnect();

        await Notification.updateMany(
            { recipientId: userId, isRead: false },
            { isRead: true }
        );

        if (path) {
            revalidatePath(path);
        }

        return { success: true };
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
}

export async function deleteNotification(notificationId: string, path?: string) {
    try {
        await dbConnect();
        await Notification.findByIdAndDelete(notificationId);

        if (path) {
            revalidatePath(path);
        }
        return { success: true };
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
}
