import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserPreference extends Document {
    userId: mongoose.Types.ObjectId;
    notifications: {
        email: {
            messages: boolean;
            mentions: boolean;
            courseUpdates: boolean;
            marketing: boolean;
        };
        push: {
            messages: boolean;
            mentions: boolean;
            courseUpdates: boolean;
        };
    };
    privacy: {
        allowDMsFrom: 'everyone' | 'members' | 'admins_only';
        showOnlineStatus: boolean;
        showReadReceipts: boolean;
    };
    blockedUsers: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserPreferenceSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
        notifications: {
            email: {
                messages: { type: Boolean, default: true },
                mentions: { type: Boolean, default: true },
                courseUpdates: { type: Boolean, default: true },
                marketing: { type: Boolean, default: true },
            },
            push: {
                messages: { type: Boolean, default: true },
                mentions: { type: Boolean, default: true },
                courseUpdates: { type: Boolean, default: true },
            },
        },
        privacy: {
            allowDMsFrom: {
                type: String,
                enum: ['everyone', 'members', 'admins_only'],
                default: 'members',
            },
            showOnlineStatus: { type: Boolean, default: true },
            showReadReceipts: { type: Boolean, default: true },
        },
        blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

const UserPreference: Model<IUserPreference> =
    mongoose.models.UserPreference || mongoose.model<IUserPreference>('UserPreference', UserPreferenceSchema);

export default UserPreference;
