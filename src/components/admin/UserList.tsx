'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateUserStatus, updateUserRole, deleteUser } from '@/lib/actions/admin.actions';
import { FaSearch, FaTrash, FaBan, FaCheck, FaUserShield, FaUser } from 'react-icons/fa';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    role: 'admin' | 'moderator' | 'member';
    status: 'active' | 'suspended';
    createdAt: string;
}

interface UserListProps {
    users: User[];
    totalPages: number;
    currentPage: number;
    totalUsers: number;
    query?: string;
}

export default function UserList({ users, totalPages, currentPage, totalUsers, query }: UserListProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(query || '');
    const [loading, setLoading] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/users?query=${searchTerm}&page=1`);
    };

    const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
        setLoading(userId);
        try {
            await updateUserStatus(userId, newStatus);
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        } finally {
            setLoading(null);
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'moderator' | 'member') => {
        if (!confirm(`Are you sure you want to change role to ${newRole}?`)) return;
        setLoading(userId);
        try {
            await updateUserRole(userId, newRole);
        } catch (error) {
            console.error(error);
            alert('Failed to update role');
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        setLoading(userId);
        try {
            await deleteUser(userId);
        } catch (error) {
            console.error(error);
            alert('Failed to delete user');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{users.length}</span> of <span className="font-medium">{totalUsers}</span> users
                </div>
                <form onSubmit={handleSearch} className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </form>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                            <Image
                                                src={user.imageUrl || '/placeholder-avatar.png'}
                                                alt={user.firstName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role || 'member'}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value as any)}
                                        disabled={loading === user._id}
                                        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2"
                                    >
                                        <option value="member">Member</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.status || 'active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    {user.status === 'suspended' ? (
                                        <button
                                            onClick={() => handleStatusChange(user._id, 'active')}
                                            disabled={loading === user._id}
                                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Activate"
                                        >
                                            <FaCheck />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStatusChange(user._id, 'suspended')}
                                            disabled={loading === user._id}
                                            className="text-orange-600 hover:text-orange-900 p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                            title="Suspend"
                                        >
                                            <FaBan />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        disabled={loading === user._id}
                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-6 border-t border-gray-100 flex justify-center space-x-2">
                    <button
                        disabled={currentPage <= 1}
                        onClick={() => router.push(`/admin/users?query=${searchTerm}&page=${currentPage - 1}`)}
                        className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage >= totalPages}
                        onClick={() => router.push(`/admin/users?query=${searchTerm}&page=${currentPage + 1}`)}
                        className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
