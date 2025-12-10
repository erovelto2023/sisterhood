'use client';

import { useState } from 'react';
import { createCertificateTemplate, updateCertificateTemplate } from '@/lib/actions/course.actions';
import { useRouter } from 'next/navigation';
import { UploadButton } from '@/lib/uploadthing';

interface CertificateFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function CertificateForm({ initialData, isEdit = false }: CertificateFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        title: initialData?.title || 'Certificate of Completion',
        subtitle: initialData?.subtitle || '',
        description: initialData?.description || 'This certifies that the student has successfully completed the course.',
        bgImage: initialData?.bgImage || '',
        signatureImage: initialData?.signatureImage || '',
        textColor: initialData?.textColor || '#000000',
        showDate: initialData?.showDate ?? true,
        showId: initialData?.showId ?? true,
        showInstructor: initialData?.showInstructor ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit && initialData?._id) {
                await updateCertificateTemplate(initialData._id, formData);
            } else {
                await createCertificateTemplate(formData);
            }
            router.push('/admin/certificates');
        } catch (error) {
            console.error(error);
            alert('Failed to save template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Template Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Template Name (Internal)</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Optional)</label>
                        <input
                            type="text"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description Text</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
                        {formData.bgImage && (
                            <div className="mb-2 relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden">
                                <img src={formData.bgImage} alt="Background" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, bgImage: '' })}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        <UploadButton
                            endpoint="galleryImage"
                            onClientUploadComplete={(res) => {
                                if (res && res[0]) {
                                    setFormData({ ...formData, bgImage: res[0].url });
                                }
                            }}
                            onUploadError={(error: Error) => {
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Signature Image</label>
                        {formData.signatureImage && (
                            <div className="mb-2 relative h-16 w-32 bg-gray-100 rounded-lg overflow-hidden">
                                <img src={formData.signatureImage} alt="Signature" className="w-full h-full object-contain" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, signatureImage: '' })}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        <UploadButton
                            endpoint="galleryImage"
                            onClientUploadComplete={(res) => {
                                if (res && res[0]) {
                                    setFormData({ ...formData, signatureImage: res[0].url });
                                }
                            }}
                            onUploadError={(error: Error) => {
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                        <input
                            type="color"
                            value={formData.textColor}
                            onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                            className="w-full h-10 p-1 rounded-lg border border-gray-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.showDate}
                                onChange={(e) => setFormData({ ...formData, showDate: e.target.checked })}
                                className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Show Completion Date</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.showId}
                                onChange={(e) => setFormData({ ...formData, showId: e.target.checked })}
                                className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Show Certificate ID</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.showInstructor}
                                onChange={(e) => setFormData({ ...formData, showInstructor: e.target.checked })}
                                className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700">Show Instructor Name</span>
                        </label>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update Template' : 'Create Template')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
                <div
                    className="bg-white w-full aspect-[1.414/1] relative shadow-lg flex flex-col items-center justify-center p-8 text-center"
                    style={{
                        color: formData.textColor,
                        backgroundImage: formData.bgImage ? `url(${formData.bgImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Border/Frame (Optional visual flair) */}
                    <div className="absolute inset-4 border-4 border-double border-opacity-20" style={{ borderColor: formData.textColor }}></div>

                    <div className="relative z-10 space-y-4 w-full max-w-lg">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-widest">
                            {formData.title}
                        </h1>

                        {formData.subtitle && (
                            <p className="text-lg font-light uppercase tracking-wide opacity-80">{formData.subtitle}</p>
                        )}

                        <div className="my-8">
                            <p className="text-sm opacity-70 mb-2">This is to certify that</p>
                            <p className="text-2xl md:text-3xl font-script font-bold my-2 border-b border-opacity-30 inline-block px-8 pb-1" style={{ borderColor: formData.textColor }}>
                                Jane Doe
                            </p>
                        </div>

                        <p className="text-sm md:text-base leading-relaxed opacity-90">
                            {formData.description}
                        </p>

                        <div className="my-4">
                            <p className="text-xl font-bold">Introduction to Sisterhood</p>
                        </div>

                        <div className="flex justify-between items-end mt-12 pt-8 w-full px-8">
                            {formData.showDate && (
                                <div className="text-center">
                                    <p className="text-xs opacity-60 border-t border-opacity-30 pt-1" style={{ borderColor: formData.textColor }}>Date</p>
                                    <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
                                </div>
                            )}

                            {formData.signatureImage ? (
                                <div className="text-center">
                                    <img src={formData.signatureImage} alt="Signature" className="h-12 object-contain mb-1 mx-auto" />
                                    <p className="text-xs opacity-60 border-t border-opacity-30 pt-1" style={{ borderColor: formData.textColor }}>Instructor</p>
                                </div>
                            ) : formData.showInstructor && (
                                <div className="text-center">
                                    <p className="font-script text-lg">Instructor Name</p>
                                    <p className="text-xs opacity-60 border-t border-opacity-30 pt-1" style={{ borderColor: formData.textColor }}>Instructor</p>
                                </div>
                            )}
                        </div>

                        {formData.showId && (
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <p className="text-[10px] opacity-50">Certificate ID: CERT-SAMPLE-12345</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
