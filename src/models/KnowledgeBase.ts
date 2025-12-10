import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IKnowledgeBase extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;

    category: mongoose.Types.ObjectId;
    tags: string[];
    type: 'article' | 'tutorial' | 'faq' | 'video';

    featuredImage?: string;
    attachments: { title: string; url: string }[];

    accessType: 'public' | 'members_only' | 'paid';
    status: 'draft' | 'published' | 'archived';

    author: mongoose.Types.ObjectId;
    views: number;
    helpfulCount: number;
    notHelpfulCount: number;

    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}

const KnowledgeBaseSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        excerpt: { type: String },

        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        tags: [{ type: String }],
        type: { type: String, enum: ['article', 'tutorial', 'faq', 'video'], default: 'article' },

        featuredImage: { type: String },
        attachments: [{ title: String, url: String }],

        accessType: { type: String, enum: ['public', 'members_only', 'paid'], default: 'members_only' },
        status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },

        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        views: { type: Number, default: 0 },
        helpfulCount: { type: Number, default: 0 },
        notHelpfulCount: { type: Number, default: 0 },

        publishedAt: { type: Date },
    },
    { timestamps: true }
);

const KnowledgeBase: Model<IKnowledgeBase> = mongoose.models.KnowledgeBase || mongoose.model<IKnowledgeBase>('KnowledgeBase', KnowledgeBaseSchema);

export default KnowledgeBase;
