import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMarketplaceListing extends Document {
    title: string;
    slug: string;
    description: string;
    images: string[];
    category: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    store: mongoose.Types.ObjectId;

    type: 'product' | 'service';
    mode: 'barter' | 'buy' | 'both';

    price?: number; // Optional cash price
    tradePreferences?: string; // What they want in exchange

    location: {
        type: 'local' | 'online' | 'remote';
        address?: string; // City, State
        coordinates?: [number, number];
    };

    status: 'draft' | 'pending' | 'active' | 'sold' | 'suspended' | 'removed';
    views: number;

    isFeatured: boolean;
    moderationNotes?: string;

    createdAt: Date;
    updatedAt: Date;
}

const MarketplaceListingSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        images: [{ type: String }],
        category: { type: Schema.Types.ObjectId, ref: 'MarketplaceCategory', required: true },
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        store: { type: Schema.Types.ObjectId, ref: 'MarketplaceStore', required: true },

        type: { type: String, enum: ['product', 'service'], default: 'product' },
        mode: { type: String, enum: ['barter', 'buy', 'both'], default: 'barter' },

        price: { type: Number },
        tradePreferences: { type: String },

        location: {
            type: { type: String, enum: ['local', 'online', 'remote'], default: 'local' },
            address: { type: String },
            coordinates: { type: [Number] }, // [longitude, latitude]
        },

        status: {
            type: String,
            enum: ['draft', 'pending', 'active', 'sold', 'suspended', 'removed'],
            default: 'pending'
        },
        views: { type: Number, default: 0 },

        isFeatured: { type: Boolean, default: false },
        moderationNotes: { type: String },
    },
    { timestamps: true }
);

// Indexes
MarketplaceListingSchema.index({ title: 'text', description: 'text' });
MarketplaceListingSchema.index({ category: 1, status: 1 });
MarketplaceListingSchema.index({ seller: 1 });
MarketplaceListingSchema.index({ store: 1 });

const MarketplaceListing: Model<IMarketplaceListing> =
    mongoose.models.MarketplaceListing || mongoose.model<IMarketplaceListing>('MarketplaceListing', MarketplaceListingSchema);

export default MarketplaceListing;
