import { getCategories } from '@/lib/actions/blog.actions';
import CategoryManager from '@/components/admin/blog/CategoryManager';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/blog"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4"
                >
                    <FaArrowLeft /> Back to Blog
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
            </div>

            <CategoryManager initialCategories={categories} />
        </div>
    );
}
