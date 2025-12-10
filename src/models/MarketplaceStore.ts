import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMarketplaceStore extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    bio?: string;
    bannerImage?: string;
    status: 'active' | 'suspended';
    rating: number;
    reviewCount: number;
    tradePreferences?: {
        barterPreferred: boolean;
        localOnly: boolean;
        shippingAllowed: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

const MarketplaceStoreSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        bio: { type: String },
        bannerImage: { type: String },
        status: {
            type: String,
            enum: ['active', 'suspended'],
            default: 'active'
        },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        tradePreferences: {
            barterPreferred: { type: Boolean, default: true },
            localOnly: { type: Boolean, default: false },
            shippingAllowed: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

const MarketplaceStore: Model<IMarketplaceStore> =
    mongoose.models.MarketplaceStore || mongoose.model<IMarketplaceStore>('MarketplaceStore', MarketplaceStoreSchema);

export default MarketplaceStore;
