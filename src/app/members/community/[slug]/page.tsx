import { getSpaceBySlug, getSpaceMembership, getSpacePosts } from '@/lib/actions/community.actions';
import SpaceHeader from '@/components/community/SpaceHeader';
import SpaceFeed from '@/components/community/SpaceFeed';
import { notFound } from 'next/navigation';

export default async function SpacePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const space = await getSpaceBySlug(slug);

    if (!space) {
        notFound();
    }

    const membership = await getSpaceMembership(space._id);
    const posts = await getSpacePosts(space._id);

    const { syncUser } = await import('@/lib/actions/member.actions');
    const user = await syncUser();

    return (
        <div className="min-h-full bg-gray-50">
            <SpaceHeader space={space} membership={membership} />
            <SpaceFeed
                spaceId={space._id}
                initialPosts={posts}
                isMember={!!membership}
                currentUserId={user?._id}
            />
        </div>
    );
}
