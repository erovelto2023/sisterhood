import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

const BlogCategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String },
        count: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const BlogCategory: Model<IBlogCategory> = mongoose.models.BlogCategory || mongoose.model<IBlogCategory>('BlogCategory', BlogCategorySchema);

export default BlogCategory;
