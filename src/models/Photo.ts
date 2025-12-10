import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPhoto extends Document {
    url: string;
    caption?: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const PhotoSchema: Schema = new Schema(
    {
        url: { type: String, required: true },
        caption: { type: String },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const Photo: Model<IPhoto> = mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);

export default Photo;
