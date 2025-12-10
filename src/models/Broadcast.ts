import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBroadcast extends Document {
    senderId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'announcement' | 'course_update' | 'event' | 'promotion';
    targetCriteria: {
        role?: string[]; // e.g., ['member', 'moderator']
        courseIds?: string[]; // Enrolled in specific courses
        hasBadge?: string; // Earned specific badge
        membershipTier?: string;
    };
    channels: ('in_app' | 'email' | 'push')[];
    scheduledFor?: Date;
    status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
    stats: {
        sentCount: number;
        readCount: number;
        clickCount: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const BroadcastSchema: Schema = new Schema(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ['announcement', 'course_update', 'event', 'promotion'],
            default: 'announcement',
        },
        targetCriteria: {
            role: [{ type: String }],
            courseIds: [{ type: String }],
            hasBadge: { type: String },
            membershipTier: { type: String },
        },
        channels: [{ type: String, enum: ['in_app', 'email', 'push'] }],
        scheduledFor: { type: Date },
        status: {
            type: String,
            enum: ['draft', 'scheduled', 'sent', 'cancelled'],
            default: 'draft',
        },
        stats: {
            sentCount: { type: Number, default: 0 },
            readCount: { type: Number, default: 0 },
            clickCount: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

const Broadcast: Model<IBroadcast> =
    mongoose.models.Broadcast || mongoose.model<IBroadcast>('Broadcast', BroadcastSchema);

export default Broadcast;
