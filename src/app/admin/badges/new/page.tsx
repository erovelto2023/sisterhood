import BadgeForm from '@/components/admin/BadgeForm';
import { getBadgeCategories } from '@/lib/actions/badge.actions';

export default async function NewBadgePage() {
    const categories = await getBadgeCategories();

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Badge</h1>
                <p className="text-gray-500">Define a new achievement and its unlock rules.</p>
            </div>
            <BadgeForm categories={categories} />
        </div>
    );
}
