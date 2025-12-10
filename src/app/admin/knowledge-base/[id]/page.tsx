import ArticleForm from '@/components/admin/ArticleForm';
import { getArticleById, getCategories } from '@/lib/actions/kb.actions';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticleById(id);
    const categories = await getCategories();

    if (!article) {
        notFound();
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
                <p className="text-gray-500 mt-2">Update existing content.</p>
            </div>

            <ArticleForm initialData={article} categories={categories} isEditing={true} />
        </div>
    );
}
