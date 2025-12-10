import { getPosts, getCategories } from '@/lib/actions/blog.actions';
import BlogCard from '@/components/apps/blog/BlogCard';
import { FaSearch } from 'react-icons/fa';

export default async function BlogPage() {
    const { posts } = await getPosts({ status: 'published', limit: 10 });
    const categories = await getCategories();

    const featuredPost = posts[0];
    const recentPosts = posts.slice(1);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-amber-50 border-b border-amber-100">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
                        The Phoenix Scrolls
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Stories, insights, and updates from the Sisterhood community.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Featured Post */}
                {featuredPost && (
                    <div className="mb-16">
                        <BlogCard post={featuredPost} featured={true} />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Main Feed */}
                    <div className="lg:col-span-3">
                        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Stories</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                            {recentPosts.map((post: any) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>

                        {recentPosts.length === 0 && !featuredPost && (
                            <div className="text-center py-12 text-gray-500">
                                No posts published yet. Check back soon!
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Search */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <h3 className="font-bold text-gray-900 mb-4">Search</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" size={14} />
                            </div>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Topics</h3>
                            <div className="space-y-2">
                                {categories.map((cat: any) => (
                                    <a
                                        key={cat._id}
                                        href={`/members/apps/blog?category=${cat._id}`}
                                        className="flex justify-between items-center py-2 text-gray-600 hover:text-amber-700 transition-colors group"
                                    >
                                        <span>{cat.name}</span>
                                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs group-hover:bg-amber-100 group-hover:text-amber-700">
                                            {cat.count}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter CTA */}
                        <div className="bg-amber-900 text-white p-6 rounded-xl text-center">
                            <h3 className="font-bold text-xl mb-2">Join the Newsletter</h3>
                            <p className="text-amber-100 text-sm mb-4">Get the latest stories delivered to your inbox weekly.</p>
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full px-4 py-2 rounded-lg text-gray-900 mb-2 focus:outline-none"
                            />
                            <button className="w-full py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
