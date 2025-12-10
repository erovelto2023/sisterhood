import PostInput from './PostInput';
import PostCard from './PostCard';
import { User, Post } from '@/types';

interface ActivityFeedProps {
    currentUser: User;
    profileUserId: string;
    posts: Post[];
    canPost: boolean;
}

export default function ActivityFeed({ currentUser, profileUserId, posts, canPost }: ActivityFeedProps) {
    return (
        <div>
            {canPost && <PostInput currentUser={currentUser} recipientId={profileUserId} />}
            <div className="space-y-4">
                {posts.length > 0 ? (
                    posts.map((post) => <PostCard key={post._id} post={post} currentUser={currentUser} />)
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                        <p className="text-gray-500">No activity yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
