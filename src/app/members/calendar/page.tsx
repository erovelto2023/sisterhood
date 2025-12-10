import { getMonthEvents } from '@/lib/actions/event.actions';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: Promise<{ year?: string; month?: string }>;
}) {
    const { year, month } = await searchParams;

    const today = new Date();
    const currentYear = year ? parseInt(year) : today.getFullYear();
    const currentMonth = month ? parseInt(month) : today.getMonth();

    const events = await getMonthEvents(currentYear, currentMonth);

    // Calendar logic
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    const days = [];
    // Previous month padding
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Event Calendar</h1>
                <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <Link
                        href={`/members/calendar?year=${prevYear}&month=${prevMonth}`}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaChevronLeft className="text-gray-600" />
                    </Link>
                    <span className="text-lg font-bold text-gray-800 w-40 text-center">
                        {monthName} {currentYear}
                    </span>
                    <Link
                        href={`/members/calendar?year=${nextYear}&month=${nextMonth}`}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaChevronRight className="text-gray-600" />
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 gap-px border-b border-gray-100">
                    {days.map((day, index) => {
                        const dayEvents = day ? events.filter((e: any) => {
                            const eventDate = new Date(e.startDate);
                            return eventDate.getDate() === day;
                        }) : [];

                        return (
                            <div key={index} className={`min-h-[120px] bg-white p-2 ${!day ? 'bg-gray-50' : ''}`}>
                                {day && (
                                    <>
                                        <div className={`text-sm font-medium mb-2 ${day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                                                ? 'bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                                                : 'text-gray-700'
                                            }`}>
                                            {day}
                                        </div>
                                        <div className="space-y-1">
                                            {dayEvents.map((event: any) => (
                                                <Link
                                                    key={event._id}
                                                    href={`/members/events/${event._id}`}
                                                    className="block px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded hover:bg-purple-100 truncate transition-colors border-l-2 border-purple-500"
                                                    title={event.title}
                                                >
                                                    {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {event.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
