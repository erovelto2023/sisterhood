import { getPostBySlug } from '@/lib/actions/blog.actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaClock, FaTag } from 'react-icons/fa';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post || post.status !== 'published') {
        notFound();
    }

    return (
        <article className="bg-white min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-900">
                {post.coverImage && (
                    <>
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    </>
                )}

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full text-sm font-medium"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Scrolls
                        </Link>

                        {post.category && (
                            <div className="mb-4">
                                <span className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                                    {post.category.name}
                                </span>
                            </div>
                        )}

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base font-medium">
                            <div className="flex items-center gap-2">
                                <img
                                    src={post.author?.imageUrl || "https://via.placeholder.com/40"}
                                    alt={post.author?.firstName}
                                    className="w-10 h-10 rounded-full border-2 border-white/50"
                                />
                                <span>{post.author?.firstName} {post.author?.lastName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-purple-400" />
                                <span>{format(new Date(post.publishDate || post.createdAt), 'MMMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-purple-400" />
                                <span>{post.readingTime} min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="bg-white rounded-t-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                    {post.subtitle && (
                        <p className="text-xl md:text-2xl text-gray-600 font-serif italic mb-10 leading-relaxed border-l-4 border-purple-500 pl-6 py-2 bg-purple-50/50 rounded-r-lg">
                            {post.subtitle}
                        </p>
                    )}

                    <div
                        className="prose prose-lg prose-purple max-w-none font-serif text-gray-800 leading-loose"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag: string) => (
                                    <span key={tag} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                                        <FaTag className="mr-2 text-gray-400" size={12} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Author Bio */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="bg-gray-50 rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-100">
                    <img
                        src={post.author?.imageUrl || "https://via.placeholder.com/80"}
                        alt={post.author?.firstName}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                    />
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Written by {post.author?.firstName} {post.author?.lastName}</h3>
                        <p className="text-purple-600 text-sm font-medium mb-3">{post.author?.headline || 'Community Member'}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {post.author?.bio || `${post.author?.firstName} is a valued member of the Sisterhood of the Rising Phoenix, sharing wisdom and experiences to help others rise.`}
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enjoyed this scroll?</h3>
                <p className="text-gray-600 mb-8">Join the Sisterhood to access more exclusive content, courses, and community.</p>
                <Link
                    href="/sign-up"
                    className="inline-block px-8 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    Join the Sisterhood
                </Link>
            </div>
        </article>
    );
}
