import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificateTemplate extends Document {
    name: string; // Internal name for admin
    title: string; // "Certificate of Completion"
    subtitle?: string;
    description?: string; // "This certifies that..."

    bgImage?: string;
    signatureImage?: string;

    textColor: string;

    showDate: boolean;
    showId: boolean;
    showInstructor: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const CertificateTemplateSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        title: { type: String, default: 'Certificate of Completion' },
        subtitle: { type: String },
        description: { type: String, default: 'This certifies that the student has successfully completed the course.' },

        bgImage: { type: String },
        signatureImage: { type: String },

        textColor: { type: String, default: '#000000' },

        showDate: { type: Boolean, default: true },
        showId: { type: Boolean, default: true },
        showInstructor: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const CertificateTemplate: Model<ICertificateTemplate> = mongoose.models.CertificateTemplate || mongoose.model<ICertificateTemplate>('CertificateTemplate', CertificateTemplateSchema);

export default CertificateTemplate;
