import { getListingBySlug } from '@/lib/actions/marketplace.actions';
import ContactSellerButton from '@/components/apps/marketplace/ContactSellerButton';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { FaMapMarkerAlt, FaTag, FaExchangeAlt, FaStore, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const listing = await getListingBySlug(slug);

    if (!listing) notFound();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    href="/members/listings"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6"
                >
                    <FaArrowLeft /> Back to Listings
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Images */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="aspect-[4/3] bg-gray-100 relative">
                                {listing.images && listing.images.length > 0 ? (
                                    <img
                                        src={listing.images[0]}
                                        alt={listing.title}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            {/* Thumbnails if multiple images */}
                            {listing.images && listing.images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto">
                                    {listing.images.map((img: string, i: number) => (
                                        <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                {listing.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details & Action */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                                            {listing.category.name}
                                        </span>
                                        <span>•</span>
                                        <span>Posted {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {(listing.mode === 'buy' || listing.mode === 'both') && listing.price && (
                                    <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-xl">
                                        <FaTag size={20} />
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider opacity-70">Price</div>
                                            <div className="text-xl font-bold">${listing.price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                )}

                                {(listing.mode === 'barter' || listing.mode === 'both') && (
                                    <div className="flex items-center gap-3 text-purple-700 bg-purple-50 p-3 rounded-xl">
                                        <FaExchangeAlt size={20} />
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wider opacity-70">Looking For</div>
                                            <div className="font-medium">{listing.tradePreferences || 'Open to offers'}</div>
                                        </div>
                                    </div>
                                )}

                                {listing.location?.address && (
                                    <div className="flex items-center gap-2 text-gray-600 p-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        <span>{listing.location.address}</span>
                                        {listing.location.type === 'local' && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Local Pickup</span>}
                                    </div>
                                )}
                            </div>

                            <ContactSellerButton listingId={listing._id} sellerName={listing.seller.firstName} />

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-400">
                                    Safety Tip: Keep conversations inside the platform. Never wire money.
                                </p>
                            </div>
                        </div>

                        {/* Seller Profile */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Seller Information</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={listing.seller.imageUrl || "https://via.placeholder.com/48"}
                                    alt={listing.seller.firstName}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <div className="font-bold text-gray-900">{listing.seller.firstName} {listing.seller.lastName}</div>
                                    <div className="text-sm text-gray-500">{listing.seller.headline || 'Member'}</div>
                                </div>
                            </div>

                            {listing.store && (
                                <Link
                                    href={`/members/listings/store/${listing.store.slug}`}
                                    className="block w-full py-2 text-center border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    View Store Profile
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
