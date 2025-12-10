'use client';

import { joinBookClub } from '@/lib/actions/book-club.actions';
import { useState } from 'react';
import { FaUsers, FaCalendarAlt, FaBookOpen } from 'react-icons/fa';
import { format } from 'date-fns';

interface BookClubHeaderProps {
    bookClub: any;
    membership: any;
}

export default function BookClubHeader({ bookClub, membership }: BookClubHeaderProps) {
    const [isMember, setIsMember] = useState(!!membership);
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        setLoading(true);
        try {
            await joinBookClub(bookClub._id);
            setIsMember(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="h-64 relative">
                {bookClub.coverImage ? (
                    <img src={bookClub.coverImage} alt={bookClub.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-amber-200 to-orange-100 flex items-center justify-center">
                        <FaBookOpen className="text-8xl text-white/50" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-2">{bookClub.title}</h1>
                        <div className="flex items-center gap-6 text-white/90 text-sm font-medium">
                            <span className="flex items-center gap-2">
                                <FaUsers /> {bookClub.membersCount} Members
                            </span>
                            <span className="flex items-center gap-2 capitalize">
                                <FaBookOpen /> {bookClub.pace.replace('_', ' ')} Pace
                            </span>
                            {bookClub.startDate && (
                                <span className="flex items-center gap-2">
                                    <FaCalendarAlt /> Starts {format(new Date(bookClub.startDate), 'MMMM d, yyyy')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
                <div className="flex gap-8 text-sm font-medium text-gray-500">
                    {/* Menu moved to BookClubView */}
                </div>

                <div>
                    {isMember ? (
                        <span className="px-6 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            Member
                        </span>
                    ) : (
                        <button
                            onClick={handleJoin}
                            disabled={loading}
                            className="px-8 py-2.5 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors shadow-sm hover:shadow-md"
                        >
                            {loading ? 'Joining...' : 'Join Book Club'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
