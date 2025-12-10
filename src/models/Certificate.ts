import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
    title: string;
    description: string;
    imageUrl?: string;
    criteria: string;
    createdAt: Date;
    updatedAt: Date;
}

const CertificateSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String },
        criteria: { type: String, required: true },
    },
    { timestamps: true }
);

const Certificate: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);

export default Certificate;
