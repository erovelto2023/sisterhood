import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaMapMarkerAlt, FaVideo } from 'react-icons/fa';

interface EventCardProps {
    event: any;
}

export default function EventCard({ event }: EventCardProps) {
    const startDate = new Date(event.startDate);
    const month = startDate.toLocaleString('default', { month: 'short' });
    const day = startDate.getDate();

    return (
        <Link href={`/members/events/${event._id}`} className="block group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="relative h-48 bg-gray-200">
                    {event.coverImageUrl ? (
                        <Image
                            src={event.coverImageUrl}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full bg-purple-100 text-purple-300">
                            <FaCalendar className="h-12 w-12" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white rounded-lg p-2 text-center shadow-sm min-w-[60px]">
                        <div className="text-xs font-bold text-red-500 uppercase">{month}</div>
                        <div className="text-xl font-bold text-gray-900">{day}</div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            {event.category}
                        </span>
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-500 mb-4 flex-1">
                        <div className="flex items-center">
                            <FaCalendar className="mr-2 text-purple-400 flex-shrink-0" />
                            <span>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center">
                            {event.locationType === 'virtual' ? (
                                <>
                                    <FaVideo className="mr-2 text-purple-400 flex-shrink-0" />
                                    <span>Virtual Event</span>
                                </>
                            ) : (
                                <>
                                    <FaMapMarkerAlt className="mr-2 text-purple-400 flex-shrink-0" />
                                    <span className="truncate">{event.address || 'In Person'}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center -space-x-2">
                            {/* Placeholder for attendee avatars if we had them in the list query */}
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500">
                                +{event.attendees?.length || 0}
                            </div>
                        </div>
                        <span className="text-purple-600 font-medium text-sm">
                            {event.price > 0 ? `$${event.price}` : 'Free'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
