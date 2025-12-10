'use client';

import { format } from 'date-fns';

export default function BookClubMembers({ members }: { members: any[] }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Members ({members.length})</h3>
            </div>
            <div className="divide-y divide-gray-100">
                {members.map((member: any) => (
                    <div key={member._id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <img
                            src={member.user.imageUrl || "https://via.placeholder.com/40"}
                            alt={member.user.firstName}
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <h4 className="font-semibold text-gray-900">
                                {member.user.firstName} {member.user.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">{member.user.headline || 'Member'}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Joined {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                            </p>
                        </div>
                        <div className="ml-auto">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                                ${member.role === 'host' ? 'bg-purple-100 text-purple-700' :
                                    member.role === 'moderator' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-600'}`}>
                                {member.role}
                            </span>
                        </div>
                    </div>
                ))}
                {members.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No members yet.
                    </div>
                )}
            </div>
        </div>
    );
}
