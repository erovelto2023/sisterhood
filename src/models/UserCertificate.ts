import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserCertificate extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    template: mongoose.Types.ObjectId;

    certificateId: string; // Unique serial number
    issueDate: Date;

    status: 'active' | 'revoked';
}

const UserCertificateSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        template: { type: Schema.Types.ObjectId, ref: 'CertificateTemplate', required: true },

        certificateId: { type: String, required: true, unique: true },
        issueDate: { type: Date, default: Date.now },

        status: { type: String, enum: ['active', 'revoked'], default: 'active' },
    },
    { timestamps: true }
);

const UserCertificate: Model<IUserCertificate> = mongoose.models.UserCertificate || mongoose.model<IUserCertificate>('UserCertificate', UserCertificateSchema);

export default UserCertificate;
