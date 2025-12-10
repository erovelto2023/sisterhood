import ArticleForm from '@/components/admin/ArticleForm';
import { getCategories } from '@/lib/actions/kb.actions';

export default async function CreateArticlePage() {
    // Fetch categories for the form
    const categories = await getCategories();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create Article</h1>
                <p className="text-gray-500 mt-2">Write a new knowledge base article.</p>
            </div>

            <ArticleForm categories={categories} />
        </div>
    );
}
