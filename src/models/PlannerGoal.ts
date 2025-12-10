import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlannerGoal extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    type: 'learning' | 'skill' | 'project' | 'habit' | 'personal';
    status: 'active' | 'completed' | 'paused';
    deadline?: Date;
    linkedResources?: {
        type: 'course' | 'challenge' | 'community';
        id: string;
    }[];
    milestones: {
        title: string;
        completed: boolean;
    }[];
    progress: number;
    createdAt: Date;
    updatedAt: Date;
}

const PlannerGoalSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String },
        type: {
            type: String,
            enum: ['learning', 'skill', 'project', 'habit', 'personal'],
            default: 'personal'
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'paused'],
            default: 'active'
        },
        deadline: { type: Date },
        linkedResources: [{
            type: { type: String, enum: ['course', 'challenge', 'community'] },
            id: { type: String }
        }],
        milestones: [{
            title: { type: String },
            completed: { type: Boolean, default: false }
        }],
        progress: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const PlannerGoal: Model<IPlannerGoal> = mongoose.models.PlannerGoal || mongoose.model<IPlannerGoal>('PlannerGoal', PlannerGoalSchema);

export default PlannerGoal;
