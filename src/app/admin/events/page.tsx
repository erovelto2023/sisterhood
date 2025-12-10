import { getAdminEvents, deleteEvent } from '@/lib/actions/event.actions';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaCalendar, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import Image from 'next/image';

export default async function AdminEventsPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string; status?: string }>;
}) {
    const { query, page, status } = await searchParams;
    const currentPage = Number(page) || 1;
    const { events, totalPages, totalEvents } = await getAdminEvents({
        query,
        page: currentPage,
        status,
        limit: 10,
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
                    <p className="text-gray-500 mt-2">Create and manage your community events.</p>
                </div>
                <Link
                    href="/admin/events/new"
                    className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-sm"
                >
                    <FaPlus className="mr-2" />
                    Create Event
                </Link>
            </div>

            {/* Filters (Basic implementation) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Search events..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="space-y-4">
                {events.length > 0 ? (
                    events.map((event: any) => (
                        <div key={event._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                            {/* Image */}
                            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {event.coverImageUrl ? (
                                    <Image
                                        src={event.coverImageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <FaCalendar className="h-8 w-8" />
                                    </div>
                                )}
                                <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold uppercase rounded ${event.status === 'published' ? 'bg-green-100 text-green-800' :
                                        event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {event.status}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{event.description}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/admin/events/${event._id}`}
                                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </Link>
                                        {/* Delete button would need to be a client component or form action */}
                                        <form action={async () => {
                                            'use server';
                                            await deleteEvent(event._id);
                                        }}>
                                            <button
                                                type="submit"
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <FaCalendar className="mr-2 text-purple-500" />
                                        {new Date(event.startDate).toLocaleString()}
                                    </div>
                                    <div className="flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-purple-500" />
                                        {event.locationType === 'virtual' ? 'Virtual' : event.address || 'In Person'}
                                    </div>
                                    <div className="flex items-center">
                                        <FaUsers className="mr-2 text-purple-500" />
                                        {event.capacity ? `${event.capacity} seats` : 'Unlimited'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-500">No events found. Create your first one!</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                </div>
            )}
        </div>
    );
}
