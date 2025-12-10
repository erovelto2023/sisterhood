import { getAdminCourses, deleteCourse } from '@/lib/actions/course.actions';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaBook, FaUsers, FaStar } from 'react-icons/fa';

export default async function AdminCoursesPage() {
    const courses = await getAdminCourses();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                    <p className="text-gray-500 mt-2">Manage your course catalog.</p>
                </div>
                <Link
                    href="/admin/courses/new"
                    className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-sm"
                >
                    <FaPlus className="mr-2" />
                    New Course
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: any) => (
                    <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
                        <div className="relative h-48 bg-gray-200">
                            {course.thumbnail ? (
                                <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-purple-100 text-purple-300">
                                    <FaBook className="h-12 w-12" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.status === 'published' ? 'bg-green-100 text-green-800' :
                                        course.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {course.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                                {course.shortDescription || course.description}
                            </p>

                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center">
                                    <FaUsers className="mr-2" />
                                    {course.enrollmentCount} Students
                                </div>
                                <div className="flex items-center">
                                    <FaStar className="mr-2 text-yellow-400" />
                                    {course.rating.toFixed(1)}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/courses/${course._id}`}
                                    className="flex-1 px-4 py-2 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors text-center"
                                >
                                    Manage
                                </Link>
                                <form action={async () => {
                                    'use server';
                                    await deleteCourse(course._id);
                                }}>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 text-2xl">
                        <FaBook />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No courses yet</h3>
                    <p className="text-gray-500 mt-2 mb-6">Create your first course to get started.</p>
                    <Link
                        href="/admin/courses/new"
                        className="inline-flex items-center px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
                    >
                        <FaPlus className="mr-2" />
                        Create Course
                    </Link>
                </div>
            )}
        </div>
    );
}
