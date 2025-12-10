'use client';

import { useState } from 'react';
import { createMarketplaceCategory, deleteMarketplaceCategory } from '@/lib/actions/marketplace.actions';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function CategoryManager({ initialCategories }: { initialCategories: any[] }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            await createMarketplaceCategory(name, description);
            setName('');
            setDescription('');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to create category');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteMarketplaceCategory(id);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>

            <form onSubmit={handleCreate} className="mb-6 space-y-3">
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category Name"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                    Add Category
                </button>
            </form>

            <div className="space-y-2">
                {initialCategories.map((cat) => (
                    <div key={cat._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                            <div className="font-medium text-sm text-gray-900">{cat.name}</div>
                            <div className="text-xs text-gray-500">{cat.count} listings</div>
                        </div>
                        <button
                            onClick={() => handleDelete(cat._id)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
