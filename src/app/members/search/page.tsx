import { searchMembers, syncUser } from '@/lib/actions/member.actions';
import MemberSearchInput from '@/components/members/MemberSearchInput';
import MemberCard from '@/components/members/MemberCard';
import Link from 'next/link';
import { User } from '@/types';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string }>;
}) {
    await syncUser(); // Ensure current user is in DB
    const { query, page } = await searchParams;
    const currentPage = Number(page) || 1;
    const { members, totalPages } = await searchMembers({
        query,
        page: currentPage,
        limit: 30,
    });

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Members</h2>
                <p className="text-gray-600 mb-6">Find and connect with other members of the community.</p>
                <MemberSearchInput />
            </div>

            <div className="space-y-4">
                {members.length > 0 ? (
                    members.map((member: User) => (
                        <MemberCard key={member._id} member={member} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-500">No members found.</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {currentPage > 1 && (
                        <Link
                            href={`/members/search?query=${query || ''}&page=${currentPage - 1}`}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
                        >
                            Previous
                        </Link>
                    )}
                    <span className="px-4 py-2 text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    {currentPage < totalPages && (
                        <Link
                            href={`/members/search?query=${query || ''}&page=${currentPage + 1}`}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700"
                        >
                            Next
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
