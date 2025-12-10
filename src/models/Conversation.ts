import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    lastMessage?: {
        content: string;
        senderId: mongoose.Types.ObjectId;
        createdAt: Date;
    };
    unreadCounts: Map<string, number>;
    isGroup: boolean;
    groupName?: string;
    groupImage?: string;
    admins?: mongoose.Types.ObjectId[];
    context?: {
        type: string; // e.g., 'course', 'event'
        id: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        lastMessage: {
            content: { type: String },
            senderId: { type: Schema.Types.ObjectId, ref: 'User' },
            createdAt: { type: Date },
        },
        unreadCounts: {
            type: Map,
            of: Number,
            default: {},
        },
        isGroup: { type: Boolean, default: false },
        groupName: { type: String },
        groupImage: { type: String },
        admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        context: {
            type: { type: String },
            id: { type: String },
        },
    },
    { timestamps: true }
);

// Index for quick lookup of user's conversations
ConversationSchema.index({ participants: 1, updatedAt: -1 });

const Conversation: Model<IConversation> =
    mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
