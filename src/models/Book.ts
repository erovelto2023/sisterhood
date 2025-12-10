import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBook extends Document {
    bookClub: mongoose.Types.ObjectId;
    title: string;
    author: string;
    description: string;
    coverImage?: string;
    pdfUrl: string;
    pageCount?: number;
    order: number;
    chapters: {
        title: string;
        startPage?: number;
        discussionPrompt?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const BookSchema: Schema = new Schema(
    {
        bookClub: { type: Schema.Types.ObjectId, ref: 'BookClub', required: true },
        title: { type: String, required: true },
        author: { type: String, required: true },
        description: { type: String },
        coverImage: { type: String },
        pdfUrl: { type: String, required: true },
        pageCount: { type: Number },
        order: { type: Number, default: 0 },
        chapters: [
            {
                title: { type: String, required: true },
                startPage: { type: Number },
                discussionPrompt: { type: String },
            }
        ],
    },
    { timestamps: true }
);

const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);

export default Book;
