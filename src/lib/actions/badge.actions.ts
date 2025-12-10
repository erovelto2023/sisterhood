'use server';

import dbConnect from '@/lib/db';
import Badge from '@/models/Badge';
import BadgeCategory from '@/models/BadgeCategory';
import UserBadge from '@/models/UserBadge';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import Post from '@/models/Post'; // Assuming this exists
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

// --- Category Actions ---

export async function createBadgeCategory(name: string, description?: string) {
    await dbConnect();
    const slug = slugify(name, { lower: true, strict: true });
    const category = await BadgeCategory.create({ name, slug, description });
    revalidatePath('/admin/badges/categories');
    return JSON.parse(JSON.stringify(category));
}

export async function getBadgeCategories() {
    await dbConnect();
    const categories = await BadgeCategory.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export async function deleteBadgeCategory(id: string) {
    await dbConnect();
    await BadgeCategory.findByIdAndDelete(id);
    revalidatePath('/admin/badges/categories');
}

// --- Badge Management Actions ---

export async function createBadge(data: any) {
    await dbConnect();
    const badge = await Badge.create(data);
    revalidatePath('/admin/badges');
    return JSON.parse(JSON.stringify(badge));
}

export async function updateBadge(id: string, data: any) {
    await dbConnect();
    const badge = await Badge.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin/badges');
    return JSON.parse(JSON.stringify(badge));
}

export async function deleteBadge(id: string) {
    await dbConnect();
    await Badge.findByIdAndDelete(id);
    revalidatePath('/admin/badges');
}

export async function getBadges() {
    await dbConnect();
    const badges = await Badge.find().populate('category').sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(badges));
}

export async function getBadgeById(id: string) {
    await dbConnect();
    const badge = await Badge.findById(id).populate('category');
    return badge ? JSON.parse(JSON.stringify(badge)) : null;
}

// --- User Badge Actions ---

export async function getUserBadges(userId?: string) {
    await dbConnect();
    let targetUserId = userId;

    if (!targetUserId) {
        const clerkUser = await currentUser();
        if (!clerkUser) return [];
        const user = await User.findOne({ clerkId: clerkUser.id });
        if (!user) return [];
        targetUserId = user._id.toString();
    }

    const userBadges = await UserBadge.find({ user: targetUserId })
        .populate({
            path: 'badge',
            populate: { path: 'category' }
        })
        .sort({ awardedAt: -1 });

    return JSON.parse(JSON.stringify(userBadges));
}

// --- The Gamification Engine ---

export async function checkAndAwardBadges(userId: string, triggerType: string, contextData: any = {}) {
    await dbConnect();
    console.log(`Checking badges for user ${userId} with trigger ${triggerType}`);

    // 1. Find all potential badges for this trigger
    const potentialBadges = await Badge.find({ triggerType, isHidden: false });

    const newBadges = [];

    for (const badge of potentialBadges) {
        // Check if user already has this badge
        const existing = await UserBadge.findOne({ user: userId, badge: badge._id });
        if (existing) continue;

        let isEligible = false;

        // 2. Evaluate Criteria based on trigger type
        switch (triggerType) {
            case 'course_completion':
                // Check if specific course required
                if (badge.specificEntityId) {
                    if (contextData.courseId === badge.specificEntityId) {
                        isEligible = true;
                    }
                } else {
                    // Check total courses completed
                    const completedCount = await Enrollment.countDocuments({
                        user: userId,
                        status: 'completed'
                    });
                    if (completedCount >= badge.requirementCount) {
                        isEligible = true;
                    }
                }
                break;

            case 'lesson_completion':
                // This might be expensive to calc every time, but for now:
                // We need to count total completed lessons across all enrollments? 
                // Or just check if they completed X lessons in THIS course?
                // Let's assume "Total Lessons Completed Platform-wide" for now.
                // This requires aggregating completedLessons arrays from Enrollments.
                const enrollments = await Enrollment.find({ user: userId });
                let totalLessons = 0;
                enrollments.forEach((en: any) => {
                    totalLessons += en.completedLessons.length;
                });

                if (totalLessons >= badge.requirementCount) {
                    isEligible = true;
                }
                break;

            case 'community_post':
                const postCount = await Post.countDocuments({ author: userId });
                if (postCount >= badge.requirementCount) {
                    isEligible = true;
                }
                break;

            case 'community_join':
                // Check if user joined a specific space or total spaces
                if (badge.specificEntityId) {
                    if (contextData.spaceId === badge.specificEntityId) {
                        isEligible = true;
                    }
                } else {
                    // This would require counting SpaceMember documents for this user
                    // We need to import SpaceMember dynamically or move it to top if not circular
                    const SpaceMember = (await import('@/models/SpaceMember')).default;
                    const spaceCount = await SpaceMember.countDocuments({ user: userId });
                    if (spaceCount >= badge.requirementCount) {
                        isEligible = true;
                    }
                }
                break;

            // Add more cases here
        }

        if (isEligible) {
            await UserBadge.create({
                user: userId,
                badge: badge._id,
                awardedAt: new Date(),
                isSeen: false
            });
            newBadges.push(badge);
        }
    }

    return newBadges; // Return newly awarded badges for UI notification
}
