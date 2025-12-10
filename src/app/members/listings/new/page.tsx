import { getMarketplaceCategories } from '@/lib/actions/marketplace.actions';
import ListingForm from '@/components/apps/marketplace/ListingForm';

export default async function NewListingPage() {
    const categories = await getMarketplaceCategories();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <ListingForm categories={categories} />
        </div>
    );
}
