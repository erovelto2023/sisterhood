'use client';

import { useEffect, useState } from 'react';
import { getCertificateById } from '@/lib/actions/course.actions';
import { useParams } from 'next/navigation';

export default function CertificateViewPage() {
    const { id } = useParams();
    const [certificate, setCertificate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCert = async () => {
            if (typeof id === 'string') {
                const cert = await getCertificateById(id);
                // const cert = null;
                if (!cert) {
                    // Handle not found
                    setLoading(false);
                    return;
                }
                setCertificate(cert);
                setLoading(false);
            }
        };
        fetchCert();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!certificate) return <div className="min-h-screen flex items-center justify-center">Certificate not found</div>;

    const { template, user, course, issueDate, certificateId } = certificate;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 print:bg-white print:p-0">
            <div className="mb-8 print:hidden flex space-x-4">
                <button
                    onClick={() => window.print()} // This will need to be a client component wrapper or script
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:bg-purple-700 transition-colors"
                >
                    Print / Download PDF
                </button>
            </div>

            <div
                className="bg-white w-[1123px] h-[794px] relative shadow-2xl print:shadow-none print:w-full print:h-full flex flex-col items-center justify-center p-16 text-center overflow-hidden"
                style={{
                    color: template.textColor,
                    backgroundImage: template.bgImage ? `url(${template.bgImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Border/Frame */}
                <div className="absolute inset-8 border-8 border-double border-opacity-30" style={{ borderColor: template.textColor }}></div>

                <div className="relative z-10 space-y-6 w-full max-w-3xl">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-5xl md:text-6xl font-serif font-bold uppercase tracking-widest mb-4">
                            {template.title}
                        </h1>
                        {template.subtitle && (
                            <p className="text-2xl font-light uppercase tracking-wide opacity-80">{template.subtitle}</p>
                        )}
                    </div>

                    {/* Body */}
                    <div className="space-y-8">
                        <p className="text-xl opacity-80">This is to certify that</p>

                        <div className="py-4">
                            <h2 className="text-5xl font-script font-bold border-b-2 border-opacity-30 inline-block px-12 pb-2" style={{ borderColor: template.textColor }}>
                                {user.firstName} {user.lastName}
                            </h2>
                        </div>

                        <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                            {template.description}
                        </p>

                        <div className="py-6">
                            <h3 className="text-3xl font-bold">{course.title}</h3>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end mt-20 pt-12 w-full px-12">
                        {template.showDate && (
                            <div className="text-center min-w-[200px]">
                                <p className="text-xl font-medium mb-2">{new Date(issueDate).toLocaleDateString()}</p>
                                <div className="border-t border-opacity-40 pt-2" style={{ borderColor: template.textColor }}>
                                    <p className="text-sm opacity-70 uppercase tracking-wider">Date Issued</p>
                                </div>
                            </div>
                        )}

                        {template.signatureImage ? (
                            <div className="text-center min-w-[200px]">
                                <div className="h-16 mb-2 flex items-end justify-center">
                                    <img src={template.signatureImage} alt="Signature" className="max-h-full object-contain" />
                                </div>
                                <div className="border-t border-opacity-40 pt-2" style={{ borderColor: template.textColor }}>
                                    <p className="text-sm opacity-70 uppercase tracking-wider">Instructor</p>
                                </div>
                            </div>
                        ) : template.showInstructor && (
                            <div className="text-center min-w-[200px]">
                                <p className="font-script text-3xl mb-2">Instructor Name</p>
                                <div className="border-t border-opacity-40 pt-2" style={{ borderColor: template.textColor }}>
                                    <p className="text-sm opacity-70 uppercase tracking-wider">Instructor</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {template.showId && (
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <p className="text-xs opacity-50 font-mono">Certificate ID: {certificateId}</p>
                            <p className="text-[10px] opacity-40 mt-1">Verify at {process.env.NEXT_PUBLIC_APP_URL}/certificates/{certificate._id}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
