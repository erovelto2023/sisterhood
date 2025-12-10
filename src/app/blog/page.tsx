import { getPosts, getCategories } from '@/lib/actions/blog.actions';
import PublicBlogCard from '@/components/public/PublicBlogCard';
import { FaSearch } from 'react-icons/fa';

export default async function PublicBlogPage() {
    const { posts } = await getPosts({ status: 'published', limit: 10 });
    const categories = await getCategories();

    const featuredPost = posts[0];
    const recentPosts = posts.slice(1);

    return (
        <div className="bg-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-serif">
                        The Phoenix Scrolls
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Stories of resilience, healing, and transformation from the Sisterhood.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Featured Post */}
                {featuredPost && (
                    <div className="mb-20">
                        <PublicBlogCard post={featuredPost} featured={true} />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Main Feed */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Stories</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                            {recentPosts.map((post: any) => (
                                <PublicBlogCard key={post._id} post={post} />
                            ))}
                        </div>

                        {recentPosts.length === 0 && !featuredPost && (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-500 text-lg">No scrolls have been written yet. Check back soon.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-10">
                        {/* Search */}
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Search Scrolls</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                                <FaSearch className="absolute left-3 top-3.5 text-gray-400" size={16} />
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 text-lg">Topics</h3>
                            <div className="space-y-2">
                                {categories.map((cat: any) => (
                                    <a
                                        key={cat._id}
                                        href={`/blog?category=${cat._id}`}
                                        className="flex justify-between items-center py-2 text-gray-600 hover:text-purple-700 transition-colors group"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                                            {cat.count}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter CTA */}
                        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8 rounded-2xl text-center shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="font-bold text-xl mb-3 relative z-10">Join the Newsletter</h3>
                            <p className="text-purple-100 text-sm mb-6 relative z-10">Get the latest wisdom delivered to your inbox weekly.</p>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full px-4 py-3 rounded-xl text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400 relative z-10"
                            />
                            <button className="w-full py-3 bg-white text-purple-900 hover:bg-purple-50 rounded-xl font-bold transition-colors relative z-10 shadow-md">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
