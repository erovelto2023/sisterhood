import { getArticlesByCategory } from '@/lib/actions/kb.actions';
import KBSearch from '@/components/members/KBSearch';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaFolderOpen, FaArrowLeft, FaFileAlt } from 'react-icons/fa';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getArticlesByCategory(slug);

    if (!data) {
        notFound();
    }

    const { category, articles } = data;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/members/knowledge-base"
                    className="inline-flex items-center text-gray-500 hover:text-purple-600 mb-6 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Knowledge Base
                </Link>

                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 text-2xl">
                        <FaFolderOpen />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                        <p className="text-gray-500 mt-1">{category.description || 'Browse articles in this category'}</p>
                    </div>
                </div>

                <KBSearch />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-semibold text-gray-700 flex items-center">
                        <FaFileAlt className="mr-2 text-gray-400" />
                        {articles.length} Articles
                    </h2>
                </div>

                <div className="divide-y divide-gray-100">
                    {articles.length > 0 ? (
                        articles.map((article: any) => (
                            <Link
                                key={article._id}
                                href={`/members/knowledge-base/${article.slug}`}
                                className="block p-6 hover:bg-gray-50 transition-colors group"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-3">
                                    {article.excerpt || 'Click to read full article...'}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-400">
                                    {article.tags && article.tags.map((tag: string) => (
                                        <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                                            #{tag}
                                        </span>
                                    ))}
                                    <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            No articles found in this category yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
