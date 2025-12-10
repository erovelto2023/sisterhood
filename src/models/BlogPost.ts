import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
    title: string;
    slug: string;
    subtitle?: string;
    content: string; // HTML or JSON string for blocks
    excerpt?: string;
    status: 'draft' | 'review' | 'published' | 'archived';
    author: mongoose.Types.ObjectId;
    category?: mongoose.Types.ObjectId;
    tags: string[];
    featuredImage?: string;
    publishDate?: Date;
    readingTime?: number; // in minutes
    views: number;

    // SEO
    seoTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;

    // Engagement
    isFeatured: boolean;
    allowComments: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        subtitle: { type: String },
        content: { type: String, required: true },
        excerpt: { type: String },
        status: {
            type: String,
            enum: ['draft', 'review', 'published', 'archived'],
            default: 'draft'
        },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: Schema.Types.ObjectId, ref: 'BlogCategory' },
        tags: [{ type: String }],
        featuredImage: { type: String },
        publishDate: { type: Date },
        readingTime: { type: Number, default: 0 },
        views: { type: Number, default: 0 },

        seoTitle: { type: String },
        metaDescription: { type: String },
        canonicalUrl: { type: String },

        isFeatured: { type: Boolean, default: false },
        allowComments: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Index for text search
BlogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
