'use client';

import { useState } from 'react';
import { createListingConversation } from '@/lib/actions/marketplace.actions';
import { useRouter } from 'next/navigation';
import { FaPaperPlane } from 'react-icons/fa';

export default function ContactSellerButton({ listingId, sellerName }: { listingId: string, sellerName: string }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState(`Hi ${sellerName}, is this still available?`);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
            const conversation = await createListingConversation(listingId, message);
            // Redirect to messages
            router.push(`/members/messages?conversationId=${conversation._id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to send message');
            setLoading(false);
        }
    };

    if (isOpen) {
        return (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message to {sellerName}</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-amber-500 outline-none"
                    rows={3}
                />
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? 'Sending...' : <><FaPaperPlane size={12} /> Send Message</>}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsOpen(true)}
            className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
            <FaPaperPlane /> Message Seller
        </button>
    );
}
