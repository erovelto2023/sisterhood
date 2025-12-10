import Link from 'next/link';
import { getUserCertificates } from '@/lib/actions/course.actions';
import { FaCertificate, FaDownload, FaCalendarAlt } from 'react-icons/fa';

export default async function MyCertificatesPage() {
    const certificates = await getUserCertificates();

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
                    <p className="text-gray-500 mt-1">View and download your earned certificates.</p>
                </div>
            </div>

            {certificates.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCertificate className="text-4xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No certificates yet</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Complete courses to earn certificates. Once you finish a course, your certificate will appear here.
                    </p>
                    <Link
                        href="/members/courses"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert: any) => (
                        <div key={cert._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="h-48 bg-gray-50 relative flex items-center justify-center p-4">
                                {cert.template.bgImage ? (
                                    <img src={cert.template.bgImage} alt="Certificate" className="w-full h-full object-cover opacity-80" />
                                ) : (
                                    <div className="text-center">
                                        <FaCertificate className="text-5xl text-gray-300 mx-auto mb-2" />
                                        <span className="text-gray-400 font-serif text-lg">{cert.template.title}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Link
                                        href={`/certificates/${cert._id}`}
                                        target="_blank"
                                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
                                    >
                                        View Certificate
                                    </Link>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{cert.course.title}</h3>
                                <p className="text-sm text-gray-500 mb-4">{cert.template.title}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-xs text-gray-500">
                                        <FaCalendarAlt className="mr-1.5" />
                                        {new Date(cert.issueDate).toLocaleDateString()}
                                    </div>
                                    <Link
                                        href={`/certificates/${cert._id}`}
                                        target="_blank"
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
                                    >
                                        <FaDownload className="mr-1.5" /> Download
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
