'use client';

import { useState } from 'react';
import { updateSpace, deleteSpace, createSpace } from '@/lib/actions/community.actions';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function CommunityManager({ initialSpaces }: { initialSpaces: any[] }) {
    const [spaces, setSpaces] = useState(initialSpaces);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSpace, setEditingSpace] = useState<any | null>(null);
    const router = useRouter();

    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'public' | 'private' | 'secret'>('public');

    const resetForm = () => {
        setName('');
        setDescription('');
        setType('public');
        setEditingSpace(null);
        setIsCreateModalOpen(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createSpace({ name, description, type });
            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to create space');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSpace) return;
        try {
            await updateSpace(editingSpace._id, { name, description, type });
            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to update space');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this space? This cannot be undone.')) return;
        try {
            await deleteSpace(id);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to delete space');
        }
    };

    const openEditModal = (space: any) => {
        setEditingSpace(space);
        setName(space.name);
        setDescription(space.description);
        setType(space.type);
        setIsCreateModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Community Manager</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setIsCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    <FaPlus /> Create Space
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Name</th>
                            <th className="p-4 font-semibold text-gray-600">Type</th>
                            <th className="p-4 font-semibold text-gray-600">Members</th>
                            <th className="p-4 font-semibold text-gray-600">Posts</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {initialSpaces.map((space) => (
                            <tr key={space._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{space.name}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{space.description}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                        ${space.type === 'public' ? 'bg-green-100 text-green-700' :
                                            space.type === 'private' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'}`}>
                                        {space.type}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{space.membersCount}</td>
                                <td className="p-4 text-gray-600">{space.postsCount}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => openEditModal(space)}
                                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(space._id)}
                                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {initialSpaces.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No spaces found. Create one to get started.
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800">
                                {editingSpace ? 'Edit Space' : 'Create New Space'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={editingSpace ? handleUpdate : handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Space Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="secret">Secret</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                                >
                                    {editingSpace ? 'Update Space' : 'Create Space'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
