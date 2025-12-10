import CourseForm from '@/components/admin/CourseForm';

export default function CreateCoursePage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
                <p className="text-gray-500 mt-2">Start building your curriculum.</p>
            </div>

            <CourseForm />
        </div>
    );
}
