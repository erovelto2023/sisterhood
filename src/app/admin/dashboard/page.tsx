import { getAdminDashboardStats } from '@/lib/actions/admin.actions';
import Link from 'next/link';
import {
    FaUsers, FaBook, FaCalendarAlt, FaShoppingBag,
    FaStore, FaComments, FaPenNib, FaBookOpen, FaLightbulb,
    FaArrowRight
} from 'react-icons/fa';

export default async function AdminDashboardPage() {
    const stats = await getAdminDashboardStats();

    const cards = [
        { label: 'Total Users', value: stats.users, icon: FaUsers, color: 'bg-blue-500', href: '/admin/users' },
        { label: 'Courses', value: stats.courses, icon: FaBook, color: 'bg-indigo-500', href: '/admin/courses' },
        { label: 'Events', value: stats.events, icon: FaCalendarAlt, color: 'bg-pink-500', href: '/admin/events' },
        { label: 'Communities', value: stats.communities, icon: FaComments, color: 'bg-purple-500', href: '/admin/community' },
        { label: 'Stores', value: stats.stores, icon: FaStore, color: 'bg-emerald-500', href: '/admin/store' },
        { label: 'Listings', value: stats.listings, icon: FaShoppingBag, color: 'bg-green-500', href: '/admin/store' },
        { label: 'Blog Posts', value: stats.blogPosts, icon: FaPenNib, color: 'bg-orange-500', href: '/admin/blog' },
        { label: 'Book Clubs', value: stats.bookClubs, icon: FaBookOpen, color: 'bg-amber-500', href: '/admin/book-clubs' },
        { label: 'KB Articles', value: stats.kbArticles, icon: FaLightbulb, color: 'bg-yellow-500', href: '/admin/knowledge-base' },
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-2">Overview of platform activity and statistics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <Link
                        key={index}
                        href={card.href}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 flex items-center gap-1 transition-colors">
                                Manage <FaArrowRight size={10} />
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{card.value}</h3>
                            <p className="text-sm font-medium text-gray-500">{card.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/users" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                            <span className="block font-medium text-gray-900">Manage Users</span>
                        </Link>
                        <Link href="/admin/store" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                            <span className="block font-medium text-gray-900">Review Listings</span>
                        </Link>
                        <Link href="/admin/blog/new" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                            <span className="block font-medium text-gray-900">Write Blog Post</span>
                        </Link>
                        <Link href="/admin/events/new" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                            <span className="block font-medium text-gray-900">Create Event</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl shadow-sm p-6 text-white">
                    <h2 className="text-lg font-bold mb-4">System Status</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-purple-200">Database</span>
                            <span className="flex items-center gap-2 text-green-400 font-medium text-sm">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Connected
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-purple-200">Server Time</span>
                            <span className="font-mono text-sm">{new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-purple-200">Environment</span>
                            <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-bold">PRODUCTION</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
