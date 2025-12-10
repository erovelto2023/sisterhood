import { getMarketplaceStats, getPendingListings, approveListing, rejectListing } from '@/lib/actions/marketplace.actions';
import Link from 'next/link';
import { FaCheck, FaTimes, FaStore, FaBoxOpen, FaClock, FaList } from 'react-icons/fa';

export default async function StoreManagerPage() {
    const stats = await getMarketplaceStats();
    const pendingListings = await getPendingListings();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Store Management</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Total Stores</h3>
                        <FaStore className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalStores}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Active Listings</h3>
                        <FaBoxOpen className="text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeListings}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Pending Review</h3>
                        <FaClock className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.pendingListings}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 text-sm font-medium">Total Listings</h3>
                        <FaList className="text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalListings}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
                <Link
                    href="/admin/store/categories"
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Manage Categories
                </Link>
            </div>

            {/* Pending Listings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Pending Listings</h2>
                </div>

                {pendingListings.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {pendingListings.map((listing: any) => (
                            <div key={listing._id} className="p-6 flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {listing.images[0] ? (
                                            <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{listing.title}</h3>
                                        <p className="text-sm text-gray-500 mb-1">{listing.description.substring(0, 100)}...</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded">{listing.category.name}</span>
                                            <span>by {listing.seller.firstName} {listing.seller.lastName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <form action={async () => {
                                        'use server';
                                        await approveListing(listing._id);
                                    }}>
                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                                            <FaCheck size={18} />
                                        </button>
                                    </form>
                                    <form action={async () => {
                                        'use server';
                                        await rejectListing(listing._id, 'Violates guidelines');
                                    }}>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                                            <FaTimes size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No listings pending review.
                    </div>
                )}
            </div>
        </div>
    );
}
