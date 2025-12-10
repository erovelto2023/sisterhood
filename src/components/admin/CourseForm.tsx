'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse, updateCourse } from '@/lib/actions/course.actions';
import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';
import { FaImage, FaSave } from 'react-icons/fa';

import { useEffect } from 'react';
import { getCertificateTemplates } from '@/lib/actions/course.actions';

interface CourseFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function CourseForm({ initialData, isEditing = false }: CourseFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [certificateTemplates, setCertificateTemplates] = useState([]);

    useEffect(() => {
        const fetchTemplates = async () => {
            const templates = await getCertificateTemplates();
            setCertificateTemplates(templates);
        };
        fetchTemplates();
    }, []);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        shortDescription: initialData?.shortDescription || '',
        category: initialData?.category || '',
        level: initialData?.level || 'beginner',
        price: initialData?.price || 0,
        isFree: initialData?.isFree || false,
        status: initialData?.status || 'draft',
        thumbnail: initialData?.thumbnail || '',
        certificateTemplate: initialData?.certificateTemplate || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing && initialData?._id) {
                await updateCourse(initialData._id, formData);
                alert('Course updated successfully!');
            } else {
                const newCourse = await createCourse(formData);
                alert('Course created successfully!');
                router.push(`/admin/courses/${newCourse._id}`);
            }
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-lg font-medium"
                                    placeholder="e.g. Master React in 30 Days"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                <textarea
                                    name="shortDescription"
                                    rows={2}
                                    value={formData.shortDescription}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="Brief overview for course cards..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={10}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="Detailed course information..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Publishing</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 flex items-center justify-center disabled:opacity-50"
                            >
                                <FaSave className="mr-2" />
                                {loading ? 'Saving...' : 'Save Course'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Development">Development</option>
                                    <option value="Business">Business</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    disabled={formData.isFree}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isFree"
                                    id="isFree"
                                    checked={formData.isFree}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, isFree: e.target.checked, price: e.target.checked ? 0 : prev.price }));
                                    }}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isFree" className="ml-2 block text-sm text-gray-900">
                                    This course is free
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Template</label>
                                <select
                                    name="certificateTemplate"
                                    value={formData.certificateTemplate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">No Certificate</option>
                                    {certificateTemplates.map((template: any) => (
                                        <option key={template._id} value={template._id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Thumbnail</h3>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50">
                            {formData.thumbnail ? (
                                <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden">
                                    <Image
                                        src={formData.thumbnail}
                                        alt="Thumbnail"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-4 text-center">
                                    <FaImage className="mx-auto h-8 w-8 text-gray-300" />
                                </div>
                            )}
                            <UploadButton
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                endpoint={"galleryImage" as any}
                                onClientUploadComplete={(res) => {
                                    if (res && res[0]) {
                                        setFormData(prev => ({ ...prev, thumbnail: res[0].url }));
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
        </form>
    );
}
