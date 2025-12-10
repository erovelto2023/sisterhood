import EventForm from '@/components/admin/EventForm';
import { getEventById } from '@/lib/actions/event.actions';
import { notFound } from 'next/navigation';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
                <p className="text-gray-500 mt-2">Update event details.</p>
            </div>

            <EventForm initialData={event} isEditing={true} />
        </div>
    );
}
