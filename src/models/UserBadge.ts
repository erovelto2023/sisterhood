import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserBadge extends Document {
    user: mongoose.Types.ObjectId;
    badge: mongoose.Types.ObjectId;
    awardedAt: Date;
    isSeen: boolean;
}

const UserBadgeSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        badge: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
        awardedAt: { type: Date, default: Date.now },
        isSeen: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Ensure a user can only earn a badge once (unless we want stackable, but usually unique is default)
// The user requirement says "Stackable", but typically that means "Level 1, Level 2" which are different badges.
// If they mean literally earning the "Good Job" badge 5 times, we'd remove this index.
// "Stackable" in the prompt might mean "Tiered" (Bronze, Silver, Gold).
// Let's assume unique for now to prevent spamming, and tiered badges are separate documents.
UserBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

const UserBadge: Model<IUserBadge> = mongoose.models.UserBadge || mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);

export default UserBadge;
