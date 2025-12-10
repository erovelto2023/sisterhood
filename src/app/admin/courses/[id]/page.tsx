import CourseForm from '@/components/admin/CourseForm';
import CurriculumBuilder from '@/components/admin/CurriculumBuilder';
import { getCourseById, getCourseModules } from '@/lib/actions/course.actions';
import { notFound } from 'next/navigation';

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = await getCourseById(id);
    const modules = await getCourseModules(id);

    if (!course) {
        notFound();
    }

    return (
        <div className="space-y-12">
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
                    <p className="text-gray-500 mt-2">Update course details and settings.</p>
                </div>
                <CourseForm initialData={course} isEditing={true} />
            </div>

            <div className="border-t border-gray-200 pt-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Curriculum</h2>
                    <p className="text-gray-500 mt-2">Manage modules and lessons.</p>
                </div>
                <div className="max-w-3xl">
                    <CurriculumBuilder courseId={course._id} initialModules={modules} />
                </div>
            </div>
        </div>
    );
}
