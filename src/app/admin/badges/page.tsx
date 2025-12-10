import Link from 'next/link';
import { getBadges, deleteBadge } from '@/lib/actions/badge.actions';
import { FaPlus, FaEdit, FaTrash, FaMedal } from 'react-icons/fa';

export default async function AdminBadgesPage() {
    const badges = await getBadges();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Badges & Gamification</h1>
                    <p className="text-gray-500">Manage achievement badges and rules.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/badges/categories"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Manage Categories
                    </Link>
                    <Link
                        href="/admin/badges/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                    >
                        <FaPlus className="mr-2" /> Create Badge
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rarity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {badges.map((badge: any) => (
                            <tr key={badge._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            {badge.icon ? (
                                                <img className="h-10 w-10 rounded-full object-cover" src={badge.icon} alt="" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                    <FaMedal />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{badge.name}</div>
                                            <div className="text-sm text-gray-500">{badge.points} XP</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {badge.category?.name || 'Uncategorized'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${badge.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                                            badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                                                badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                                    badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                        {badge.rarity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {badge.triggerType === 'manual' ? 'Manual' : `${badge.triggerType} (${badge.requirementCount})`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-3">
                                        <Link href={`/admin/badges/${badge._id}`} className="text-indigo-600 hover:text-indigo-900">
                                            <FaEdit />
                                        </Link>
                                        <form action={async () => {
                                            'use server';
                                            await deleteBadge(badge._id);
                                        }}>
                                            <button className="text-red-600 hover:text-red-900"><FaTrash /></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {badges.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <FaMedal className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                    <p className="text-lg font-medium">No badges created yet</p>
                                    <p className="text-sm mb-4">Start by creating your first achievement badge.</p>
                                    <Link
                                        href="/admin/badges/new"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                                    >
                                        Create Badge
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
