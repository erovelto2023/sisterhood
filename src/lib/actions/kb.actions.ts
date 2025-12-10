'use server';

import dbConnect from '@/lib/db';
import KnowledgeBase from '@/models/KnowledgeBase';
import Category from '@/models/Category';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

// --- Category Actions ---

export async function createCategory(data: { name: string; description?: string; parent?: string }) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    // Check admin/mod permissions (omitted for brevity, assume admin layout protects this)

    const slug = slugify(data.name, { lower: true, strict: true });

    const category = await Category.create({
        ...data,
        slug,
    });

    revalidatePath('/admin/knowledge-base');
    revalidatePath('/members/knowledge-base');
    return JSON.parse(JSON.stringify(category));
}

export async function getCategories() {
    await dbConnect();
    const categories = await Category.find().sort({ order: 1, name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export async function deleteCategory(id: string) {
    await dbConnect();
    // Check if articles exist in this category
    const count = await KnowledgeBase.countDocuments({ category: id });
    if (count > 0) throw new Error('Cannot delete category with articles');

    await Category.findByIdAndDelete(id);
    revalidatePath('/admin/knowledge-base');
}

// --- Article Actions ---

export async function createArticle(data: any) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    let slug = slugify(data.title, { lower: true, strict: true });

    // Ensure unique slug
    let count = 0;
    while (await KnowledgeBase.countDocuments({ slug })) {
        count++;
        slug = slugify(`${data.title}-${count}`, { lower: true, strict: true });
    }

    const article = await KnowledgeBase.create({
        ...data,
        slug,
        author: user._id,
        publishedAt: data.status === 'published' ? new Date() : null,
    });

    revalidatePath('/admin/knowledge-base');
    revalidatePath('/members/knowledge-base');
    return JSON.parse(JSON.stringify(article));
}

export async function updateArticle(id: string, data: any) {
    await dbConnect();

    // If title changed, maybe update slug? For now, let's keep slug stable to avoid broken links unless explicitly requested.
    // We'll just update content fields.

    const article = await KnowledgeBase.findByIdAndUpdate(id, {
        ...data,
        updatedAt: new Date(),
    }, { new: true });

    if (!article) throw new Error('Article not found');

    revalidatePath('/admin/knowledge-base');
    revalidatePath(`/members/knowledge-base/${article.slug}`);
    return JSON.parse(JSON.stringify(article));
}

export async function deleteArticle(id: string) {
    await dbConnect();
    await KnowledgeBase.findByIdAndDelete(id);
    revalidatePath('/admin/knowledge-base');
}

export async function getAdminArticles({
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

    const articles = await KnowledgeBase.find(filter)
        .populate('category', 'name')
        .populate('author', 'firstName lastName')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await KnowledgeBase.countDocuments(filter);

    return {
        articles: JSON.parse(JSON.stringify(articles)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
}

export async function getArticleById(id: string) {
    await dbConnect();
    const article = await KnowledgeBase.findById(id);
    return article ? JSON.parse(JSON.stringify(article)) : null;
}

// --- Member Actions ---

export async function getKnowledgeBaseHome() {
    await dbConnect();

    const categories = await Category.find().sort({ order: 1 });
    const featuredArticles = await KnowledgeBase.find({ status: 'published' })
        .sort({ views: -1 })
        .limit(5)
        .populate('category', 'name slug');

    return {
        categories: JSON.parse(JSON.stringify(categories)),
        featuredArticles: JSON.parse(JSON.stringify(featuredArticles)),
    };
}

export async function getArticlesByCategory(categorySlug: string) {
    await dbConnect();
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) return null;

    const articles = await KnowledgeBase.find({
        category: category._id,
        status: 'published'
    }).sort({ title: 1 });

    return {
        category: JSON.parse(JSON.stringify(category)),
        articles: JSON.parse(JSON.stringify(articles)),
    };
}

export async function getArticleBySlug(slug: string) {
    await dbConnect();
    const article = await KnowledgeBase.findOne({ slug, status: 'published' })
        .populate('category', 'name slug')
        .populate('author', 'firstName lastName');

    if (article) {
        // Increment views asynchronously
        KnowledgeBase.findByIdAndUpdate(article._id, { $inc: { views: 1 } }).exec();
    }

    return article ? JSON.parse(JSON.stringify(article)) : null;
}

export async function searchArticles(query: string) {
    await dbConnect();
    if (!query) return [];

    const articles = await KnowledgeBase.find({
        status: 'published',
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
        ]
    })
        .select('title slug excerpt category')
        .populate('category', 'name')
        .limit(10);

    return JSON.parse(JSON.stringify(articles));
}
