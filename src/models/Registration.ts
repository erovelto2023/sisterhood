import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegistration extends Document {
    event: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    status: 'registered' | 'attended' | 'cancelled' | 'waitlist';
    paymentStatus: 'paid' | 'pending' | 'free';
    checkedInAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const RegistrationSchema: Schema = new Schema(
    {
        event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['registered', 'attended', 'cancelled', 'waitlist'], default: 'registered' },
        paymentStatus: { type: String, enum: ['paid', 'pending', 'free'], default: 'free' },
        checkedInAt: { type: Date },
    },
    { timestamps: true }
);

// Prevent duplicate registrations
RegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

const Registration: Model<IRegistration> = mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);

export default Registration;
