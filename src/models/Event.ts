import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    category: string;
    tags: string[];
    coverImageUrl?: string;

    // Scheduling
    startDate: Date;
    endDate: Date;
    isRecurring: boolean;
    recurrencePattern?: 'daily' | 'weekly' | 'monthly';

    // Access & Pricing
    accessType: 'public' | 'members_only' | 'paid';
    price?: number;
    capacity?: number;

    // Location
    locationType: 'virtual' | 'in_person' | 'hybrid';
    virtualLink?: string;
    address?: string;

    // Content
    recordingUrl?: string;
    resources: { title: string; url: string }[];

    organizer: mongoose.Types.ObjectId;
    attendees: mongoose.Types.ObjectId[]; // Simple array for quick count, use Registration model for details
    status: 'draft' | 'published' | 'cancelled' | 'completed';

    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        tags: [{ type: String }],
        coverImageUrl: { type: String },

        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isRecurring: { type: Boolean, default: false },
        recurrencePattern: { type: String, enum: ['daily', 'weekly', 'monthly'] },

        accessType: { type: String, enum: ['public', 'members_only', 'paid'], default: 'members_only' },
        price: { type: Number },
        capacity: { type: Number },

        locationType: { type: String, enum: ['virtual', 'in_person', 'hybrid'], default: 'virtual' },
        virtualLink: { type: String },
        address: { type: String },

        recordingUrl: { type: String },
        resources: [{ title: String, url: String }],

        organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        status: { type: String, enum: ['draft', 'published', 'cancelled', 'completed'], default: 'draft' },
    },
    { timestamps: true }
);

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
