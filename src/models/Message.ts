import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    attachments: {
        type: 'image' | 'video' | 'file';
        url: string;
        name: string;
        size?: number;
    }[];
    readBy: {
        userId: mongoose.Types.ObjectId;
        readAt: Date;
    }[];
    reactions: Map<string, mongoose.Types.ObjectId[]>; // emoji -> [userIds]
    replyTo?: mongoose.Types.ObjectId;
    isSystemMessage: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, default: '' },
        attachments: [
            {
                type: { type: String, enum: ['image', 'video', 'file'] },
                url: { type: String, required: true },
                name: { type: String },
                size: { type: Number },
            },
        ],
        readBy: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                readAt: { type: Date, default: Date.now },
            },
        ],
        reactions: {
            type: Map,
            of: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            default: {},
        },
        replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
        isSystemMessage: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
