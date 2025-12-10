import { syncUser, getFriendRequests } from '@/lib/actions/member.actions';
import { getEnrolledCourses } from '@/lib/actions/student-course.actions';
import { getUpcomingEvents } from '@/lib/actions/event.actions';
import Link from 'next/link';
import {
    FaBook, FaCalendarAlt, FaUserFriends, FaArrowRight,
    FaMedal, FaCertificate, FaShoppingBag
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

export default async function DashboardPage() {
    const user = await syncUser();
    if (!user) return null;

    const enrolledCourses = await getEnrolledCourses();
    const upcomingEvents = await getUpcomingEvents({ limit: 3 });
    const friendRequests = await getFriendRequests(user._id);

    // Calculate stats
    const activeCourses = enrolledCourses.filter((c: any) => c.status === 'active').length;
    const completedCourses = enrolledCourses.filter((c: any) => c.status === 'completed').length;

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}!</h1>
                    <p className="text-purple-100 max-w-xl">
                        Ready to continue your journey? You have {activeCourses} active courses and {upcomingEvents.length} upcoming events.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-6">
                        <Link
                            href="/members/courses"
                            className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold text-sm hover:bg-purple-50 transition-colors shadow-sm"
                        >
                            Continue Learning
                        </Link>
                        <Link
                            href="/members/profile"
                            className="bg-purple-700 text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-purple-600 transition-colors border border-purple-600"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <FaBook size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{activeCourses}</div>
                        <div className="text-xs text-gray-500 font-medium">Active Courses</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <FaCertificate size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{completedCourses}</div>
                        <div className="text-xs text-gray-500 font-medium">Certificates</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-pink-50 text-pink-600 rounded-lg">
                        <FaUserFriends size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{user.friends?.length || 0}</div>
                        <div className="text-xs text-gray-500 font-medium">Friends</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                        <FaMedal size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{user.badges?.length || 0}</div>
                        <div className="text-xs text-gray-500 font-medium">Badges Earned</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Continue Learning */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FaBook className="text-purple-600" /> Continue Learning
                            </h2>
                            <Link href="/members/courses" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                View All
                            </Link>
                        </div>

                        {enrolledCourses.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {enrolledCourses.slice(0, 3).map((enrollment: any) => (
                                    <div key={enrollment._id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                {enrollment.course.thumbnail ? (
                                                    <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <FaBook />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 mb-1">{enrollment.course.title}</h3>
                                                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                                    <span>{enrollment.progress}% Complete</span>
                                                    <span>Last accessed {formatDistanceToNow(new Date(enrollment.lastAccessedAt || enrollment.updatedAt), { addSuffix: true })}</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${enrollment.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Link
                                                    href={`/members/courses/${enrollment.course.slug}`}
                                                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                                                >
                                                    <FaArrowRight />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-purple-50 text-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaBook size={24} />
                                </div>
                                <h3 className="text-gray-900 font-medium mb-1">No active courses</h3>
                                <p className="text-gray-500 text-sm mb-4">Start your learning journey today!</p>
                                <Link
                                    href="/members/courses"
                                    className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                                >
                                    Browse Courses
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FaCalendarAlt className="text-pink-600" /> Upcoming Events
                            </h2>
                            <Link href="/members/events" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                Calendar
                            </Link>
                        </div>

                        {upcomingEvents.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {upcomingEvents.map((event: any) => (
                                    <div key={event._id} className="p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="w-16 text-center bg-pink-50 rounded-lg p-2 flex-shrink-0">
                                            <div className="text-pink-600 font-bold text-xl">
                                                {new Date(event.startDate).getDate()}
                                            </div>
                                            <div className="text-pink-400 text-xs font-medium uppercase">
                                                {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">{event.title}</h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.location || 'Online'}
                                            </p>
                                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                                                {event.category}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/members/events/${event._id}`}
                                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No upcoming events scheduled.
                            </div>
                        )}
                    </div>

                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">

                    {/* Friend Requests */}
                    {friendRequests.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-pink-50">
                                <h3 className="font-bold text-pink-900 flex items-center gap-2">
                                    <FaUserFriends /> Friend Requests
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {friendRequests.map((req: any) => (
                                    <div key={req._id} className="p-4 flex items-center gap-3">
                                        <img
                                            src={req.sender.imageUrl || "https://via.placeholder.com/40"}
                                            alt=""
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 truncate">
                                                {req.sender.firstName} {req.sender.lastName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Wants to connect
                                            </div>
                                        </div>
                                        <Link
                                            href="/members/friends"
                                            className="text-xs bg-pink-600 text-white px-3 py-1.5 rounded-full font-medium hover:bg-pink-700"
                                        >
                                            View
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Links */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link href="/members/listings" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                <span className="flex items-center gap-3 text-gray-600 group-hover:text-gray-900">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <FaShoppingBag size={14} />
                                    </div>
                                    Browse Marketplace
                                </span>
                                <FaArrowRight className="text-gray-300 group-hover:text-gray-400" size={12} />
                            </Link>
                            <Link href="/members/certificates" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                <span className="flex items-center gap-3 text-gray-600 group-hover:text-gray-900">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <FaCertificate size={14} />
                                    </div>
                                    My Certificates
                                </span>
                                <FaArrowRight className="text-gray-300 group-hover:text-gray-400" size={12} />
                            </Link>
                            <Link href="/members/badges" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                <span className="flex items-center gap-3 text-gray-600 group-hover:text-gray-900">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                        <FaMedal size={14} />
                                    </div>
                                    My Badges
                                </span>
                                <FaArrowRight className="text-gray-300 group-hover:text-gray-400" size={12} />
                            </Link>
                        </div>
                    </div>

                    {/* Daily Quote or Tip */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white text-center">
                        <FaMedal className="text-4xl text-white/30 mx-auto mb-4" />
                        <p className="font-medium text-lg mb-2">"Healing is a journey, not a destination."</p>
                        <p className="text-white/70 text-sm">- Daily Wisdom</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
