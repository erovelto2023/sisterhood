import Link from 'next/link';
import { getPosts } from '@/lib/actions/blog.actions';
import { FaArrowRight, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';

export default async function LatestBlogPosts() {
    const { posts } = await getPosts({ status: 'published', limit: 3 });

    if (!posts || posts.length === 0) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">The Phoenix Scrolls</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                        Explore our collection of stories, insights, and wisdom from the Sisterhood community.
                    </p>
                    <Link
                        href="/blog"
                        className="inline-flex items-center px-8 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Visit the Blog <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest from The Phoenix Scrolls</h2>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            Stories, insights, and wisdom from our community.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="hidden md:flex items-center text-purple-700 font-bold hover:text-purple-900 transition-colors"
                    >
                        View All Posts <FaArrowRight className="ml-2" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link key={post._id} href={`/blog/${post.slug}`} className="group">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {post.coverImage ? (
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-300">
                                            <span className="text-4xl">🔥</span>
                                        </div>
                                    )}
                                    {post.category && (
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-700 uppercase tracking-wide">
                                            {post.category.name}
                                        </span>
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                                        <span className="flex items-center">
                                            <FaCalendarAlt className="mr-1.5 text-purple-400" />
                                            {format(new Date(post.publishDate || post.createdAt), 'MMM d, yyyy')}
                                        </span>
                                        <span className="flex items-center">
                                            <FaUser className="mr-1.5 text-purple-400" />
                                            {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Sisterhood'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                        {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                                    </p>
                                    <div className="flex items-center text-purple-600 font-medium text-sm mt-auto group-hover:translate-x-1 transition-transform">
                                        Read Article <FaArrowRight className="ml-1.5" size={12} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-purple-700 font-bold hover:text-purple-900 transition-colors"
                    >
                        View All Posts <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
