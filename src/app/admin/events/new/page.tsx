import EventForm from '@/components/admin/EventForm';

export default function CreateEventPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
                <p className="text-gray-500 mt-2">Fill in the details to schedule a new event.</p>
            </div>

            <EventForm />
        </div>
    );
}
