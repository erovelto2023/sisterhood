'use server';

import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import BlogCategory from '@/models/BlogCategory';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

// Category Actions

export async function getCategories() {
    await dbConnect();
    const categories = await BlogCategory.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export async function createCategory(name: string, description?: string) {
    await dbConnect();
    const slug = slugify(name, { lower: true, strict: true });
    const category = await BlogCategory.create({ name, slug, description });
    revalidatePath('/admin/blog/categories');
    return JSON.parse(JSON.stringify(category));
}

export async function deleteCategory(id: string) {
    await dbConnect();
    await BlogCategory.findByIdAndDelete(id);
    revalidatePath('/admin/blog/categories');
}

// Post Actions

export async function getPosts({
    status,
    category,
    tag,
    limit = 10,
    page = 1,
    search
}: {
    status?: string;
    category?: string;
    tag?: string;
    limit?: number;
    page?: number;
    search?: string;
} = {}) {
    await dbConnect();

    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
        query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const posts = await BlogPost.find(query)
        .populate('author', 'firstName lastName imageUrl')
        .populate('category', 'name slug')
        .sort({ publishDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await BlogPost.countDocuments(query);

    return {
        posts: JSON.parse(JSON.stringify(posts)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalPosts: total
    };
}

export async function getPostBySlug(slug: string) {
    await dbConnect();
    const post = await BlogPost.findOne({ slug })
        .populate('author', 'firstName lastName imageUrl headline')
        .populate('category', 'name slug');

    if (!post) return null;

    // Increment views (naive implementation)
    // In production, use a separate analytics collection or service to avoid write contention
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } });

    return JSON.parse(JSON.stringify(post));
}

export async function getPostById(id: string) {
    await dbConnect();
    const post = await BlogPost.findById(id);
    return JSON.parse(JSON.stringify(post));
}

export async function createPost(data: any) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    let slug = data.slug;
    if (!slug) {
        slug = slugify(data.title, { lower: true, strict: true });
    }

    // Ensure unique slug
    let uniqueSlug = slug;
    let counter = 1;
    while (await BlogPost.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const post = await BlogPost.create({
        ...data,
        slug: uniqueSlug,
        author: user._id,
        readingTime,
        publishDate: data.status === 'published' ? new Date() : undefined
    });

    if (post.category) {
        await BlogCategory.findByIdAndUpdate(post.category, { $inc: { count: 1 } });
    }

    revalidatePath('/admin/blog');
    revalidatePath('/members/apps/blog');
    return JSON.parse(JSON.stringify(post));
}

export async function updatePost(id: string, data: any) {
    await dbConnect();

    // Recalculate reading time if content changed
    if (data.content) {
        const wordCount = data.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        data.readingTime = Math.ceil(wordCount / 200);
    }

    // Handle status change to published
    if (data.status === 'published') {
        const currentPost = await BlogPost.findById(id);
        if (currentPost && currentPost.status !== 'published') {
            data.publishDate = new Date();
        }
    }

    const post = await BlogPost.findByIdAndUpdate(id, data, { new: true });

    revalidatePath('/admin/blog');
    revalidatePath('/members/apps/blog');
    if (post) revalidatePath(`/members/apps/blog/${post.slug}`);

    return JSON.parse(JSON.stringify(post));
}

export async function deletePost(id: string) {
    await dbConnect();
    const post = await BlogPost.findByIdAndDelete(id);

    if (post && post.category) {
        await BlogCategory.findByIdAndUpdate(post.category, { $inc: { count: -1 } });
    }

    revalidatePath('/admin/blog');
    revalidatePath('/members/apps/blog');
}
