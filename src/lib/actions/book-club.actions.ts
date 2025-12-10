'use server';

import dbConnect from '@/lib/db';
import BookClub from '@/models/BookClub';
import BookClubMember from '@/models/BookClubMember';
import Book from '@/models/Book';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Book Club Actions

export async function createBookClub(data: any) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    // Generate slug from title
    const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const bookClub = await BookClub.create({
        ...data,
        slug,
        createdBy: user._id,
        membersCount: 1,
    }) as any;

    // Add creator as host
    await BookClubMember.create({
        bookClub: bookClub._id,
        user: user._id,
        role: 'host',
    });

    revalidatePath('/members/apps/book-club');
    return JSON.parse(JSON.stringify(bookClub));
}

export async function getBookClubs() {
    await dbConnect();
    const bookClubs = await BookClub.find({ visibility: { $ne: 'invite_only' } }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(bookClubs));
}

export async function getBookClubBySlug(slug: string) {
    await dbConnect();
    const bookClub = await BookClub.findOne({ slug });
    return JSON.parse(JSON.stringify(bookClub));
}

export async function getAllBookClubs() {
    await dbConnect();
    const bookClubs = await BookClub.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(bookClubs));
}

export async function updateBookClub(id: string, data: any) {
    await dbConnect();
    const bookClub = await BookClub.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin/book-clubs');
    revalidatePath('/members/apps/book-club');
    return JSON.parse(JSON.stringify(bookClub));
}

export async function deleteBookClub(id: string) {
    await dbConnect();
    await BookClub.findByIdAndDelete(id);
    // Delete related data
    await BookClubMember.deleteMany({ bookClub: id });
    await Book.deleteMany({ bookClub: id });

    revalidatePath('/admin/book-clubs');
    revalidatePath('/members/apps/book-club');
}

export async function joinBookClub(bookClubId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const bookClub = await BookClub.findById(bookClubId);
    if (!bookClub) throw new Error('Book Club not found');

    const existingMember = await BookClubMember.findOne({ bookClub: bookClubId, user: user._id });
    if (existingMember) return;

    await BookClubMember.create({
        bookClub: bookClubId,
        user: user._id,
        role: 'member',
    });

    await BookClub.findByIdAndUpdate(bookClubId, { $inc: { membersCount: 1 } });

    // Award badge?
    // const { checkAndAwardBadges } = await import('@/lib/actions/badge.actions');
    // await checkAndAwardBadges(user._id.toString(), 'book_club_join', { bookClubId });

    revalidatePath(`/members/apps/book-club/${bookClub.slug}`);
}

export async function getBookClubMembership(bookClubId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) return null;

    const membership = await BookClubMember.findOne({ bookClub: bookClubId, user: user._id });
    return JSON.parse(JSON.stringify(membership));
}

// Book Actions

export async function addBook(bookClubId: string, data: any) {
    await dbConnect();
    // Verify admin/host permission here...

    const book = await Book.create({
        ...data,
        bookClub: bookClubId,
    });

    await BookClub.findByIdAndUpdate(bookClubId, { $inc: { booksCount: 1 } });

    // Revalidate path
    const bookClub = await BookClub.findById(bookClubId);
    if (bookClub) {
        revalidatePath(`/members/apps/book-club/${bookClub.slug}`);
    }

    return JSON.parse(JSON.stringify(book));
}

export async function getBooks(bookClubId: string) {
    await dbConnect();
    const books = await Book.find({ bookClub: bookClubId }).sort({ order: 1 });
    return JSON.parse(JSON.stringify(books));
}

export async function updateBook(id: string, data: any) {
    await dbConnect();
    const book = await Book.findByIdAndUpdate(id, data, { new: true });

    if (book) {
        const bookClub = await BookClub.findById(book.bookClub);
        if (bookClub) {
            revalidatePath(`/members/apps/book-club/${bookClub.slug}`);
        }
    }
    return JSON.parse(JSON.stringify(book));
}

export async function deleteBook(id: string) {
    await dbConnect();
    const book = await Book.findByIdAndDelete(id);

    if (book) {
        await BookClub.findByIdAndUpdate(book.bookClub, { $inc: { booksCount: -1 } });
        const bookClub = await BookClub.findById(book.bookClub);
        if (bookClub) {
            revalidatePath(`/members/apps/book-club/${bookClub.slug}`);
        }
    }
}

export async function getBookClubMembers(bookClubId: string) {
    await dbConnect();
    const members = await BookClubMember.find({ bookClub: bookClubId })
        .populate('user', 'firstName lastName imageUrl headline')
        .sort({ joinedAt: -1 });
    return JSON.parse(JSON.stringify(members));
}

// Discussion Actions

export async function createBookClubPost({
    bookClubId,
    content,
    title,
}: {
    bookClubId: string;
    content: string;
    title?: string;
}) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    // Check membership
    const membership = await BookClubMember.findOne({ bookClub: bookClubId, user: user._id });
    if (!membership) throw new Error('Must be a member to post');

    const post = await (await import('@/models/Post')).default.create({
        bookClub: bookClubId,
        author: user._id,
        content,
        title,
        type: 'post',
    });

    const bookClub = await BookClub.findById(bookClubId);
    if (bookClub) {
        revalidatePath(`/members/apps/book-club/${bookClub.slug}`);
    }

    return JSON.parse(JSON.stringify(post));
}

export async function getBookClubPosts(bookClubId: string) {
    await dbConnect();
    const posts = await (await import('@/models/Post')).default.find({ bookClub: bookClubId })
        .populate('author', 'firstName lastName imageUrl')
        .populate('comments.author', 'firstName lastName imageUrl')
        .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(posts));
}
