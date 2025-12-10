import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlannerHabit extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly';
    targetDaysPerWeek?: number; // e.g., 3 times a week
    currentStreak: number;
    longestStreak: number;
    completedDates: Date[]; // Array of dates when habit was completed
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PlannerHabitSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        description: { type: String },
        frequency: {
            type: String,
            enum: ['daily', 'weekly'],
            default: 'daily'
        },
        targetDaysPerWeek: { type: Number, default: 7 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        completedDates: [{ type: Date }],
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const PlannerHabit: Model<IPlannerHabit> = mongoose.models.PlannerHabit || mongoose.model<IPlannerHabit>('PlannerHabit', PlannerHabitSchema);

export default PlannerHabit;
