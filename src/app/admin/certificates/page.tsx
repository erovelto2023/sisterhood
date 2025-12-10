import Link from 'next/link';
import { getCertificateTemplates, deleteCertificateTemplate } from '@/lib/actions/course.actions';
import { FaPlus, FaEdit, FaTrash, FaCertificate } from 'react-icons/fa';

export default async function AdminCertificatesPage() {
    const templates = await getCertificateTemplates();
    // const templates: any[] = [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Certificate Templates</h1>
                    <p className="text-gray-500">Manage designs for course completion certificates.</p>
                </div>
                <Link
                    href="/admin/certificates/new"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                    <FaPlus className="mr-2" /> Create Template
                </Link>
            </div>

            {templates.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCertificate className="text-3xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
                    <p className="text-gray-500 mb-6">Create your first certificate template to start rewarding students.</p>
                    <Link
                        href="/admin/certificates/new"
                        className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
                    >
                        Create Template &rarr;
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template: any) => (
                        <div key={template._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="h-40 bg-gray-100 relative flex items-center justify-center">
                                {template.bgImage ? (
                                    <img src={template.bgImage} alt={template.name} className="w-full h-full object-cover opacity-50" />
                                ) : (
                                    <FaCertificate className="text-4xl text-gray-300" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-xl font-serif font-bold text-gray-800 px-4 text-center">{template.title}</h3>
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-gray-900 mb-1">{template.name}</h4>
                                <p className="text-xs text-gray-500 mb-4">Last updated {new Date(template.updatedAt).toLocaleDateString()}</p>

                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={`/admin/certificates/${template._id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <form action={async () => {
                                        'use server';
                                        await deleteCertificateTemplate(template._id);
                                    }}>
                                        <button
                                            type="submit"
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                if (!confirm('Are you sure?')) e.preventDefault();
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
