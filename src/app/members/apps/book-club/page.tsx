import { getBookClubs } from '@/lib/actions/book-club.actions';
import Link from 'next/link';
import { FaBook, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';

export default async function BookClubHomePage() {
    const bookClubs = await getBookClubs();

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Book Clubs</h1>
                    <p className="text-gray-500 mt-1">Join a club, read together, and discuss.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bookClubs.map((club: any) => (
                    <Link
                        key={club._id}
                        href={`/members/apps/book-club/${club.slug}`}
                        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                    >
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                            {club.coverImage ? (
                                <img src={club.coverImage} alt={club.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                    <FaBook className="text-6xl text-amber-300" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 uppercase tracking-wide shadow-sm">
                                {club.type.replace('_', ' ')}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                {club.title}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                                {club.description}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-50">
                                <span className="flex items-center gap-1.5">
                                    <FaUsers className="text-gray-400" /> {club.membersCount} members
                                </span>
                                {club.startDate && (
                                    <span className="flex items-center gap-1.5">
                                        <FaCalendarAlt className="text-gray-400" /> {format(new Date(club.startDate), 'MMM d')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}

                {bookClubs.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <FaBook className="mx-auto text-4xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Book Clubs Yet</h3>
                        <p className="text-gray-500">Check back soon for new reading groups.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
