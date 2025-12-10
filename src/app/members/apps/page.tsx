import Link from 'next/link';
import { FaBookOpen, FaUsers, FaArrowRight, FaPenNib, FaStore, FaCalendarAlt } from 'react-icons/fa';

export default function AppsDashboard() {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Apps Dashboard</h1>
            <p className="text-gray-500 mb-8">Access your tools and applications.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Book Club App Card */}
                <Link href="/members/apps/book-club" className="block group">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
                        <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                            <FaBookOpen className="text-6xl text-amber-600/80 transform group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">Book Club</h3>
                            <p className="text-gray-500 text-sm mb-4 flex-1">
                                Join our community reading experiences. Download books, discuss chapters, and track your reading progress together.
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                <span className="flex items-center text-xs font-medium text-gray-400">
                                    <FaUsers className="mr-1" /> Community Driven
                                </span>
                                <span className="flex items-center text-sm font-medium text-amber-600 group-hover:translate-x-1 transition-transform">
                                    Open App <FaArrowRight className="ml-1" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Blog App Card */}
                <Link href="/members/apps/blog" className="block group">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
                        <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                            <FaPenNib className="text-6xl text-blue-600/80 transform group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">The Phoenix Scrolls</h3>
                            <p className="text-gray-500 text-sm mb-4 flex-1">
                                Explore stories, insights, and updates from the Sisterhood. Read articles, share thoughts, and stay inspired.
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                <span className="flex items-center text-xs font-medium text-gray-400">
                                    <FaUsers className="mr-1" /> Community Blog
                                </span>
                                <span className="flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                                    Read Now <FaArrowRight className="ml-1" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>



                {/* Planner App Card */}
                <Link href="/members/apps/planner" className="block group">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
                        <div className="h-40 bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                            <FaCalendarAlt className="text-6xl text-purple-600/80 transform group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Productivity Planner</h3>
                            <p className="text-gray-500 text-sm mb-4 flex-1">
                                A learning-aligned, goal-driven productivity system. Manage tasks, track habits, and achieve your goals.
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                <span className="flex items-center text-xs font-medium text-gray-400">
                                    <FaUsers className="mr-1" /> Personal Growth
                                </span>
                                <span className="flex items-center text-sm font-medium text-purple-600 group-hover:translate-x-1 transition-transform">
                                    Plan Now <FaArrowRight className="ml-1" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Placeholder for future apps */}
                <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px]">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl text-gray-400">+</span>
                    </div>
                    <h3 className="font-medium text-gray-900">More Apps Coming Soon</h3>
                    <p className="text-sm text-gray-500 mt-1">Stay tuned for new tools.</p>
                </div>
            </div>
        </div>
    );
}
