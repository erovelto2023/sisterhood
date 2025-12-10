import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookClubMember extends Document {
    bookClub: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    role: 'host' | 'moderator' | 'member';
    joinedAt: Date;
    progress: {
        book: mongoose.Types.ObjectId;
        completedChapters: string[]; // IDs or indices of completed chapters
        lastReadPage: number;
    }[];
}

const BookClubMemberSchema: Schema = new Schema(
    {
        bookClub: { type: Schema.Types.ObjectId, ref: 'BookClub', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['host', 'moderator', 'member'], default: 'member' },
        joinedAt: { type: Date, default: Date.now },
        progress: [
            {
                book: { type: Schema.Types.ObjectId, ref: 'Book' },
                completedChapters: [{ type: String }],
                lastReadPage: { type: Number, default: 0 },
            }
        ],
    },
    { timestamps: true }
);

// Compound index to ensure a user is only in a book club once
BookClubMemberSchema.index({ bookClub: 1, user: 1 }, { unique: true });

const BookClubMember: Model<IBookClubMember> = mongoose.models.BookClubMember || mongoose.model<IBookClubMember>('BookClubMember', BookClubMemberSchema);

export default BookClubMember;
