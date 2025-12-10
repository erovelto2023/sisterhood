'use server';

import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import Module from '@/models/Module';
import Lesson from '@/models/Lesson';
import Enrollment from '@/models/Enrollment';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

// --- Course Actions ---

export async function createCourse(data: any) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    let slug = slugify(data.title, { lower: true, strict: true });
    let count = 0;
    while (await Course.countDocuments({ slug })) {
        count++;
        slug = slugify(`${data.title}-${count}`, { lower: true, strict: true });
    }

    const course = await Course.create({
        ...data,
        slug,
        instructor: user._id,
    });

    revalidatePath('/admin/courses');
    return JSON.parse(JSON.stringify(course));
}

export async function updateCourse(id: string, data: any) {
    await dbConnect();
    const course = await Course.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin/courses');
    revalidatePath(`/admin/courses/${id}`);
    return JSON.parse(JSON.stringify(course));
}

export async function deleteCourse(id: string) {
    await dbConnect();
    // Delete associated modules and lessons
    const modules = await Module.find({ course: id });
    for (const module of modules) {
        await Lesson.deleteMany({ module: module._id });
    }
    await Module.deleteMany({ course: id });
    await Course.findByIdAndDelete(id);

    revalidatePath('/admin/courses');
}

export async function getAdminCourses() {
    await dbConnect();
    const courses = await Course.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(courses));
}

export async function getCourseById(id: string) {
    await dbConnect();
    const course = await Course.findById(id).populate('instructor', 'firstName lastName');
    return course ? JSON.parse(JSON.stringify(course)) : null;
}

// --- Module Actions ---

export async function createModule(courseId: string, title: string) {
    await dbConnect();
    const slug = slugify(title, { lower: true, strict: true });

    // Get highest order
    const lastModule = await Module.findOne({ course: courseId }).sort({ order: -1 });
    const order = lastModule ? lastModule.order + 1 : 0;

    const module = await Module.create({
        title,
        slug,
        course: courseId,
        order,
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return JSON.parse(JSON.stringify(module));
}

export async function updateModule(id: string, data: any) {
    await dbConnect();
    const module = await Module.findByIdAndUpdate(id, data, { new: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidatePath(`/admin/courses/${(module as any).course}`);
    return JSON.parse(JSON.stringify(module));
}

export async function deleteModule(id: string) {
    await dbConnect();
    const module = await Module.findById(id);
    if (!module) return;

    await Lesson.deleteMany({ module: id });
    await Module.findByIdAndDelete(id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidatePath(`/admin/courses/${(module as any).course}`);
}

export async function getCourseModules(courseId: string) {
    await dbConnect();
    const modules = await Module.find({ course: courseId }).sort({ order: 1 });

    // Populate lessons for each module
    const modulesWithLessons = await Promise.all(modules.map(async (mod) => {
        const lessons = await Lesson.find({ module: mod._id }).sort({ order: 1 });
        return { ...mod.toObject(), lessons };
    }));

    return JSON.parse(JSON.stringify(modulesWithLessons));
}

// --- Lesson Actions ---

export async function createLesson(moduleId: string, courseId: string, title: string) {
    await dbConnect();
    const slug = slugify(title, { lower: true, strict: true });

    const lastLesson = await Lesson.findOne({ module: moduleId }).sort({ order: -1 });
    const order = lastLesson ? lastLesson.order + 1 : 0;

    const lesson = await Lesson.create({
        title,
        slug,
        module: moduleId,
        course: courseId,
        order,
    });

    revalidatePath(`/admin/courses/${courseId}`);
    return JSON.parse(JSON.stringify(lesson));
}

export async function updateLesson(id: string, data: any) {
    await dbConnect();
    const lesson = await Lesson.findByIdAndUpdate(id, data, { new: true });
    if (!lesson) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidatePath(`/admin/courses/${(lesson as any).course}`);
    return JSON.parse(JSON.stringify(lesson));
}

export async function deleteLesson(id: string) {
    await dbConnect();
    const lesson = await Lesson.findById(id);
    if (!lesson) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courseId = (lesson as any).course;
    await Lesson.findByIdAndDelete(id);
    revalidatePath(`/admin/courses/${courseId}`);
}

export async function getLessonById(id: string) {
    await dbConnect();
    const lesson = await Lesson.findById(id);
    return lesson ? JSON.parse(JSON.stringify(lesson)) : null;
}

// --- Certificate Actions ---

export async function createCertificateTemplate(data: any) {
    await dbConnect();
    const CertificateTemplate = (await import('@/models/CertificateTemplate')).default;
    const template = await CertificateTemplate.create(data);
    revalidatePath('/admin/certificates');
    return JSON.parse(JSON.stringify(template));
}

export async function updateCertificateTemplate(id: string, data: any) {
    await dbConnect();
    const CertificateTemplate = (await import('@/models/CertificateTemplate')).default;
    const template = await CertificateTemplate.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin/certificates');
    return JSON.parse(JSON.stringify(template));
}

export async function deleteCertificateTemplate(id: string) {
    await dbConnect();
    const CertificateTemplate = (await import('@/models/CertificateTemplate')).default;
    await CertificateTemplate.findByIdAndDelete(id);
    revalidatePath('/admin/certificates');
}

export async function getCertificateTemplates() {
    await dbConnect();
    const CertificateTemplate = (await import('@/models/CertificateTemplate')).default;
    const templates = await CertificateTemplate.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(templates));
}

export async function getCertificateTemplateById(id: string) {
    await dbConnect();
    const CertificateTemplate = (await import('@/models/CertificateTemplate')).default;
    const template = await CertificateTemplate.findById(id);
    return template ? JSON.parse(JSON.stringify(template)) : null;
}

export async function getUserCertificates() {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) return [];

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) return [];

    const UserCertificate = (await import('@/models/UserCertificate')).default;
    const certificates = await UserCertificate.find({ user: user._id })
        .populate('course')
        .populate('template')
        .sort({ issueDate: -1 });

    return JSON.parse(JSON.stringify(certificates));
}

export async function getCertificateById(id: string) {
    await dbConnect();
    const UserCertificate = (await import('@/models/UserCertificate')).default;
    const certificate = await UserCertificate.findById(id)
        .populate('course')
        .populate('template')
        .populate('user', 'firstName lastName');

    return certificate ? JSON.parse(JSON.stringify(certificate)) : null;
}
