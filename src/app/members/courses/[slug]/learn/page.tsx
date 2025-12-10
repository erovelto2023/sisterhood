import { getCourseBySlug, getStudentEnrollment } from '@/lib/actions/student-course.actions';
import { notFound, redirect } from 'next/navigation';
import CoursePlayer from '@/components/members/CoursePlayer';

export default async function CourseLearnPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getCourseBySlug(slug);

    if (!data) notFound();

    const { course, curriculum } = data;
    const enrollment = await getStudentEnrollment(course._id);

    // If not enrolled, redirect to landing page
    if (!enrollment) {
        redirect(`/members/courses/${slug}`);
    }

    return (
        <div className="fixed inset-0 top-16 z-50 bg-white">
            <CoursePlayer
                course={course}
                curriculum={curriculum}
                enrollment={enrollment}
            />
        </div>
    );
}
