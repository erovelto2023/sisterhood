import { getCourseBySlug, enrollInCourse, getStudentEnrollment } from '@/lib/actions/student-course.actions';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { FaPlay, FaCheck, FaLock, FaBookOpen, FaClock, FaUserGraduate } from 'react-icons/fa';

export default async function CourseLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getCourseBySlug(slug);

    if (!data) notFound();

    const { course, curriculum } = data;
    const enrollment = await getStudentEnrollment(course._id);

    // If already enrolled, redirect to player
    if (enrollment) {
        redirect(`/members/courses/${slug}/learn`);
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center space-x-2 text-sm font-medium text-purple-600 mb-2">
                        <span className="bg-purple-50 px-3 py-1 rounded-full">{course.category}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500 capitalize">{course.level} Level</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        {course.title}
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        {course.shortDescription || course.description.substring(0, 150) + '...'}
                    </p>

                    <div className="flex items-center space-x-8 text-gray-500 pt-4">
                        <div className="flex items-center">
                            <FaUserGraduate className="mr-2 text-purple-500" />
                            <span>{course.enrollmentCount} Students</span>
                        </div>
                        <div className="flex items-center">
                            <FaBookOpen className="mr-2 text-purple-500" />
                            <span>{curriculum.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0)} Lessons</span>
                        </div>
                        <div className="flex items-center">
                            <FaClock className="mr-2 text-purple-500" />
                            <span>Self-paced</span>
                        </div>
                    </div>

                    <div className="flex items-center pt-6">
                        <div className="mr-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden relative">
                                {/* Instructor Avatar Placeholder */}
                                <div className="absolute inset-0 bg-purple-200" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Instructor</p>
                            <p className="font-medium text-gray-900">{course.instructor.firstName} {course.instructor.lastName}</p>
                        </div>
                    </div>
                </div>

                {/* Enrollment Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
                        <div className="relative h-48 bg-gray-200">
                            {course.thumbnail ? (
                                <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-purple-50 text-purple-200">
                                    <FaBookOpen className="text-5xl" />
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900">
                                    {course.isFree ? 'Free' : `$${course.price}`}
                                </span>
                            </div>

                            <form action={async () => {
                                'use server';
                                await enrollInCourse(course._id);
                                redirect(`/members/courses/${slug}/learn`);
                            }}>
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center justify-center"
                                >
                                    {course.isFree ? 'Enroll for Free' : 'Buy Now'}
                                </button>
                            </form>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                30-day money-back guarantee. Full lifetime access.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Description */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
                        <div className="prose prose-purple max-w-none text-gray-600">
                            {course.description}
                        </div>
                    </section>

                    {/* Curriculum */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            {curriculum.map((module: any, index: number) => (
                                <div key={module._id} className="border-b border-gray-100 last:border-0">
                                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-900">
                                            Module {index + 1}: {module.title}
                                        </h3>
                                        <span className="text-sm text-gray-500">{module.lessons.length} lessons</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {module.lessons.map((lesson: any) => (
                                            <div key={lesson._id} className="px-6 py-3 flex items-center text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                                {lesson.isFreePreview ? (
                                                    <FaPlay className="text-purple-500 mr-3 text-xs" />
                                                ) : (
                                                    <FaLock className="text-gray-400 mr-3 text-xs" />
                                                )}
                                                <span className="flex-1">{lesson.title}</span>
                                                {lesson.duration && (
                                                    <span className="text-gray-400">{lesson.duration} min</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
