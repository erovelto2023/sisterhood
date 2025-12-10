'use client';

import { useState } from 'react';
import { createBadge, updateBadge } from '@/lib/actions/badge.actions';
import { useRouter } from 'next/navigation';
import { UploadButton } from '@/lib/uploadthing';

interface BadgeFormProps {
    initialData?: any;
    categories: any[];
    isEdit?: boolean;
}

export default function BadgeForm({ initialData, categories, isEdit = false }: BadgeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        icon: initialData?.icon || '',
        category: initialData?.category?._id || initialData?.category || '',
        rarity: initialData?.rarity || 'common',
        points: initialData?.points || 0,
        triggerType: initialData?.triggerType || 'manual',
        requirementCount: initialData?.requirementCount || 1,
        specificEntityId: initialData?.specificEntityId || '',
        isHidden: initialData?.isHidden ?? false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit && initialData?._id) {
                await updateBadge(initialData._id, formData);
            } else {
                await createBadge(formData);
            }
            router.push('/admin/badges');
        } catch (error) {
            console.error(error);
            alert('Failed to save badge');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">{isEdit ? 'Edit Badge' : 'Create New Badge'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat: any) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        required
                    />
                </div>

                {/* Icon Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge Icon</label>
                    <div className="flex items-center gap-4">
                        {formData.icon && (
                            <div className="relative h-20 w-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                <img src={formData.icon} alt="Icon" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: '' })}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl text-xs"
                                >
                                    X
                                </button>
                            </div>
                        )}
                        <UploadButton
                            endpoint="galleryImage"
                            onClientUploadComplete={(res) => {
                                if (res && res[0]) {
                                    setFormData({ ...formData, icon: res[0].url });
                                }
                            }}
                            onUploadError={(error: Error) => {
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>
                </div>

                {/* Rarity & Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
                        <select
                            value={formData.rarity}
                            onChange={(e) => setFormData({ ...formData, rarity: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="common">Common</option>
                            <option value="uncommon">Uncommon</option>
                            <option value="rare">Rare</option>
                            <option value="epic">Epic</option>
                            <option value="legendary">Legendary</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Points (XP)</label>
                        <input
                            type="number"
                            value={formData.points}
                            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Triggers */}
                <div className="border-t pt-6">
                    <h3 className="text-md font-bold text-gray-900 mb-4">Unlock Conditions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
                            <select
                                value={formData.triggerType}
                                onChange={(e) => setFormData({ ...formData, triggerType: e.target.value as any })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="manual">Manual (Admin Only)</option>
                                <option value="course_completion">Course Completion</option>
                                <option value="lesson_completion">Lesson Completion</option>
                                <option value="community_post">Community Posts</option>
                                <option value="login_streak">Login Streak (Days)</option>
                            </select>
                        </div>

                        {formData.triggerType !== 'manual' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Requirement Count</label>
                                <input
                                    type="number"
                                    value={formData.requirementCount}
                                    onChange={(e) => setFormData({ ...formData, requirementCount: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    min="1"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    e.g., "5" courses, "10" posts, "7" days streak.
                                </p>
                            </div>
                        )}

                        {formData.triggerType === 'course_completion' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Course ID (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.specificEntityId}
                                    onChange={(e) => setFormData({ ...formData, specificEntityId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Leave empty for 'Any Course'"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Options */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={formData.isHidden}
                        onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })}
                        className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Hidden Badge (Surprise)</span>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Update Badge' : 'Create Badge')}
                    </button>
                </div>
            </form>
        </div>
    );
}
