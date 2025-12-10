'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent, updateEvent } from '@/lib/actions/event.actions';
import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt, FaVideo, FaDollarSign, FaUsers, FaImage } from 'react-icons/fa';

interface EventFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function EventForm({ initialData, isEditing = false }: EventFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        category: initialData?.category || 'Workshop',
        tags: initialData?.tags?.join(', ') || '',
        coverImageUrl: initialData?.coverImageUrl || '',

        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
        endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',

        accessType: initialData?.accessType || 'members_only',
        price: initialData?.price || 0,
        capacity: initialData?.capacity || 0,

        locationType: initialData?.locationType || 'virtual',
        virtualLink: initialData?.virtualLink || '',
        address: initialData?.address || '',

        status: initialData?.status || 'draft',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const eventData = {
                ...formData,
                tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
                price: Number(formData.price),
                capacity: Number(formData.capacity),
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
            };

            if (isEditing && initialData?._id) {
                await updateEvent(initialData._id, eventData);
                alert('Event updated successfully!');
            } else {
                await createEvent(eventData);
                alert('Event created successfully!');
                router.push('/admin/events');
            }
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-3 text-purple-600">1</span>
                    Event Details
                </h3>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g. Monthly Mastermind Call"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Describe what this event is about..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="Workshop">Workshop</option>
                                <option value="Webinar">Webinar</option>
                                <option value="Masterclass">Masterclass</option>
                                <option value="Meetup">Meetup</option>
                                <option value="Coaching">Coaching Call</option>
                                <option value="Conference">Conference</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Beginner, Marketing, Healing"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50">
                            {formData.coverImageUrl ? (
                                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                                    <Image
                                        src={formData.coverImageUrl}
                                        alt="Cover"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, coverImageUrl: '' }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-4 text-center">
                                    <FaImage className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-1 text-sm text-gray-500">Upload a banner image</p>
                                </div>
                            )}
                            <UploadButton
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                endpoint={"galleryImage" as any} // Reusing gallery endpoint for now
                                onClientUploadComplete={(res) => {
                                    if (res && res[0]) {
                                        setFormData(prev => ({ ...prev, coverImageUrl: res[0].url }));
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600">2</span>
                    Date & Time
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                name="startDate"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                name="endDate"
                                required
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 p-2 rounded-lg mr-3 text-green-600">3</span>
                    Location
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                        <div className="flex space-x-4">
                            {['virtual', 'in_person', 'hybrid'].map((type) => (
                                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="locationType"
                                        value={type}
                                        checked={formData.locationType === type}
                                        onChange={handleChange}
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="capitalize">{type.replace('_', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {(formData.locationType === 'virtual' || formData.locationType === 'hybrid') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Virtual Meeting Link</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    name="virtualLink"
                                    value={formData.virtualLink}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="https://zoom.us/j/..."
                                />
                                <FaVideo className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>
                    )}

                    {(formData.locationType === 'in_person' || formData.locationType === 'hybrid') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="123 Event St, City, Country"
                                />
                                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Access & Pricing */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="bg-yellow-100 p-2 rounded-lg mr-3 text-yellow-600">4</span>
                    Access & Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Access Type</label>
                        <select
                            name="accessType"
                            value={formData.accessType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="public">Public</option>
                            <option value="members_only">Members Only</option>
                            <option value="paid">Paid Ticket</option>
                        </select>
                    </div>

                    {formData.accessType === 'paid' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <FaDollarSign className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (0 for unlimited)</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="capacity"
                                min="0"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <FaUsers className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Status & Submit */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
                    </button>
                </div>
            </div>
        </form>
    );
}
