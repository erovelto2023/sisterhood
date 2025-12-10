'use server';

import dbConnect from '@/lib/db';
import Space from '@/models/Space';
import SpaceMember from '@/models/SpaceMember';
import Post from '@/models/Post';
import User from '@/models/User';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Space Actions

export async function createSpace(data: {
    name: string;
    description: string;
    type: 'public' | 'private' | 'secret';
    icon?: string;
}) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    // Generate slug from name
    const slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const space = await Space.create({
        ...data,
        slug,
        createdBy: user._id,
        membersCount: 1, // Creator is first member
    });

    // Add creator as admin
    await SpaceMember.create({
        space: space._id,
        user: user._id,
        role: 'admin',
    });

    revalidatePath('/members/community');
    return JSON.parse(JSON.stringify(space));
}

export async function getSpaces() {
    await dbConnect();
    const spaces = await Space.find({ type: { $ne: 'secret' } }).sort({ membersCount: -1 });
    return JSON.parse(JSON.stringify(spaces));
}

export async function getAllSpaces() {
    await dbConnect();
    // Admin sees all spaces including secret ones
    const spaces = await Space.find().sort({ membersCount: -1 });
    return JSON.parse(JSON.stringify(spaces));
}

export async function getSpaceBySlug(slug: string) {
    await dbConnect();
    const space = await Space.findOne({ slug });
    return JSON.parse(JSON.stringify(space));
}

export async function updateSpace(id: string, data: any) {
    await dbConnect();
    const space = await Space.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin/community');
    revalidatePath('/members/community');
    return JSON.parse(JSON.stringify(space));
}

export async function deleteSpace(id: string) {
    await dbConnect();
    await Space.findByIdAndDelete(id);
    // Also delete memberships and posts?
    await SpaceMember.deleteMany({ space: id });
    await Post.deleteMany({ space: id });

    revalidatePath('/admin/community');
    revalidatePath('/members/community');
}

export async function joinSpace(spaceId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const space = await Space.findById(spaceId);
    if (!space) throw new Error('Space not found');

    // Check if already a member
    const existingMember = await SpaceMember.findOne({ space: spaceId, user: user._id });
    if (existingMember) return;

    await SpaceMember.create({
        space: spaceId,
        user: user._id,
        role: 'member',
    });

    // Update count
    await Space.findByIdAndUpdate(spaceId, { $inc: { membersCount: 1 } });

    // Check for badges
    const { checkAndAwardBadges } = await import('@/lib/actions/badge.actions');
    await checkAndAwardBadges(user._id.toString(), 'community_join', { spaceId });

    revalidatePath(`/members/community/${space.slug}`);
}

export async function leaveSpace(spaceId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const space = await Space.findById(spaceId);
    if (!space) throw new Error('Space not found');

    await SpaceMember.findOneAndDelete({ space: spaceId, user: user._id });

    // Update count
    await Space.findByIdAndUpdate(spaceId, { $inc: { membersCount: -1 } });

    revalidatePath(`/members/community/${space.slug}`);
}

export async function getSpaceMembership(spaceId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) return null;

    const membership = await SpaceMember.findOne({ space: spaceId, user: user._id });
    return JSON.parse(JSON.stringify(membership));
}

// Community Post Actions

export async function createCommunityPost({
    spaceId,
    content,
    title,
    type = 'post',
    tags = [],
    pollOptions = [],
}: {
    spaceId: string;
    content: string;
    title?: string;
    type?: 'post' | 'question' | 'poll' | 'announcement';
    tags?: string[];
    pollOptions?: string[];
}) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const space = await Space.findById(spaceId);
    if (!space) throw new Error('Space not found');

    // Check membership
    const membership = await SpaceMember.findOne({ space: spaceId, user: user._id });
    if (!membership) throw new Error('Must be a member to post');

    const formattedPollOptions = pollOptions.map(opt => ({ text: opt, votes: [] }));

    await Post.create({
        space: spaceId,
        author: user._id,
        content,
        title,
        type,
        tags,
        pollOptions: formattedPollOptions,
    });

    await Space.findByIdAndUpdate(spaceId, { $inc: { postsCount: 1 } });

    // Check for badges
    const { checkAndAwardBadges } = await import('@/lib/actions/badge.actions');
    await checkAndAwardBadges(user._id.toString(), 'community_post');

    revalidatePath(`/members/community/${space.slug}`);
}

export async function votePoll(postId: string, optionIndex: number) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    if (post.type !== 'poll') throw new Error('Not a poll');

    // Remove existing vote if any (single choice poll)
    post.pollOptions?.forEach((opt: any) => {
        const voteIdx = opt.votes.indexOf(user._id);
        if (voteIdx > -1) {
            opt.votes.splice(voteIdx, 1);
        }
    });

    // Add new vote
    if (post.pollOptions && post.pollOptions[optionIndex]) {
        post.pollOptions[optionIndex].votes.push(user._id);
    }
    await post.save();

    const space = await Space.findById(post.space);
    if (space) {
        revalidatePath(`/members/community/${space.slug}`);
    }
}

export async function getSpacePosts(spaceId: string) {
    await dbConnect();
    const posts = await Post.find({ space: spaceId })
        .populate('author', 'firstName lastName imageUrl')
        .populate('comments.author', 'firstName lastName imageUrl')
        .sort({ isPinned: -1, createdAt: -1 });

    return JSON.parse(JSON.stringify(posts));
}
