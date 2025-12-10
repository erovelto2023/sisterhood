'use client';

import { useState } from 'react';
import { createBookClub, updateBookClub, deleteBookClub } from '@/lib/actions/book-club.actions';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaBook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function BookClubManager({ initialBookClubs }: { initialBookClubs: any[] }) {
    const [bookClubs, setBookClubs] = useState(initialBookClubs);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingClub, setEditingClub] = useState<any | null>(null);
    const router = useRouter();

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [type, setType] = useState<'ongoing' | 'time_based'>('ongoing');
    const [pace, setPace] = useState<'self_paced' | 'weekly' | 'scheduled'>('self_paced');
    const [visibility, setVisibility] = useState<'public' | 'members_only' | 'invite_only'>('public');
    const [startDate, setStartDate] = useState('');
    const [currentGoal, setCurrentGoal] = useState('');
    const [nextMeeting, setNextMeeting] = useState('');

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCoverImage('');
        setType('ongoing');
        setPace('self_paced');
        setVisibility('public');
        setStartDate('');
        setCurrentGoal('');
        setNextMeeting('');
        setEditingClub(null);
        setIsCreateModalOpen(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBookClub({
                title, description, coverImage, type, pace, visibility,
                startDate: startDate ? new Date(startDate) : undefined,
                currentGoal,
                nextMeeting: nextMeeting ? new Date(nextMeeting) : undefined
            });
            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to create book club');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClub) return;
        try {
            await updateBookClub(editingClub._id, {
                title, description, coverImage, type, pace, visibility,
                startDate: startDate ? new Date(startDate) : undefined,
                currentGoal,
                nextMeeting: nextMeeting ? new Date(nextMeeting) : undefined
            });
            resetForm();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to update book club');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this book club? This cannot be undone.')) return;
        try {
            await deleteBookClub(id);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to delete book club');
        }
    };

    const openEditModal = (club: any) => {
        setEditingClub(club);
        setTitle(club.title);
        setDescription(club.description);
        setCoverImage(club.coverImage || '');
        setType(club.type);
        setPace(club.pace);
        setVisibility(club.visibility);
        setStartDate(club.startDate ? new Date(club.startDate).toISOString().split('T')[0] : '');
        setCurrentGoal(club.currentGoal || '');
        setNextMeeting(club.nextMeeting ? new Date(club.nextMeeting).toISOString().slice(0, 16) : '');
        setIsCreateModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Book Club Manager</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setIsCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                    <FaPlus /> Create Book Club
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Title</th>
                            <th className="p-4 font-semibold text-gray-600">Type</th>
                            <th className="p-4 font-semibold text-gray-600">Pace</th>
                            <th className="p-4 font-semibold text-gray-600">Members</th>
                            <th className="p-4 font-semibold text-gray-600">Books</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {initialBookClubs.map((club) => (
                            <tr key={club._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                            {club.coverImage ? (
                                                <img src={club.coverImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <FaBook />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{club.title}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{club.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="capitalize text-sm text-gray-700">{club.type.replace('_', ' ')}</span>
                                </td>
                                <td className="p-4">
                                    <span className="capitalize text-sm text-gray-700">{club.pace.replace('_', ' ')}</span>
                                </td>
                                <td className="p-4 text-gray-600">{club.membersCount}</td>
                                <td className="p-4 text-gray-600">{club.booksCount}</td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => router.push(`/admin/book-clubs/${club._id}/books`)}
                                        className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Manage Books"
                                    >
                                        <FaBook />
                                    </button>
                                    <button
                                        onClick={() => openEditModal(club)}
                                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(club._id)}
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
                {initialBookClubs.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No book clubs found. Create one to get started.
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800">
                                {editingClub ? 'Edit Book Club' : 'Create New Book Club'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={editingClub ? handleUpdate : handleCreate} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none h-24"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                                    <input
                                        type="text"
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as any)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    >
                                        <option value="ongoing">Ongoing</option>
                                        <option value="time_based">Time Based</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pace</label>
                                    <select
                                        value={pace}
                                        onChange={(e) => setPace(e.target.value as any)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    >
                                        <option value="self_paced">Self Paced</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="scheduled">Scheduled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                                    <select
                                        value={visibility}
                                        onChange={(e) => setVisibility(e.target.value as any)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    >
                                        <option value="public">Public</option>
                                        <option value="members_only">Members Only</option>
                                        <option value="invite_only">Invite Only</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Goal (e.g. Ch 1-3)</label>
                                    <input
                                        type="text"
                                        value={currentGoal}
                                        onChange={(e) => setCurrentGoal(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Meeting</label>
                                    <input
                                        type="datetime-local"
                                        value={nextMeeting}
                                        onChange={(e) => setNextMeeting(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium"
                                >
                                    {editingClub ? 'Update Club' : 'Create Club'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
