'use server';

import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Admin Actions

export async function createEvent(data: any) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    // Basic permission check (can be refined)
    if (user.role !== 'admin' && user.role !== 'moderator') {
        throw new Error('Unauthorized: Insufficient permissions');
    }

    const newEvent = await Event.create({
        ...data,
        organizer: user._id,
    });

    revalidatePath('/admin/events');
    revalidatePath('/members/events');
    return JSON.parse(JSON.stringify(newEvent));
}

export async function updateEvent(eventId: string, data: any) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
        throw new Error('Unauthorized');
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, data, { new: true });

    revalidatePath('/admin/events');
    revalidatePath(`/admin/events/${eventId}`);
    revalidatePath('/members/events');
    revalidatePath(`/members/events/${eventId}`);

    return JSON.parse(JSON.stringify(updatedEvent));
}

export async function deleteEvent(eventId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
        throw new Error('Unauthorized');
    }

    await Event.findByIdAndDelete(eventId);

    revalidatePath('/admin/events');
    revalidatePath('/members/events');
}

export async function getAdminEvents({
    page = 1,
    limit = 10,
    query = '',
    status = '',
}: {
    page?: number;
    limit?: number;
    query?: string;
    status?: string;
}) {
    await dbConnect();
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query) {
        filter.title = { $regex: query, $options: 'i' };
    }
    if (status) {
        filter.status = status;
    }

    const events = await Event.find(filter)
        .populate('organizer', 'firstName lastName')
        .sort({ startDate: 1 }) // Closest upcoming first
        .skip(skip)
        .limit(limit);

    const total = await Event.countDocuments(filter);

    return {
        events: JSON.parse(JSON.stringify(events)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalEvents: total,
    };
}

export async function getEventById(eventId: string) {
    await dbConnect();
    const event = await Event.findById(eventId).populate('organizer', 'firstName lastName imageUrl');
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
}

// User Actions (Basic for now)

export async function getUpcomingEvents({
    limit = 6,
}: {
    limit?: number;
}) {
    await dbConnect();
    const now = new Date();

    const events = await Event.find({
        status: 'published',
        startDate: { $gte: now },
    })
        .sort({ startDate: 1 })
        .limit(limit);

    return JSON.parse(JSON.stringify(events));
}

export async function getAllUpcomingEvents({
    query = '',
    category = '',
    page = 1,
    limit = 12,
}: {
    query?: string;
    category?: string;
    page?: number;
    limit?: number;
}) {
    await dbConnect();
    const now = new Date();
    const skip = (page - 1) * limit;

    const filter: any = {
        status: 'published',
        startDate: { $gte: now },
    };

    if (query) {
        filter.title = { $regex: query, $options: 'i' };
    }
    if (category) {
        filter.category = category;
    }

    const events = await Event.find(filter)
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit);

    const total = await Event.countDocuments(filter);

    return {
        events: JSON.parse(JSON.stringify(events)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
}

import Registration from '@/models/Registration';

export async function registerForEvent(eventId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');

    // Check capacity
    if (event.capacity && event.capacity > 0) {
        const registrationCount = await Registration.countDocuments({ event: eventId, status: 'registered' });
        if (registrationCount >= event.capacity) {
            throw new Error('Event is full');
        }
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({ event: eventId, user: user._id });
    if (existingRegistration) {
        if (existingRegistration.status === 'cancelled') {
            // Re-register
            existingRegistration.status = 'registered';
            await existingRegistration.save();
        } else {
            throw new Error('Already registered');
        }
    } else {
        await Registration.create({
            event: eventId,
            user: user._id,
            status: 'registered',
            paymentStatus: event.price && event.price > 0 ? 'pending' : 'free', // Simplified for now
        });
    }

    // Update event attendees count (simple array)
    await Event.findByIdAndUpdate(eventId, { $addToSet: { attendees: user._id } });

    revalidatePath(`/members/events/${eventId}`);
    revalidatePath('/members/dashboard');
}

export async function cancelRegistration(eventId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const registration = await Registration.findOne({ event: eventId, user: user._id });
    if (!registration) throw new Error('Not registered');

    registration.status = 'cancelled';
    await registration.save();

    // Update event attendees count
    await Event.findByIdAndUpdate(eventId, { $pull: { attendees: user._id } });

    revalidatePath(`/members/events/${eventId}`);
    revalidatePath('/members/dashboard');
}

export async function getUserRegistrationStatus(eventId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) return null;

    const registration = await Registration.findOne({ event: eventId, user: user._id });
    return registration ? JSON.parse(JSON.stringify(registration)) : null;
}

export async function getMonthEvents(year: number, month: number) {
    await dbConnect();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const events = await Event.find({
        status: 'published',
        startDate: { $gte: start, $lte: end },
    }).select('title startDate endDate category');

    return JSON.parse(JSON.stringify(events));
}
