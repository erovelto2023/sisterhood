import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISpaceMember extends Document {
    space: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    role: 'admin' | 'moderator' | 'member';
    joinedAt: Date;
}

const SpaceMemberSchema: Schema = new Schema(
    {
        space: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
        joinedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Compound index to ensure a user is only in a space once
SpaceMemberSchema.index({ space: 1, user: 1 }, { unique: true });

const SpaceMember: Model<ISpaceMember> = mongoose.models.SpaceMember || mongoose.model<ISpaceMember>('SpaceMember', SpaceMemberSchema);

export default SpaceMember;
