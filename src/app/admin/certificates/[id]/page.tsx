import CertificateForm from '@/components/admin/CertificateForm';
import { getCertificateTemplateById } from '@/lib/actions/course.actions';
import { notFound } from 'next/navigation';

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const template = await getCertificateTemplateById(id);
    // const template = null;

    if (!template) notFound();

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Certificate Template</h1>
            <CertificateForm initialData={template} isEdit />
        </div>
    );
}
