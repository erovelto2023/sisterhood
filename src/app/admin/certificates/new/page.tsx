import CertificateForm from '@/components/admin/CertificateForm';

export default function NewCertificatePage() {
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Certificate Template</h1>
            <CertificateForm />
        </div>
    );
}
