'use server';

import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import Module from '@/models/Module';
import Lesson from '@/models/Lesson';
import Enrollment from '@/models/Enrollment';
import { currentUser } from '@clerk/nextjs/server';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';



import UserCertificate from '@/models/UserCertificate';

export async function getCourses(filter: any = {}) {
    await dbConnect();
    const courses = await Course.find({ status: 'published', ...filter })
        .populate('instructor', 'firstName lastName')
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(courses));
}

export async function getCourseBySlug(slug: string) {
    await dbConnect();
    const course = await Course.findOne({ slug, status: 'published' })
        .populate('instructor', 'firstName lastName');

    if (!course) return null;

    const modules = await Module.find({ course: course._id, isPublished: true }).sort({ order: 1 });
    const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
        const lessons = await Lesson.find({ module: mod._id, isPublished: true }).sort({ order: 1 });
        return { ...mod.toObject(), lessons };
    }));

    return {
        course: JSON.parse(JSON.stringify(course)),
        curriculum: JSON.parse(JSON.stringify(modulesWithLessons))
    };
}

export async function enrollInCourse(courseId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const existingEnrollment = await Enrollment.findOne({ user: user._id, course: courseId });
    if (existingEnrollment) return JSON.parse(JSON.stringify(existingEnrollment));

    const enrollment = await Enrollment.create({
        user: user._id,
        course: courseId,
        status: 'active',
        progress: 0,
    });

    // Increment enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    revalidatePath('/members/courses');
    return JSON.parse(JSON.stringify(enrollment));
}

export async function getStudentEnrollment(courseId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) return null;

    const enrollment = await Enrollment.findOne({ user: user._id, course: courseId });
    return enrollment ? JSON.parse(JSON.stringify(enrollment)) : null;
}

export async function getEnrolledCourses() {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) return [];

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) return [];

    const enrollments = await Enrollment.find({ user: user._id })
        .populate({
            path: 'course',
            populate: { path: 'instructor', select: 'firstName lastName' }
        })
        .sort({ lastAccessedAt: -1 });

    return JSON.parse(JSON.stringify(enrollments));
}

export async function markLessonComplete(lessonId: string, courseId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const enrollment = await Enrollment.findOne({ user: user._id, course: courseId });
    if (!enrollment) throw new Error('Not enrolled');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!enrollment.completedLessons.some((id: any) => id.toString() === lessonId)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        enrollment.completedLessons.push(lessonId as any);

        // Calculate progress
        const totalLessons = await Lesson.countDocuments({ course: courseId, isPublished: true });
        enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);



        if (enrollment.progress === 100) {
            enrollment.status = 'completed';
            enrollment.completedAt = new Date();

            // Issue Certificate
            // Check if course has a template
            const course = await Course.findById(courseId);
            if (course && course.certificateTemplate) {
                // Check if already issued
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const existing = await UserCertificate.findOne({ user: user._id, course: courseId });

                if (!existing) {
                    // Generate unique ID
                    const certificateId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                    await UserCertificate.create({
                        user: user._id,
                        course: courseId,
                        template: course.certificateTemplate,
                        certificateId,
                        issueDate: new Date(),
                    });
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enrollment.currentLesson = lessonId as any;
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    // --- Gamification Triggers ---
    try {
        // 1. Lesson Completion Trigger
        const { checkAndAwardBadges } = await import('@/lib/actions/badge.actions');
        await checkAndAwardBadges(user._id, 'lesson_completion', { courseId });

        if (enrollment.progress === 100) {
            // 2. Course Completion Trigger
            await checkAndAwardBadges(user._id, 'course_completion', { courseId });
        }
    } catch (error) {
        console.error('Error awarding badges:', error);
        // Don't fail the request just because badges failed
    }

    revalidatePath(`/members/courses`);
    return JSON.parse(JSON.stringify(enrollment));
}
