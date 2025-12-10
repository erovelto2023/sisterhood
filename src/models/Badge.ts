import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
    name: string;
    description: string;
    icon: string;
    category: mongoose.Types.ObjectId;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    points: number;

    // Trigger Logic
    triggerType: 'manual' | 'course_completion' | 'lesson_completion' | 'login_streak' | 'community_post' | 'comment_count';
    requirementCount: number; // e.g., 5 courses, 100 posts
    specificEntityId?: string; // e.g., specific course ID required

    isHidden: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BadgeSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true }, // URL to image
        category: { type: Schema.Types.ObjectId, ref: 'BadgeCategory', required: true },
        rarity: {
            type: String,
            enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
            default: 'common'
        },
        points: { type: Number, default: 0 },

        triggerType: {
            type: String,
            enum: ['manual', 'course_completion', 'lesson_completion', 'login_streak', 'community_post', 'comment_count'],
            default: 'manual'
        },
        requirementCount: { type: Number, default: 1 },
        specificEntityId: { type: String },

        isHidden: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Badge: Model<IBadge> = mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);

export default Badge;
