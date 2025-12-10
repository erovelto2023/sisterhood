import { use } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getMemberById, getPosts, getPhotos, getFriendStatus, syncUser } from '@/lib/actions/member.actions';
import ProfileContent from '@/components/members/ProfileContent';

export default async function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const currentUser = await syncUser();

    if (!currentUser) {
        redirect('/sign-in');
    }

    let user;
    try {
        user = await getMemberById(userId);
    } catch (error) {
        console.error("Error fetching user", error);
        notFound();
    }

    if (!user) {
        notFound();
    }

    const posts = await getPosts(userId);
    const photos = await getPhotos(userId);
    const friendStatus = await getFriendStatus(currentUser._id, userId);

    return (
        <ProfileContent
            user={user}
            currentUser={currentUser}
            initialPosts={posts}
            photos={photos}
            friendStatus={friendStatus}
        />
    );
}
