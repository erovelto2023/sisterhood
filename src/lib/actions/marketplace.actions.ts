'use server';

import dbConnect from '@/lib/db';
import MarketplaceListing from '@/models/MarketplaceListing';
import MarketplaceCategory from '@/models/MarketplaceCategory';
import MarketplaceStore from '@/models/MarketplaceStore';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { createNotification } from './notification.actions';

// Category Actions

export async function getMarketplaceCategories() {
    await dbConnect();
    const categories = await MarketplaceCategory.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export async function createMarketplaceCategory(name: string, description?: string, icon?: string) {
    await dbConnect();
    const slug = slugify(name, { lower: true, strict: true });
    const category = await MarketplaceCategory.create({ name, slug, description, icon });
    revalidatePath('/members/listings');
    return JSON.parse(JSON.stringify(category));
}

export async function deleteMarketplaceCategory(id: string) {
    await dbConnect();
    await MarketplaceCategory.findByIdAndDelete(id);
    revalidatePath('/members/listings');
    revalidatePath('/admin/store');
}

// Store Actions

export async function getMyStore() {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) return null;

    let store = await MarketplaceStore.findOne({ user: user._id });

    if (!store) {
        // Auto-create store for user
        const slug = slugify(`${user.firstName}-${user.lastName}-${Date.now().toString().slice(-4)}`, { lower: true, strict: true });
        store = await MarketplaceStore.create({
            user: user._id,
            name: `${user.firstName}'s Store`,
            slug,
            bio: `Welcome to my store!`,
        });
    }

    return JSON.parse(JSON.stringify(store));
}

export async function getStoreBySlug(slug: string) {
    await dbConnect();
    const store = await MarketplaceStore.findOne({ slug }).populate('user', 'firstName lastName imageUrl headline');
    return JSON.parse(JSON.stringify(store));
}

export async function updateStore(id: string, data: any) {
    await dbConnect();
    const store = await MarketplaceStore.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/members/listings');
    return JSON.parse(JSON.stringify(store));
}

// Listing Actions

export async function getListings({
    category,
    mode,
    type,
    search,
    limit = 20,
    page = 1,
    status = 'active'
}: {
    category?: string;
    mode?: string;
    type?: string;
    search?: string;
    limit?: number;
    page?: number;
    status?: string;
} = {}) {
    await dbConnect();

    const query: any = { status };

    if (category) query.category = category;
    if (mode) query.mode = mode;
    if (type) query.type = type;
    if (search) {
        query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const listings = await MarketplaceListing.find(query)
        .populate('seller', 'firstName lastName imageUrl')
        .populate('category', 'name icon')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await MarketplaceListing.countDocuments(query);

    return {
        listings: JSON.parse(JSON.stringify(listings)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalListings: total
    };
}

export async function getListingBySlug(slug: string) {
    await dbConnect();
    const listing = await MarketplaceListing.findOne({ slug })
        .populate('seller', 'firstName lastName imageUrl headline')
        .populate('store', 'name slug rating reviewCount')
        .populate('category', 'name slug');

    if (listing) {
        // Increment views
        await MarketplaceListing.findByIdAndUpdate(listing._id, { $inc: { views: 1 } });
    }

    return JSON.parse(JSON.stringify(listing));
}

export async function createListing(data: any) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const store = await MarketplaceStore.findOne({ user: user._id });
    if (!store) throw new Error('Store not found');

    let slug = slugify(data.title, { lower: true, strict: true });

    // Ensure unique slug
    let uniqueSlug = slug;
    let counter = 1;
    while (await MarketplaceListing.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    const listing = await MarketplaceListing.create({
        ...data,
        slug: uniqueSlug,
        seller: user._id,
        store: store._id,
        status: 'active', // Auto-approve for MVP, change to 'pending' for strict moderation
    });

    // Update category count
    await MarketplaceCategory.findByIdAndUpdate(data.category, { $inc: { count: 1 } });

    revalidatePath('/members/listings');
    return JSON.parse(JSON.stringify(listing));
}

export async function getStoreListings(storeId: string) {
    await dbConnect();
    const listings = await MarketplaceListing.find({ store: storeId, status: 'active' })
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(listings));
}

export async function createListingConversation(listingId: string, content: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const sender = await User.findOne({ clerkId: clerkUser.id });
    if (!sender) throw new Error('User not found');

    const listing = await MarketplaceListing.findById(listingId).populate('seller');
    if (!listing) throw new Error('Listing not found');

    if (listing.seller._id.toString() === sender._id.toString()) {
        throw new Error('Cannot message yourself');
    }

    // Check if conversation already exists for this listing
    let conversation = await Conversation.findOne({
        participants: { $all: [sender._id, listing.seller._id], $size: 2 },
        'context.type': 'marketplace_listing',
        'context.id': listingId
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [sender._id, listing.seller._id],
            unreadCounts: { [sender._id.toString()]: 0, [listing.seller._id.toString()]: 0 },
            isGroup: false,
            context: {
                type: 'marketplace_listing',
                id: listingId
            }
        });
    }

    // Create Message
    const message = await Message.create({
        conversationId: conversation._id,
        senderId: sender._id,
        content,
        readBy: [{ userId: sender._id, readAt: new Date() }],
    });

    // Update Conversation
    const recipientId = listing.seller._id.toString();
    const newUnreadCounts = conversation.unreadCounts || new Map();
    const currentUnread = newUnreadCounts.get(recipientId) || 0;
    newUnreadCounts.set(recipientId, currentUnread + 1);

    await Conversation.findByIdAndUpdate(conversation._id, {
        lastMessage: {
            content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
            senderId: sender._id,
            createdAt: new Date(),
        },
        unreadCounts: newUnreadCounts,
        updatedAt: new Date(),
    });

    // Notification
    await createNotification({
        recipientId: recipientId,
        type: 'message',
        title: `New inquiry about ${listing.title}`,
        message: content.substring(0, 100),
        data: { conversationId: conversation._id.toString(), messageId: message._id.toString() },
    });

    return JSON.parse(JSON.stringify(conversation));
}

// Admin Actions

export async function getMarketplaceStats() {
    await dbConnect();
    const totalListings = await MarketplaceListing.countDocuments();
    const pendingListings = await MarketplaceListing.countDocuments({ status: 'pending' });
    const activeListings = await MarketplaceListing.countDocuments({ status: 'active' });
    const totalStores = await MarketplaceStore.countDocuments();

    return {
        totalListings,
        pendingListings,
        activeListings,
        totalStores
    };
}

export async function getPendingListings() {
    await dbConnect();
    const listings = await MarketplaceListing.find({ status: 'pending' })
        .populate('seller', 'firstName lastName imageUrl')
        .populate('category', 'name')
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(listings));
}

export async function approveListing(listingId: string) {
    await dbConnect();
    await MarketplaceListing.findByIdAndUpdate(listingId, { status: 'active' });
    revalidatePath('/admin/store');
    revalidatePath('/members/listings');
}

export async function rejectListing(listingId: string, reason: string) {
    await dbConnect();
    await MarketplaceListing.findByIdAndUpdate(listingId, {
        status: 'suspended',
        moderationNotes: reason
    });
    revalidatePath('/admin/store');
}
