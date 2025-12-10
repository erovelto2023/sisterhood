import { getFriendRequests, syncUser, getMemberById } from '@/lib/actions/member.actions';
import FriendRequestsList from '@/components/members/FriendRequestsList';
import FriendsList from '@/components/members/FriendsList';
import { redirect } from 'next/navigation';

export default async function FriendsPage() {
    const currentUser = await syncUser();
    if (!currentUser) redirect('/sign-in');

    const requests = await getFriendRequests(currentUser._id);
    const userWithFriends = await getMemberById(currentUser._id);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Friend Requests</h2>
                <FriendRequestsList requests={requests} />
            </section>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Friends</h2>
                <FriendsList friends={userWithFriends.friends} isOwnProfile={true} />
            </section>
        </div>
    );
}
