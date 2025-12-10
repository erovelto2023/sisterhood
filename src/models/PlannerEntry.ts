import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlannerEntry extends Document {
    user: mongoose.Types.ObjectId;
    date: Date; // Represents the day (or start of week/month)
    type: 'daily' | 'weekly' | 'monthly';
    topPriorities: string[]; // Array of strings (or could be task IDs, but keeping simple for now)
    reflection: {
        wins?: string;
        challenges?: string;
        gratitude?: string;
        notes?: string;
    };
    mood?: number; // 1-5 scale
    energy?: number; // 1-5 scale
    createdAt: Date;
    updatedAt: Date;
}

const PlannerEntrySchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        type: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'daily'
        },
        topPriorities: [{ type: String }],
        reflection: {
            wins: { type: String },
            challenges: { type: String },
            gratitude: { type: String },
            notes: { type: String },
        },
        mood: { type: Number, min: 1, max: 5 },
        energy: { type: Number, min: 1, max: 5 },
    },
    { timestamps: true }
);

// Compound index to ensure one entry per type per date per user
PlannerEntrySchema.index({ user: 1, date: 1, type: 1 }, { unique: true });

const PlannerEntry: Model<IPlannerEntry> = mongoose.models.PlannerEntry || mongoose.model<IPlannerEntry>('PlannerEntry', PlannerEntrySchema);

export default PlannerEntry;
