import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISpace extends Document {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    coverImage?: string;
    type: 'public' | 'private' | 'secret';
    accessType: 'open' | 'invite_only' | 'course_enrollment';
    linkedCourseId?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    membersCount: number;
    postsCount: number;
    settings: {
        allowMemberPosts: boolean;
        requiresApproval: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

const SpaceSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        icon: { type: String },
        coverImage: { type: String },
        type: { type: String, enum: ['public', 'private', 'secret'], default: 'public' },
        accessType: { type: String, enum: ['open', 'invite_only', 'course_enrollment'], default: 'open' },
        linkedCourseId: { type: Schema.Types.ObjectId, ref: 'Course' },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        membersCount: { type: Number, default: 0 },
        postsCount: { type: Number, default: 0 },
        settings: {
            allowMemberPosts: { type: Boolean, default: true },
            requiresApproval: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

const Space: Model<ISpace> = mongoose.models.Space || mongoose.model<ISpace>('Space', SpaceSchema);

export default Space;
