import { getEventById, getUserRegistrationStatus } from '@/lib/actions/event.actions';
import RegistrationButton from '@/components/members/RegistrationButton';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaCalendar, FaMapMarkerAlt, FaVideo, FaClock, FaArrowLeft, FaUser } from 'react-icons/fa';

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEventById(id);
    const registration = await getUserRegistrationStatus(id);

    if (!event) {
        notFound();
    }

    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/members/events" className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition-colors">
                <FaArrowLeft className="mr-2" />
                Back to Events
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                {/* Hero Image */}
                <div className="relative h-64 md:h-96 bg-gray-200">
                    {event.coverImageUrl ? (
                        <Image
                            src={event.coverImageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-purple-100 text-purple-300">
                            <FaCalendar className="h-24 w-24" />
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <span className="px-4 py-2 bg-black/60 backdrop-blur-md text-white font-medium rounded-full">
                            {event.category}
                        </span>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Main Content */}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>

                            <div className="flex items-center space-x-4 mb-6 text-gray-600">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                        <FaUser className="text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Hosted By</p>
                                        <p className="font-medium text-gray-900">{event.organizer.firstName} {event.organizer.lastName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-purple max-w-none text-gray-600">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">About this Event</h3>
                                <p className="whitespace-pre-wrap">{event.description}</p>
                            </div>

                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="w-full md:w-80 flex-shrink-0">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-24">
                                <div className="space-y-6 mb-8">
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mr-4">
                                            <FaCalendar />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Date</p>
                                            <p className="text-gray-600">{startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mr-4">
                                            <FaClock />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Time</p>
                                            <p className="text-gray-600">
                                                {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mr-4">
                                            {event.locationType === 'virtual' ? <FaVideo /> : <FaMapMarkerAlt />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Location</p>
                                            <p className="text-gray-600">
                                                {event.locationType === 'virtual' ? 'Virtual Event' : event.address || 'In Person'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <RegistrationButton
                                    eventId={event._id}
                                    initialStatus={registration}
                                    eventPrice={event.price || 0}
                                    eventCapacity={event.capacity || 0}
                                    attendeeCount={event.attendees?.length || 0}
                                />

                                {registration?.status === 'registered' && event.locationType === 'virtual' && event.virtualLink && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-900 mb-2">Join Link:</p>
                                        <a
                                            href={event.virtualLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full px-4 py-2 bg-blue-50 text-blue-600 text-center rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium truncate"
                                        >
                                            Join Meeting
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
