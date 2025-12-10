import BadgeForm from '@/components/admin/BadgeForm';
import { getBadgeCategories, getBadgeById } from '@/lib/actions/badge.actions';
import { notFound } from 'next/navigation';

export default async function EditBadgePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [badge, categories] = await Promise.all([
        getBadgeById(id),
        getBadgeCategories()
    ]);

    if (!badge) notFound();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Badge</h1>
                <p className="text-gray-500">Update badge details and rules.</p>
            </div>
            <BadgeForm initialData={badge} categories={categories} isEdit />
        </div>
    );
}
