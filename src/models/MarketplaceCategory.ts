import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMarketplaceCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    parent?: mongoose.Types.ObjectId;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}

const MarketplaceCategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String },
        icon: { type: String },
        parent: { type: Schema.Types.ObjectId, ref: 'MarketplaceCategory' },
        count: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const MarketplaceCategory: Model<IMarketplaceCategory> =
    mongoose.models.MarketplaceCategory || mongoose.model<IMarketplaceCategory>('MarketplaceCategory', MarketplaceCategorySchema);

export default MarketplaceCategory;
