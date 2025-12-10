import { getMarketplaceCategories } from '@/lib/actions/marketplace.actions';
import CategoryManager from '@/components/admin/store/CategoryManager';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default async function CategoriesPage() {
    const categories = await getMarketplaceCategories();

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href="/admin/store"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4"
                >
                    <FaArrowLeft /> Back to Store Manager
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
            </div>

            <div className="max-w-2xl">
                <CategoryManager initialCategories={categories} />
            </div>
        </div>
    );
}
