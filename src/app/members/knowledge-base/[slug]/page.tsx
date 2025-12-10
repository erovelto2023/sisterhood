import { getArticleBySlug } from '@/lib/actions/kb.actions';
import KBSearch from '@/components/members/KBSearch';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaCalendar, FaUser, FaTag, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href={`/members/knowledge-base/category/${article.category.slug}`}
                    className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to {article.category.name}
                </Link>
                <KBSearch />
            </div>

            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {article.featuredImage && (
                    <div className="relative h-64 md:h-80 w-full">
                        <Image
                            src={article.featuredImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <div className="p-8 md:p-12">
                    <div className="flex flex-wrap gap-2 mb-6">
                        <Link
                            href={`/members/knowledge-base/category/${article.category.slug}`}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                        >
                            {article.category.name}
                        </Link>
                        {article.tags && article.tags.map((tag: string) => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center">
                            <FaUser className="mr-2" />
                            {article.author?.firstName} {article.author?.lastName}
                        </div>
                        <div className="flex items-center">
                            <FaCalendar className="mr-2" />
                            Updated {new Date(article.updatedAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="prose prose-purple max-w-none prose-lg text-gray-600">
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </div>

                    {/* Feedback Section (Placeholder for now) */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <h3 className="font-semibold text-gray-900 mb-4">Was this article helpful?</h3>
                            <div className="flex justify-center space-x-4">
                                <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-green-500 hover:text-green-600 transition-colors">
                                    <FaThumbsUp className="mr-2" /> Yes
                                </button>
                                <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-600 transition-colors">
                                    <FaThumbsDown className="mr-2" /> No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
