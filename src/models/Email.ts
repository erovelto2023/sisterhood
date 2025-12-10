import mongoose, { Schema, Document } from 'mongoose';

export interface IEmail extends Document {
    senderId: mongoose.Types.ObjectId;
    recipientId: mongoose.Types.ObjectId;
    subject: string;
    body: string;
    isRead: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EmailSchema: Schema = new Schema(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        subject: { type: String, required: true },
        body: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        isArchived: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Email || mongoose.model<IEmail>('Email', EmailSchema);
