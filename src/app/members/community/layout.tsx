import { getSpaces } from '@/lib/actions/community.actions';
import Link from 'next/link';
import { FaHashtag, FaLock, FaGlobe } from 'react-icons/fa';

export default async function CommunityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const spaces = await getSpaces();

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Community Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
                <div className="p-4">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Spaces
                    </h2>
                    <div className="space-y-1">
                        <Link
                            href="/members/community"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-50 group"
                        >
                            <span className="w-6 h-6 mr-2 flex items-center justify-center text-gray-400 group-hover:text-gray-500">
                                🏠
                            </span>
                            Home
                        </Link>
                        {spaces.map((space: any) => (
                            <Link
                                key={space._id}
                                href={`/members/community/${space.slug}`}
                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                            >
                                <span className="w-6 h-6 mr-2 flex items-center justify-center text-gray-400 group-hover:text-gray-500">
                                    {space.type === 'private' ? <FaLock size={12} /> : <FaHashtag size={12} />}
                                </span>
                                <span className="truncate">{space.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                {children}
            </div>
        </div>
    );
}
