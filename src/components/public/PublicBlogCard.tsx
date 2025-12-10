import Link from 'next/link';
import { format } from 'date-fns';

interface BlogCardProps {
    post: any;
    featured?: boolean;
}

export default function PublicBlogCard({ post, featured = false }: BlogCardProps) {
    if (featured) {
        return (
            <Link href={`/blog/${post.slug}`} className="group block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                        {post.coverImage ? (
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                No Image
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium text-xs uppercase tracking-wider">
                                {post.category?.name || 'Article'}
                            </span>
                            <span className="text-gray-500">
                                {format(new Date(post.publishDate || post.createdAt), 'MMM d, yyyy')}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{post.readingTime || 5} min read</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors leading-tight">
                            {post.title}
                        </h2>
                        <p className="text-gray-600 text-lg line-clamp-3 leading-relaxed">
                            {post.excerpt || post.subtitle}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <img
                                src={post.author?.imageUrl || "https://via.placeholder.com/40"}
                                alt={post.author?.firstName || 'Author'}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <div className="font-medium text-gray-900">{post.author?.firstName} {post.author?.lastName}</div>
                                <div className="text-xs text-gray-500">{post.author?.headline || 'Author'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
            <div className="aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 mb-4 shadow-sm">
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                        No Image
                    </div>
                )}
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs mb-3">
                    <span className="font-semibold text-purple-700 uppercase tracking-wider">
                        {post.category?.name || 'Article'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                        {format(new Date(post.publishDate || post.createdAt), 'MMM d, yyyy')}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {post.excerpt || post.subtitle}
                </p>
                <div className="flex items-center gap-2 mt-auto">
                    <img
                        src={post.author?.imageUrl || "https://via.placeholder.com/32"}
                        alt={post.author?.firstName || 'Author'}
                        className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs font-medium text-gray-700">
                        {post.author?.firstName} {post.author?.lastName}
                    </span>
                </div>
            </div>
        </Link>
    );
}
