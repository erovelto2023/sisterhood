import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadgeCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BadgeCategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
    },
    { timestamps: true }
);

const BadgeCategory: Model<IBadgeCategory> = mongoose.models.BadgeCategory || mongoose.model<IBadgeCategory>('BadgeCategory', BadgeCategorySchema);

export default BadgeCategory;
