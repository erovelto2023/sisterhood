'use server';

import dbConnect from '@/lib/db';
import User, { IUser } from '@/models/User';
import Post from '@/models/Post';
import FriendRequest from '@/models/FriendRequest';
import Photo from '@/models/Photo';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';

// User Actions

export async function syncUser() {
    await dbConnect();
    const clerkUser = await currentUser();

    if (!clerkUser) return null;

    const user = await User.findOneAndUpdate(
        { clerkId: clerkUser.id },
        {
            clerkId: clerkUser.id,
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            imageUrl: clerkUser.imageUrl,
        },
        { upsert: true, new: true }
    );

    return JSON.parse(JSON.stringify(user));
}

export async function getMemberByClerkId(clerkId: string) {
    await dbConnect();
    const user = await User.findOne({ clerkId });
    return JSON.parse(JSON.stringify(user));
}

export async function getMemberById(id: string) {
    await dbConnect();
    const user = await User.findById(id).populate('friends', 'firstName lastName imageUrl');
    return JSON.parse(JSON.stringify(user));
}

export async function searchMembers({
    query,
    page = 1,
    limit = 10,
}: {
    query?: string;
    page?: number;
    limit?: number;
}) {
    await dbConnect();
    const skip = (page - 1) * limit;

    const searchFilter = query
        ? {
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
            ],
        }
        : {};

    const members = await User.find(searchFilter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(searchFilter);

    return {
        members: JSON.parse(JSON.stringify(members)),
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
}

export async function updateUser(userId: string, data: { bio?: string; firstName?: string; lastName?: string }) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.clerkId !== clerkUser.id) throw new Error('Unauthorized');

    if (data.bio !== undefined) user.bio = data.bio;
    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;

    await user.save();
    revalidatePath(`/members/${userId}`);
}

// Friend Actions

export async function sendFriendRequest(receiverId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const sender = await User.findOne({ clerkId: clerkUser.id });
    if (!sender) throw new Error('User not found');

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
        sender: sender._id,
        receiver: receiverId,
    });

    if (existingRequest) throw new Error('Request already sent');

    await FriendRequest.create({
        sender: sender._id,
        receiver: receiverId,
    });

    revalidatePath('/members');
}

export async function getFriendStatus(currentUserId: string, targetUserId: string) {
    await dbConnect();
    // Check if friends
    const user = await User.findById(currentUserId);
    if (!user) return 'none';
    if (user.friends.some((friendId: any) => friendId.toString() === targetUserId)) return 'friends';

    // Check if request sent
    const sentRequest = await FriendRequest.findOne({ sender: currentUserId, receiver: targetUserId, status: 'pending' });
    if (sentRequest) return 'request_sent';

    // Check if request received
    const receivedRequest = await FriendRequest.findOne({ sender: targetUserId, receiver: currentUserId, status: 'pending' });
    if (receivedRequest) return 'request_received';

    return 'none';
}

export async function getFriendRequests(userId: string) {
    await dbConnect();
    const requests = await FriendRequest.find({ receiver: userId, status: 'pending' })
        .populate('sender', 'firstName lastName imageUrl')
        .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(requests));
}

export async function acceptFriendRequest(requestId: string) {
    await dbConnect();
    const request = await FriendRequest.findById(requestId);
    if (!request) throw new Error('Request not found');

    if (request.status !== 'pending') throw new Error('Request already processed');

    request.status = 'accepted';
    await request.save();

    // Add to friends lists
    await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
    await User.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });

    revalidatePath('/members/friends');
    revalidatePath(`/members/${request.sender}`);
    revalidatePath(`/members/${request.receiver}`);
    revalidatePath(`/members/${request.receiver}`);
}

export async function rejectFriendRequest(requestId: string) {
    await dbConnect();
    const request = await FriendRequest.findById(requestId);
    if (!request) throw new Error('Request not found');

    if (request.status !== 'pending') throw new Error('Request already processed');

    request.status = 'rejected';
    await request.save();

    revalidatePath('/members/friends');
}

export async function removeFriend(friendId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    // Remove from both users' friend lists
    await User.findByIdAndUpdate(user._id, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: user._id } });

    // Also remove any accepted friend request to allow re-adding
    await FriendRequest.deleteMany({
        $or: [
            { sender: user._id, receiver: friendId },
            { sender: friendId, receiver: user._id }
        ]
    });

    revalidatePath('/members/friends');
    revalidatePath(`/members/${user._id}`);
    revalidatePath(`/members/${friendId}`);
}


// Post Actions

export async function createPost({
    content,
    imageUrl,
    recipientId,
}: {
    content: string;
    imageUrl?: string;
    recipientId?: string; // If posting on someone else's wall
}) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const author = await User.findOne({ clerkId: clerkUser.id });
    if (!author) throw new Error('User not found');

    await Post.create({
        content,
        imageUrl,
        author: author._id,
        recipient: recipientId || author._id, // Default to own wall if no recipient
    });

    revalidatePath(`/members/${recipientId || author._id}`);
}

export async function deletePost(postId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');

    // Allow deletion if author or if it's on their wall (recipient)
    if (post.author.toString() !== user._id.toString() && post.recipient?.toString() !== user._id.toString()) {
        throw new Error('Unauthorized');
    }

    await Post.findByIdAndDelete(postId);
    revalidatePath(`/members/${post.recipient}`);
}

export async function addComment(postId: string, content: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');

    post.comments.push({
        author: user._id,
        content,
        createdAt: new Date(),
    });

    await post.save();
    revalidatePath(`/members/${post.recipient}`);
}

export async function toggleLike(postId: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');

    const likeIndex = post.likes.indexOf(user._id);
    if (likeIndex === -1) {
        post.likes.push(user._id);
    } else {
        post.likes.splice(likeIndex, 1);
    }

    await post.save();
    revalidatePath(`/members/${post.recipient}`);
}

export async function getPosts(userId: string) {
    await dbConnect();
    const posts = await Post.find({
        $or: [{ recipient: userId }, { author: userId, recipient: null }], // Get posts on their wall or their own status updates
    })
        .populate('author', 'firstName lastName imageUrl')
        .populate('comments.author', 'firstName lastName imageUrl')
        .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(posts));
}

export async function addPhoto(url: string) {
    await dbConnect();
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error('Unauthorized');

    const user = await User.findOne({ clerkId: clerkUser.id });
    if (!user) throw new Error('User not found');

    await Photo.create({
        url,
        user: user._id,
    });

    revalidatePath(`/members/${user._id}`);
}

export async function getPhotos(userId: string) {
    await dbConnect();
    const photos = await Photo.find({ user: userId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(photos));
}
