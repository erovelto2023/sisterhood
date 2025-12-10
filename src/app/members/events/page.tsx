import { getAllUpcomingEvents } from '@/lib/actions/event.actions';
import EventCard from '@/components/members/EventCard';
import Link from 'next/link';

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; category?: string; page?: string }>;
}) {
    const { query, category, page } = await searchParams;
    const currentPage = Number(page) || 1;

    const { events, totalPages } = await getAllUpcomingEvents({
        query,
        category,
        page: currentPage,
        limit: 12,
    });

    const categories = ['Workshop', 'Webinar', 'Masterclass', 'Meetup', 'Coaching', 'Conference'];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
                    <p className="text-gray-500 mt-2">Discover workshops, webinars, and meetups.</p>
                </div>
                <Link
                    href="/members/calendar"
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    View Calendar
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        <Link
                            href="/members/events"
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${!category
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/members/events?category=${cat}`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${category === cat
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Event Grid */}
            {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event: any) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500 text-lg">No upcoming events found.</p>
                    <p className="text-gray-400 mt-2">Try adjusting your filters or check back later.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center space-x-2">
                    {currentPage > 1 && (
                        <Link
                            href={`/members/events?page=${currentPage - 1}${category ? `&category=${category}` : ''}`}
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
                            href={`/members/events?page=${currentPage + 1}${category ? `&category=${category}` : ''}`}
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
