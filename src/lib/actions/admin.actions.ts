'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import Event from '@/models/Event';
import MarketplaceStore from '@/models/MarketplaceStore';
import MarketplaceListing from '@/models/MarketplaceListing';
import Space from '@/models/Space';
import BlogPost from '@/models/BlogPost';
import BookClub from '@/models/BookClub';
import KnowledgeBase from '@/models/KnowledgeBase';
import { revalidatePath } from 'next/cache';

export async function getUsers({
    page = 1,
    limit = 10,
    query = '',
}: {
    page?: number;
    limit?: number;
    query?: string;
}) {
    await dbConnect();
    const skip = (page - 1) * limit;

    const filter = query
        ? {
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ],
        }
        : {};

    const users = await User.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    return {
        users: JSON.parse(JSON.stringify(users)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalUsers: total,
    };
}

export async function updateUserStatus(userId: string, status: 'active' | 'suspended') {
    await dbConnect();
    await User.findByIdAndUpdate(userId, { status });
    revalidatePath('/admin/users');
}

export async function updateUserRole(userId: string, role: 'admin' | 'moderator' | 'member') {
    await dbConnect();
    await User.findByIdAndUpdate(userId, { role });
    revalidatePath('/admin/users');
}

export async function deleteUser(userId: string) {
    await dbConnect();
    await User.findByIdAndDelete(userId);
    revalidatePath('/admin/users');
}

export async function getAdminDashboardStats() {
    await dbConnect();

    const [
        users,
        courses,
        events,
        stores,
        listings,
        communities,
        blogPosts,
        bookClubs,
        kbArticles
    ] = await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Event.countDocuments(),
        MarketplaceStore.countDocuments(),
        MarketplaceListing.countDocuments(),
        Space.countDocuments(),
        BlogPost.countDocuments(),
        BookClub.countDocuments(),
        KnowledgeBase.countDocuments()
    ]);

    return {
        users,
        courses,
        events,
        stores,
        listings,
        communities,
        blogPosts,
        bookClubs,
        kbArticles
    };
}
