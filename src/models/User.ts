import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    clerkId: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    bio?: string;
    role: 'admin' | 'moderator' | 'member';
    status: 'active' | 'suspended';
    friends: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        clerkId: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        imageUrl: { type: String },
        bio: { type: String },
        role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
        status: { type: String, enum: ['active', 'suspended'], default: 'active' },
        friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
