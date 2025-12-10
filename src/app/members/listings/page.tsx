import { getListings, getMarketplaceCategories, getMyStore } from '@/lib/actions/marketplace.actions';
import MarketplaceCard from '@/components/apps/marketplace/MarketplaceCard';
import Link from 'next/link';
import { FaPlus, FaSearch, FaStore } from 'react-icons/fa';

export default async function MarketplacePage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const search = typeof params.search === 'string' ? params.search : undefined;
    const mode = typeof params.mode === 'string' ? params.mode : undefined;

    const { listings } = await getListings({ category, search, mode, limit: 20 });
    const categories = await getMarketplaceCategories();
    const myStore = await getMyStore();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Browse Listings</h1>

                        <div className="flex-1 max-w-lg mx-auto w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for items, services..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {myStore && (
                                <Link
                                    href={`/members/listings/store/${myStore.slug}`}
                                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                    title="My Store"
                                >
                                    <FaStore size={20} />
                                </Link>
                            )}
                            <Link
                                href="/members/listings/new"
                                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors shadow-sm"
                            >
                                <FaPlus size={14} /> Sell or Trade
                            </Link>
                        </div>
                    </div>

                    {/* Categories & Filters */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                        <Link
                            href="/members/listings"
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!category && !mode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All Items
                        </Link>
                        <Link
                            href="/members/listings?mode=barter"
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${mode === 'barter' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                }`}
                        >
                            Barter Only
                        </Link>
                        <div className="w-px h-6 bg-gray-300 mx-2"></div>
                        {categories.map((cat: any) => (
                            <Link
                                key={cat._id}
                                href={`/members/listings?category=${cat._id}`}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === cat._id ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {listings.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {listings.map((listing: any) => (
                            <MarketplaceCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <FaStore size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No items found</h3>
                        <p className="text-gray-500">Try adjusting your filters or be the first to list something!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
