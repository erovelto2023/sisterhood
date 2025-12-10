import { getKnowledgeBaseHome } from '@/lib/actions/kb.actions';
import KBSearch from '@/components/members/KBSearch';
import Link from 'next/link';
import { FaFolder, FaStar, FaArrowRight } from 'react-icons/fa';

export default async function KnowledgeBasePage() {
    const { categories, featuredArticles } = await getKnowledgeBaseHome();

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center py-12 px-4 mb-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl text-white shadow-lg">
                <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
                <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
                    Search our knowledge base for answers to common questions, tutorials, and guides.
                </p>
                <KBSearch />
            </div>

            {/* Categories Grid */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((category: any) => (
                        <Link
                            key={category._id}
                            href={`/members/knowledge-base/category/${category.slug}`}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all group"
                        >
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <FaFolder className="text-xl" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {category.description || 'Browse articles in this category'}
                            </p>
                            <span className="text-purple-600 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                                View Articles <FaArrowRight className="ml-2 text-xs" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <FaStar className="text-yellow-400 mr-2" />
                        Popular Articles
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {featuredArticles.map((article: any) => (
                            <Link
                                key={article._id}
                                href={`/members/knowledge-base/${article.slug}`}
                                className="block p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-2">
                                            {article.excerpt || 'Click to read more...'}
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                {article.category.name}
                                            </span>
                                            <span>{article.views} views</span>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-gray-300 mt-2" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
