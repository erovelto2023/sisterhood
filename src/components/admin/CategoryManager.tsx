'use client';

import { useState } from 'react';
import { createCategory, deleteCategory } from '@/lib/actions/kb.actions';
import { FaTrash, FaPlus, FaFolder } from 'react-icons/fa';

export default function CategoryManager({ categories }: { categories: any[] }) {
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setLoading(true);
        try {
            await createCategory({ name: newCategory });
            setNewCategory('');
        } catch (error) {
            console.error(error);
            alert('Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This category must be empty to delete.')) return;
        try {
            await deleteCategory(id);
        } catch (error) {
            console.error(error);
            alert('Failed to delete category. Ensure it has no articles.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>

            <form onSubmit={handleCreate} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category Name"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                    <FaPlus />
                </button>
            </form>

            <div className="space-y-2">
                {categories.map((cat) => (
                    <div key={cat._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
                        <div className="flex items-center">
                            <FaFolder className="text-purple-400 mr-3" />
                            <span className="font-medium text-gray-700">{cat.name}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(cat._id)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
                {categories.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No categories yet.</p>
                )}
            </div>
        </div>
    );
}
