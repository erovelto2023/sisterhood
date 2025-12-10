import { getSpaces } from '@/lib/actions/community.actions';
import CreateSpaceModal from '@/components/community/CreateSpaceModal';
import Link from 'next/link';
import { FaUsers, FaCommentDots } from 'react-icons/fa';

export default async function CommunityPage() {
    const spaces = await getSpaces();

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Community</h1>
                    <p className="text-gray-500">Join the conversation in our spaces.</p>
                </div>
                <CreateSpaceModal />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space: any) => (
                    <Link
                        key={space._id}
                        href={`/members/community/${space.slug}`}
                        className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group"
                    >
                        <div className="h-24 bg-gradient-to-r from-purple-500 to-pink-500 relative">
                            {space.icon && (
                                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">
                                    {space.icon}
                                </div>
                            )}
                        </div>
                        <div className="p-6 pt-8">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                                {space.name}
                            </h3>
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2 h-10">
                                {space.description || "No description provided."}
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 font-medium">
                                <span className="flex items-center gap-1">
                                    <FaUsers /> {space.membersCount} members
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaCommentDots /> {space.postsCount} posts
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
