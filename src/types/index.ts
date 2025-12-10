export interface User {
    _id: string;
    clerkId: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    bio?: string;
    createdAt: string;
}

export interface Comment {
    author: User;
    content: string;
    createdAt: string;
}

export interface Post {
    _id: string;
    content: string;
    imageUrl?: string;
    author: User;
    recipient: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
}

export interface Photo {
    _id: string;
    url: string;
    user: string;
    createdAt: string;
}

export interface FriendRequest {
    _id: string;
    sender: User;
    receiver: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}
