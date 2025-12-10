import { getPosts } from '@/lib/actions/blog.actions';
import Link from 'next/link';
import { FaPlus, FaEdit, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';

export default async function AdminBlogPage() {
    const { posts } = await getPosts({ limit: 50 });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                <div className="flex gap-3">
                    <Link
                        href="/admin/blog/categories"
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Categories
                    </Link>
                    <Link
                        href="/admin/blog/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        <FaPlus /> New Post
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Title</th>
                            <th className="p-4 font-semibold text-gray-600">Author</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-gray-600">Date</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map((post: any) => (
                            <tr key={post._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{post.title}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-xs">{post.slug}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {post.author.imageUrl && (
                                            <img src={post.author.imageUrl} alt="" className="w-6 h-6 rounded-full" />
                                        )}
                                        <span className="text-sm text-gray-700">{post.author.firstName}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                        ${post.status === 'published' ? 'bg-green-100 text-green-700' :
                                            post.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                                                'bg-yellow-100 text-yellow-700'}`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {post.category?.name || 'Uncategorized'}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {post.publishDate ? format(new Date(post.publishDate), 'MMM d, yyyy') : '-'}
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link
                                        href={`/admin/blog/${post._id}`}
                                        className="inline-block text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </Link>
                                    {post.status === 'published' && (
                                        <Link
                                            href={`/members/apps/blog/${post.slug}`}
                                            target="_blank"
                                            className="inline-block text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <FaEye />
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No posts found. Create your first blog post!
                    </div>
                )}
            </div>
        </div>
    );
}
