import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookClub extends Document {
    title: string;
    slug: string;
    description: string;
    coverImage?: string;
    type: 'ongoing' | 'time_based';
    pace: 'self_paced' | 'weekly' | 'scheduled';
    visibility: 'public' | 'members_only' | 'invite_only';
    startDate?: Date;
    endDate?: Date;
    createdBy: mongoose.Types.ObjectId;
    membersCount: number;
    booksCount: number;
    currentGoal?: string;
    nextMeeting?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const BookClubSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        coverImage: { type: String },
        type: { type: String, enum: ['ongoing', 'time_based'], default: 'ongoing' },
        pace: { type: String, enum: ['self_paced', 'weekly', 'scheduled'], default: 'self_paced' },
        visibility: { type: String, enum: ['public', 'members_only', 'invite_only'], default: 'public' },
        startDate: { type: Date },
        endDate: { type: Date },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        membersCount: { type: Number, default: 0 },
        booksCount: { type: Number, default: 0 },
        currentGoal: { type: String }, // e.g. "Chapter 1-3"
        nextMeeting: { type: Date }, // e.g. Discussion date
    },
    { timestamps: true }
);

const BookClub: Model<IBookClub> = mongoose.models.BookClub || mongoose.model<IBookClub>('BookClub', BookClubSchema);

export default BookClub;
