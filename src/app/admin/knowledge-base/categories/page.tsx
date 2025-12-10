import { getCategories } from '@/lib/actions/kb.actions';
import CategoryManager from '@/components/admin/CategoryManager';

export default async function AdminCategoriesPage() {
    const categories = await getCategories();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                <p className="text-gray-500 mt-2">Organize your knowledge base content.</p>
            </div>

            <div className="max-w-2xl">
                <CategoryManager categories={categories} />
            </div>
        </div>
    );
}
