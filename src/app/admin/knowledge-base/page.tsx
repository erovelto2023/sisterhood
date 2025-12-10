import { getAdminArticles, deleteArticle } from '@/lib/actions/kb.actions';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaFolder, FaEye } from 'react-icons/fa';

export default async function AdminKBPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; page?: string }>;
}) {
    const { query, page } = await searchParams;
    const currentPage = Number(page) || 1;
    const { articles, totalPages } = await getAdminArticles({
        query,
        page: currentPage,
        limit: 10,
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
                    <p className="text-gray-500 mt-2">Manage articles and documentation.</p>
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/admin/knowledge-base/categories"
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                    >
                        <FaFolder className="mr-2" />
                        Categories
                    </Link>
                    <Link
                        href="/admin/knowledge-base/new"
                        className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-sm"
                    >
                        <FaPlus className="mr-2" />
                        New Article
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-medium">Title</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Views</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {articles.map((article: any) => (
                            <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{article.title}</div>
                                    <div className="text-xs text-gray-500">By {article.author?.firstName}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {article.category?.name || 'Uncategorized'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${article.status === 'published' ? 'bg-green-100 text-green-800' :
                                            article.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {article.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {article.views}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link
                                        href={`/admin/knowledge-base/${article._id}`}
                                        className="inline-block p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <form action={async () => {
                                        'use server';
                                        await deleteArticle(article._id);
                                    }} className="inline-block">
                                        <button
                                            type="submit"
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No articles found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
