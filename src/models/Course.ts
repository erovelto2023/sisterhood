import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICourse extends Document {
    title: string;
    slug: string;
    description: string;
    shortDescription?: string;
    thumbnail?: string;

    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];

    price: number;
    isFree: boolean;
    status: 'draft' | 'published' | 'archived';

    instructor: mongoose.Types.ObjectId;

    enrollmentCount: number;
    rating: number;

    certificateTemplate?: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        shortDescription: { type: String },
        thumbnail: { type: String },

        category: { type: String, required: true },
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
        tags: [{ type: String }],

        price: { type: Number, default: 0 },
        isFree: { type: Boolean, default: false },
        status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },

        instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },

        enrollmentCount: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },

        certificateTemplate: { type: Schema.Types.ObjectId, ref: 'CertificateTemplate' },
    },
    { timestamps: true }
);

// Virtual for modules
CourseSchema.virtual('modules', {
    ref: 'Module',
    localField: '_id',
    foreignField: 'course',
});

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
