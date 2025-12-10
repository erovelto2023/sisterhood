import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IModule extends Document {
    title: string;
    slug: string;
    description?: string;
    course: mongoose.Types.ObjectId;
    order: number;
    isPublished: boolean;
    isFree: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ModuleSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        order: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false },
        isFree: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Compound index for unique slugs within a course
ModuleSchema.index({ course: 1, slug: 1 }, { unique: true });

// Virtual for lessons
ModuleSchema.virtual('lessons', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'module',
});

const Module: Model<IModule> = mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);

export default Module;
