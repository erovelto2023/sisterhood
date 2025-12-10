import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILesson extends Document {
    title: string;
    slug: string;
    description?: string;

    type: 'video' | 'text' | 'quiz' | 'assignment';
    content?: string;
    videoUrl?: string;
    duration?: number;
    resources: { title: string; url: string }[];

    module: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;

    order: number;
    isFreePreview: boolean;
    isPublished: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String },

        type: { type: String, enum: ['video', 'text', 'quiz', 'assignment'], default: 'text' },
        content: { type: String },
        videoUrl: { type: String },
        duration: { type: Number, default: 0 },
        resources: [{ title: String, url: String }],

        module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },

        order: { type: Number, default: 0 },
        isFreePreview: { type: Boolean, default: false },
        isPublished: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Compound index for unique slugs within a module
LessonSchema.index({ module: 1, slug: 1 }, { unique: true });

const Lesson: Model<ILesson> = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

export default Lesson;
