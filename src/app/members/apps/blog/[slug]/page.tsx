import { getPostBySlug } from '@/lib/actions/blog.actions';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { FaFacebook, FaTwitter, FaLinkedin, FaLink } from 'react-icons/fa';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) return {};

    return {
        title: post.seoTitle || post.title,
        description: post.metaDescription || post.excerpt,
        openGraph: {
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) notFound();

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Link
                        href={`/members/apps/blog?category=${post.category?._id}`}
                        className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors"
                    >
                        {post.category?.name || 'Article'}
                    </Link>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">
                        {format(new Date(post.publishDate || post.createdAt), 'MMMM d, yyyy')}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-serif leading-tight">
                    {post.title}
                </h1>

                {post.subtitle && (
                    <p className="text-xl md:text-2xl text-gray-500 mb-8 font-light leading-relaxed">
                        {post.subtitle}
                    </p>
                )}

                <div className="flex items-center justify-center gap-4">
                    <img
                        src={post.author.imageUrl || "https://via.placeholder.com/48"}
                        alt={post.author.firstName}
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="text-left">
                        <div className="font-bold text-gray-900">{post.author.firstName} {post.author.lastName}</div>
                        <div className="text-sm text-gray-500">{post.author.headline || 'Author'}</div>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="max-w-5xl mx-auto px-6 mb-12">
                    <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-sm">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6">
                <article className="prose prose-lg prose-amber max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/members/apps/blog?tag=${tag}`}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Share */}
                <div className="mt-8 flex items-center gap-4">
                    <span className="font-bold text-gray-900">Share this article:</span>
                    <button className="p-2 text-gray-400 hover:text-[#1877F2] transition-colors"><FaFacebook size={20} /></button>
                    <button className="p-2 text-gray-400 hover:text-[#1DA1F2] transition-colors"><FaTwitter size={20} /></button>
                    <button className="p-2 text-gray-400 hover:text-[#0A66C2] transition-colors"><FaLinkedin size={20} /></button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><FaLink size={20} /></button>
                </div>

                {/* Author Box */}
                <div className="mt-12 bg-gray-50 rounded-2xl p-8 flex gap-6 items-start">
                    <img
                        src={post.author.imageUrl || "https://via.placeholder.com/64"}
                        alt={post.author.firstName}
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">About {post.author.firstName}</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {post.author.bio || `${post.author.firstName} is a member of the Sisterhood community.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
