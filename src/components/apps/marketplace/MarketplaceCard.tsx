import Link from 'next/link';
import { FaExchangeAlt, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

interface MarketplaceCardProps {
    listing: any;
}

export default function MarketplaceCard({ listing }: MarketplaceCardProps) {
    return (
        <Link href={`/members/listings/${listing.slug}`} className="group block h-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
                {/* Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                        <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                            No Image
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {listing.mode === 'barter' || listing.mode === 'both' ? (
                            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1">
                                <FaExchangeAlt size={10} /> Barter
                            </span>
                        ) : null}
                        {listing.mode === 'buy' || listing.mode === 'both' ? (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded shadow-sm flex items-center gap-1">
                                <FaTag size={10} /> Buy
                            </span>
                        ) : null}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                            {listing.title}
                        </h3>
                        {listing.price && (
                            <span className="font-bold text-green-700 text-sm">
                                ${listing.price}
                            </span>
                        )}
                    </div>

                    <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">
                        {listing.description}
                    </p>

                    <div className="mt-auto space-y-2">
                        {listing.location?.address && (
                            <div className="flex items-center text-xs text-gray-400">
                                <FaMapMarkerAlt className="mr-1" /> {listing.location.address}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <div className="flex items-center gap-2">
                                <img
                                    src={listing.seller.imageUrl || "https://via.placeholder.com/24"}
                                    alt={listing.seller.firstName}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span className="text-xs text-gray-600 truncate max-w-[100px]">
                                    {listing.seller.firstName}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
