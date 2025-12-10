import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlannerTask extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    linkedTo?: {
        type: 'course' | 'lesson' | 'goal' | 'challenge';
        id: string;
        title?: string;
    };
    focusType: 'deep_work' | 'admin' | 'learning' | 'other';
    estimatedMinutes?: number;
    createdAt: Date;
    updatedAt: Date;
}

const PlannerTaskSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        dueDate: { type: Date },
        linkedTo: {
            type: { type: String, enum: ['course', 'lesson', 'goal', 'challenge'] },
            id: { type: String },
            title: { type: String }
        },
        focusType: {
            type: String,
            enum: ['deep_work', 'admin', 'learning', 'other'],
            default: 'other'
        },
        estimatedMinutes: { type: Number },
    },
    { timestamps: true }
);

const PlannerTask: Model<IPlannerTask> = mongoose.models.PlannerTask || mongoose.model<IPlannerTask>('PlannerTask', PlannerTaskSchema);

export default PlannerTask;
