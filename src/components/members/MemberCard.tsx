import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/types';

export default function MemberCard({ member }: { member: User }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                    src={member.imageUrl || '/placeholder-avatar.png'} // Fallback image needed
                    alt={`${member.firstName} ${member.lastName}`}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                    {member.firstName} {member.lastName}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1">{member.bio || 'No bio available'}</p>
            </div>
            <Link
                href={`/members/${member._id}`}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
                View Profile
            </Link>
        </div>
    );
}
