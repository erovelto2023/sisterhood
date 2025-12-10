'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/lib/actions/marketplace.actions';
import { UploadButton } from '@/lib/uploadthing';
import { FaImage, FaTimes, FaExchangeAlt, FaTag } from 'react-icons/fa';

interface ListingFormProps {
    categories: any[];
}

export default function ListingForm({ categories }: ListingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [type, setType] = useState<'product' | 'service'>('product');
    const [mode, setMode] = useState<'barter' | 'buy' | 'both'>('barter');
    const [price, setPrice] = useState('');
    const [tradePreferences, setTradePreferences] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [locationType, setLocationType] = useState<'local' | 'online'>('local');
    const [address, setAddress] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !categoryId) return alert('Please fill in all required fields');
        if (images.length === 0) return alert('Please upload at least one image');

        setLoading(true);
        try {
            await createListing({
                title,
                description,
                category: categoryId,
                type,
                mode,
                price: price ? parseFloat(price) : undefined,
                tradePreferences,
                images,
                location: {
                    type: locationType,
                    address: locationType === 'local' ? address : undefined
                }
            });
            router.push('/members/listings');
        } catch (error) {
            console.error(error);
            alert('Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h1 className="text-xl font-bold text-gray-900">Create New Listing</h1>
                <p className="text-sm text-gray-500">List an item or service for trade or sale.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Type & Mode */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">What are you listing?</label>
                        <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => setType('product')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'product' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Item
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('service')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'service' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Service
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Mode</label>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as any)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                        >
                            <option value="barter">Barter Only</option>
                            <option value="buy">Buy Only</option>
                            <option value="both">Barter & Buy</option>
                        </select>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="e.g. Vintage Lamp"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none h-32"
                            placeholder="Describe your item..."
                            required
                        />
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                    <div className="grid grid-cols-3 gap-4">
                        {images.map((url, index) => (
                            <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600"
                                >
                                    <FaTimes size={10} />
                                </button>
                            </div>
                        ))}
                        {images.length < 5 && (
                            <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                <UploadButton
                                    endpoint="galleryImage"
                                    onClientUploadComplete={(res) => {
                                        if (res && res[0]) setImages([...images, res[0].url]);
                                    }}
                                    onUploadError={(error: Error) => {
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                    appearance={{
                                        button: "bg-transparent text-gray-500 hover:text-gray-700 w-full h-full",
                                        allowedContent: "hidden"
                                    }}
                                    content={{
                                        button: <div className="flex flex-col items-center"><FaImage size={24} className="mb-1" /><span className="text-xs">Add Photo</span></div>
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Trade/Price Details */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 space-y-4">
                    {(mode === 'barter' || mode === 'both') && (
                        <div>
                            <label className="block text-sm font-medium text-amber-900 mb-1 flex items-center gap-2">
                                <FaExchangeAlt /> What are you looking for?
                            </label>
                            <input
                                type="text"
                                value={tradePreferences}
                                onChange={(e) => setTradePreferences(e.target.value)}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="e.g. Gardening tools, Books, or Open to offers"
                            />
                        </div>
                    )}
                    {(mode === 'buy' || mode === 'both') && (
                        <div>
                            <label className="block text-sm font-medium text-green-900 mb-1 flex items-center gap-2">
                                <FaTag /> Price ($)
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                    )}
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="flex gap-4 mb-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="radio"
                                checked={locationType === 'local'}
                                onChange={() => setLocationType('local')}
                            /> Local Pickup
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="radio"
                                checked={locationType === 'online'}
                                onChange={() => setLocationType('online')}
                            /> Online / Remote
                        </label>
                    </div>
                    {locationType === 'local' && (
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="City, Neighborhood, or Zip Code"
                        />
                    )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Post Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
}
