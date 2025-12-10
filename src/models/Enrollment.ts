import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnrollment extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;

    completedLessons: mongoose.Types.ObjectId[];
    currentLesson?: mongoose.Types.ObjectId;
    progress: number;

    status: 'active' | 'completed' | 'expired';

    enrolledAt: Date;
    completedAt?: Date;
    lastAccessedAt: Date;
}

const EnrollmentSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },

        completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
        currentLesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
        progress: { type: Number, default: 0 },

        status: { type: String, enum: ['active', 'completed', 'expired'], default: 'active' },

        enrolledAt: { type: Date, default: Date.now },
        completedAt: { type: Date },
        lastAccessedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Ensure a user can only enroll once in a course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> = mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

export default Enrollment;
