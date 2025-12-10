'use server';

import dbConnect from '../db';
import Email from '@/models/Email';
import User from '@/models/User';
import { createNotification } from './notification.actions';
import { revalidatePath } from 'next/cache';

export async function sendEmail(params: {
    senderClerkId: string;
    recipientId: string; // Mongo ID
    subject: string;
    body: string;
}) {
    try {
        await dbConnect();
        const { senderClerkId, recipientId, subject, body } = params;

        const sender = await User.findOne({ clerkId: senderClerkId });
        if (!sender) throw new Error("Sender not found");

        const email = await Email.create({
            senderId: sender._id,
            recipientId,
            subject,
            body,
        });

        // Notify recipient
        await createNotification({
            recipientId,
            type: 'email',
            title: `New email from ${sender.firstName}`,
            message: subject,
            data: { emailId: email._id.toString() },
        });

        return JSON.parse(JSON.stringify(email));
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export async function getEmails(clerkId: string) {
    try {
        await dbConnect();
        const user = await User.findOne({ clerkId });
        if (!user) return [];

        const emails = await Email.find({ recipientId: user._id, isArchived: false })
            .sort({ createdAt: -1 })
            .populate('senderId', 'firstName lastName imageUrl');

        return JSON.parse(JSON.stringify(emails));
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
}

export async function markEmailAsRead(emailId: string) {
    try {
        await dbConnect();
        await Email.findByIdAndUpdate(emailId, { isRead: true });
        return { success: true };
    } catch (error) {
        console.error('Error marking email as read:', error);
        throw error;
    }
}
