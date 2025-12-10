import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
    recipientId: mongoose.Types.ObjectId;
    type:
    | 'message'
    | 'reply'
    | 'mention'
    | 'course_progress'
    | 'assignment'
    | 'badge'
    | 'certificate'
    | 'admin_broadcast'
    | 'system';
    title: string;
    message: string;
    data?: {
        url?: string;
        relatedId?: string; // e.g., messageId, courseId
        [key: string]: any;
    };
    isRead: boolean;
    priority: 'info' | 'important' | 'critical';
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        type: {
            type: String,
            enum: [
                'message',
                'reply',
                'mention',
                'course_progress',
                'assignment',
                'badge',
                'certificate',
                'admin_broadcast',
                'system',
            ],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        data: { type: Schema.Types.Mixed }, // Flexible payload
        isRead: { type: Boolean, default: false, index: true },
        priority: { type: String, enum: ['info', 'important', 'critical'], default: 'info' },
    },
    { timestamps: true }
);

// Index for fetching unread notifications quickly
NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotification> =
    mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
