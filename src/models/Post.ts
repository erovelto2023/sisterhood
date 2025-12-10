import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
    content: string;
    title?: string;
    imageUrl?: string;
    author: mongoose.Types.ObjectId;
    recipient?: mongoose.Types.ObjectId; // For wall posts
    space?: mongoose.Types.ObjectId; // For community space posts
    type: 'post' | 'question' | 'poll' | 'announcement';
    isPinned: boolean;
    isLocked: boolean;
    tags: string[];
    likes: mongoose.Types.ObjectId[];
    comments: {
        author: mongoose.Types.ObjectId;
        content: string;
        createdAt: Date;
    }[];
    pollOptions?: {
        text: string;
        votes: mongoose.Types.ObjectId[];
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema = new Schema(
    {
        content: { type: String, required: true },
        title: { type: String },
        imageUrl: { type: String },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        recipient: { type: Schema.Types.ObjectId, ref: 'User' }, // If null, it's a status update on own profile
        space: { type: Schema.Types.ObjectId, ref: 'Space' },
        bookClub: { type: Schema.Types.ObjectId, ref: 'BookClub' }, // For book club discussions
        type: { type: String, enum: ['post', 'question', 'poll', 'announcement'], default: 'post' },
        isPinned: { type: Boolean, default: false },
        isLocked: { type: Boolean, default: false },
        tags: [{ type: String }],
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [
            {
                author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                content: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        pollOptions: [
            {
                text: { type: String, required: true },
                votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            }
        ],
    },
    { timestamps: true }
);

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
